document.addEventListener("DOMContentLoaded", () => {
  const bookList = document.getElementById("book-list");
  const form = document.getElementById("book-form");
  const filter = document.getElementById("filter");

  const API_URL = "http://localhost:3000/books";

  let books = [];

  // Fetch books from server
  function fetchBooks() {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        books = data;
        renderBooks(books);
      });
  }

  // Render books to DOM
  function renderBooks(bookArray) {
    bookList.innerHTML = "";
    bookArray.forEach(book => {
      const li = document.createElement("li");
      li.className = "book-item";
      li.innerHTML = `
        <span><strong>${book.title}</strong> by ${book.author}</span>
        <span>Status: ${book.status}</span>
        <button class="toggle-status" data-id="${book.id}">Mark as ${book.status === "read" ? "Unread" : "Read"}</button>
      `;
      bookList.appendChild(li);
    });
  }

  // Add a new book
  form.addEventListener("submit", e => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;

    const newBook = {
      title,
      author,
      status: "unread"
    };

    fetch(API_URL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(newBook)
    })
      .then(res => res.json())
      .then(book => {
        books.push(book);
        renderBooks(books);
        form.reset();
      });
  });

  // Toggle read/unread status
  bookList.addEventListener("click", e => {
    if (e.target.classList.contains("toggle-status")) {
      const id = e.target.dataset.id;
      const book = books.find(b => b.id == id);
      const updatedStatus = book.status === "read" ? "unread" : "read";

      fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ status: updatedStatus })
      })
        .then(res => res.json())
        .then(updatedBook => {
          books = books.map(b => b.id == id ? updatedBook : b);
          renderBooks(books);
        });
    }
  });

  // Filter books by status
  filter.addEventListener("change", e => {
    const value = e.target.value;
    let filteredBooks = books;

    if (value === "read") {
      filteredBooks = books.filter(book => book.status === "read");
    } else if (value === "unread") {
      filteredBooks = books.filter(book => book.status === "unread");
    }

    renderBooks(filteredBooks);
  });

  fetchBooks();
});
