import React from "react";
import { convertThumbnailUrl } from "../utils/pdfUrlHandler";

const BookCard = ({ book, onEdit, onDelete, onView }) => {
  const isPremiumBook = !!book.isPremium;

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${book.title}"? This action cannot be undone.`
    );
    if (confirmed) {
      onDelete(book.id);
    }
  };

  return (
    <div className="card">
      {isPremiumBook ? (
        <span className="premium">⭐ PREMIUM</span>
      ) : (
        <span className="free-badge">FREE</span>
      )}

      {book.thumbnailUrl ? (
        <img
          src={convertThumbnailUrl(book.thumbnailUrl)}
          alt={`${book.title} thumbnail`}
          className="book-thumbnail"
        />
      ) : (
        <div className="book-thumbnail placeholder">No Thumbnail</div>
      )}

      <h3>{book.title}</h3>
      <p>{book.category}</p>
      <p>{book.genre || "No Genre"}</p>
      <p>{book.contentType || "Books"}</p>
      {isPremiumBook && <p className="price-text">${book.price}</p>}

      <div className="buttons">
        <button className="view-btn" onClick={() => onView(book)}>
          View
        </button>

        <button onClick={() => onEdit(book)}>Edit</button>

        <button onClick={handleDelete} className="delete">
          Delete
        </button>
      </div>
    </div>
  );
};

export default BookCard;
