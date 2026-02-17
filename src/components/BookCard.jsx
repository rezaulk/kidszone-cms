import React from "react";

const BookCard = ({ book, onEdit, onDelete, onView }) => {
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
      {book.isPremium && <span className="premium">⭐ PREMIUM</span>}

      <h3>{book.title}</h3>
      <p>{book.category}</p>
      <p>${book.price}</p>

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
