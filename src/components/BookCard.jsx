import React from "react";
import { convertThumbnailUrl } from "../utils/pdfUrlHandler";

const BookCard = ({ book, onEdit, onDelete, onView, onUpdateDownloads }) => {
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
    <div className={`card ${isPremiumBook ? "premium" : "standard"}`}>
      {isPremiumBook ? (
        <span className="premium-badge">⭐ PREMIUM</span>
      ) : (
        <span className="standard-badge">STANDARD</span>
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
      <h3>{book.iapSKUProductId}</h3>

      <p>{book.category}</p>
      <p>{book.genre || "No Genre"}</p>
      <p>{book.contentType || "Books"}</p>
      <div className="downloads-row">
        <p className="downloads">Downloads: {book.downloads || 0}</p>
        <div className="download-controls">
          {onUpdateDownloads && (
            <button
              className="small"
              onClick={() => onUpdateDownloads(book.id, 1)}
              title="Add one download"
            >
              +1
            </button>
          )}
        </div>
      </div>
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
