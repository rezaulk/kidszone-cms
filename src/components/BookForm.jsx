import React, { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import { convertGoogleDriveUrl } from "../utils/pdfUrlHandler";

const BookForm = ({ onSubmit, editingBook }) => {
  const [form, setForm] = useState({
    title: "",
    category: "",
    price: "",
    isPremium: false,
    previewUrl: "",
  });

  const [numPages, setNumPages] = useState(null);
  const [zoom, setZoom] = useState(0.8);
  const [pdfError, setPdfError] = useState(null);

  useEffect(() => {
    if (editingBook) {
      setForm(editingBook);
    }
  }, [editingBook]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);

    setForm({
      title: "",
      category: "",
      price: "",
      isPremium: false,
      previewUrl: "",
    });
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPdfError(null);
  };

  const onDocumentLoadError = (error) => {
    console.error("PDF load error:", error);
    setPdfError("Failed to load PDF. Check URL format.");
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        required
      />

      <input
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
        required
      />

      <input
        name="price"
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
        required
      />

      <input
        name="previewUrl"
        placeholder="Google Drive link or direct PDF URL"
        value={form.previewUrl}
        onChange={handleChange}
        required
      />
      <small style={{ opacity: 0.7 }}>
        ✅ Google Drive: https://drive.google.com/file/d/FILE_ID/view
        <br/>
        ✅ Direct PDF: https://example.com/book.pdf
      </small>

      <label>
        <input
          type="checkbox"
          name="isPremium"
          checked={form.isPremium}
          onChange={handleChange}
        />
        Premium Book
      </label>

      <button type="submit">
        {editingBook ? "Update Book" : "Add Book"}
      </button>

      {/* 🔥 LIVE PDF PREVIEW */}
      {form.previewUrl && (
        <div className="live-preview">
          <h4>PDF Preview</h4>

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

          {convertGoogleDriveUrl(form.previewUrl)?.type === 'iframe' ? (
            // Google Drive iframe preview
            <iframe
              src={convertGoogleDriveUrl(form.previewUrl)?.url}
              style={{
                width: '100%',
                height: '500px',
                border: 'none',
                borderRadius: '4px'
              }}
              title="PDF Preview"
            />
          ) : (
            // react-pdf for direct URLs
            <div className="pdf-mini-container">
              <Document
                file={form.previewUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onError={onDocumentLoadError}
                loading="Loading PDF..."
                error="Unable to load PDF"
                options={{
                  cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
                  cMapPacked: true,
                }}
              >
                {numPages &&
                  Array.from(new Array(numPages), (el, index) => (
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      scale={zoom}
                    />
                  ))}
              </Document>
            </div>
          )}

          {convertGoogleDriveUrl(form.previewUrl)?.type === 'pdf' && (
            <div className="pdf-controls">
              <button type="button" onClick={() => setZoom(zoom - 0.1)}>
                -
              </button>
              <span>{zoom.toFixed(1)}x</span>
              <button type="button" onClick={() => setZoom(zoom + 0.1)}>
                +
              </button>
            </div>
          )}
        </div>
      )}
    </form>
  );
};

export default BookForm;
