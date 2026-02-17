import React, { useState, useEffect } from "react";
import Home from "./pages/Home";
import "./index.css";
import {
  fetchBooks,
  addBookToFirebase,
  updateBookInFirebase,
  deleteBookFromFirebase,
} from "./firebase/firebaseService";

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load books from Firestore on component mount
  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const booksData = await fetchBooks();
      setBooks(booksData);
    } catch (err) {
      console.error("Failed to load books:", err);
      setError("Failed to load books. Please try again.");
      // Fallback to empty array if Firestore is not configured
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const addBook = async (book) => {
    try {
      debugger;
      const newBookId = await addBookToFirebase(book);
      debugger;

      setBooks([{ ...book, id: newBookId }, ...books]);
    } catch (err) {
      console.error("Failed to add book:", err);
      setError("Failed to add book. Please try again.");
    }
  };

  const updateBook = async (updatedBook) => {
    try {
      await updateBookInFirebase(updatedBook);
      setBooks(
        books.map((b) => (b.id === updatedBook.id ? updatedBook : b))
      );
    } catch (err) {
      console.error("Failed to update book:", err);
      setError("Failed to update book. Please try again.");
    }
  };

  const deleteBook = async (id) => {
    try {
      await deleteBookFromFirebase(id);
      setBooks(books.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Failed to delete book:", err);
      setError("Failed to delete book. Please try again.");
    }
  };

  if (loading) {
    return <div className="loading-container"><h2>⏳ Loading your books...</h2></div>;
  }

  return (
    <>
      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}
      <Home
        books={books}
        addBook={addBook}
        updateBook={updateBook}
        deleteBook={deleteBook}
      />
    </>
  );
}

export default App;
