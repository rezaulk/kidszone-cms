import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import { convertGoogleDriveUrl, convertThumbnailUrl } from "../utils/pdfUrlHandler";

const ViewBook = ({ book }) => {
  const [numPages, setNumPages] = useState(null);
  const [zoom, setZoom] = useState(1.2);
  const [pdfError, setPdfError] = useState(null);

  if (!book) return null;

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPdfError(null);
  };

  const onDocumentLoadError = (error) => {
    console.error("PDF load error:", error);
    setPdfError("Failed to load PDF.");
  };

  return (
    <div className="view-container">
      {book.thumbnailUrl ? (
        <img
          src={convertThumbnailUrl(book.thumbnailUrl)}
          alt={`${book.title} thumbnail`}
          className="view-thumbnail"
        />
      ) : (
        <div className="view-thumbnail placeholder">No Thumbnail</div>
      )}

      <h2>{book.title}</h2>

      <p><strong>Category:</strong> {book.category}</p>
      <p><strong>Genre:</strong> {book.genre || "No Genre"}</p>
      <p><strong>Content:</strong> {book.contentType || "Books"}</p>
      <p>
        <strong>Price:</strong> {book.isPremium ? `$${book.price}` : "Free"}
      </p>
      <p>
        <strong>Type:</strong>{" "}
        {book.isPremium ? "Premium Book" : "Free Book"}
      </p>

      {/* Zoom Controls - only for direct PDFs */}
      {convertGoogleDriveUrl(book.previewUrl)?.type === 'pdf' && (
        <div className="pdf-controls">
          <button onClick={() => setZoom(zoom - 0.2)}>-</button>
          <span>Zoom: {zoom.toFixed(1)}x</span>
          <button onClick={() => setZoom(zoom + 0.2)}>+</button>
        </div>
      )}

      {pdfError && (
        <div style={{
          padding: "10px",
          backgroundColor: "#fee",
          color: "#c00",
          borderRadius: "4px",
          marginBottom: "10px",
          fontSize: "0.9em"
        }}>
          ⚠️ {pdfError}
        </div>
      )}

      {/* PDF Viewer */}
      <div className="pdf-scroll-container">
        {convertGoogleDriveUrl(book.previewUrl)?.type === 'iframe' ? (
          // Google Drive iframe preview
          <iframe
            src={convertGoogleDriveUrl(book.previewUrl)?.url}
            style={{
              width: '100%',
              height: '800px',
              border: 'none',
              borderRadius: '4px'
            }}
            title="PDF Preview"
          />
        ) : (
          // react-pdf for direct URLs
          <Document
            file={convertGoogleDriveUrl(book.previewUrl)?.url}
            onLoadSuccess={onDocumentLoadSuccess}
            onError={onDocumentLoadError}
            options={{
              cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
              cMapPacked: true,
            }}
          >
            {numPages && Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                scale={zoom}
              />
            ))}
          </Document>
        )}
      </div>

      <p>Total Pages: {numPages}</p>
    </div>
  );
};

export default ViewBook;
