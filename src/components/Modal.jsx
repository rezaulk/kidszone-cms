import React from "react";

const Modal = ({ isOpen, onClose, children, title, icon, size }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal${size ? ` modal-${size}` : ""}`}>
        {title && (
          <div className="modal-header">
            <h2>
              {icon && <span className="modal-header-icon">{icon}</span>}
              {title}
            </h2>
          </div>
        )}
        <button className="close-btn" onClick={onClose} aria-label="Close modal">
          ×
        </button>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
