import React, { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import { convertGoogleDriveUrl } from "../utils/pdfUrlHandler";
import { fetchCategories } from "../firebase/categoryService";
import { fetchGenres } from "../firebase/genreService";

const BookForm = ({ onSubmit, editingBook }) => {
  const [form, setForm] = useState({
    title: "",
    thumbnailUrl: "",
    category: "",
    genre: "",
    contentType: "Books",
    price: "",
    isPremium: false,
    previewUrl: "",
    iapSKUProductId: "",
  });

  const [numPages, setNumPages] = useState(null);
  const [zoom, setZoom] = useState(0.8);
  const [pdfError, setPdfError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingGenres, setLoadingGenres] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories.map((category) => category.name));
      } catch (error) {
        console.error("Failed to load categories in form:", error);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        setLoadingGenres(true);
        const fetchedGenres = await fetchGenres();
        setGenres(fetchedGenres.map((genre) => genre.name));
      } catch (error) {
        console.error("Failed to load genres in form:", error);
        setGenres([]);
      } finally {
        setLoadingGenres(false);
      }
    };

    loadGenres();
  }, []);

  useEffect(() => {
    if (editingBook) {
      debugger;
      setForm({
        title: editingBook.title || "",
        thumbnailUrl: editingBook.thumbnailUrl || "",
        category: editingBook.category || "",
        genre: editingBook.genre || "",
        contentType: editingBook.contentType || "Books",
        price: editingBook.price ?? "",
        isPremium: !!editingBook.isPremium,
        previewUrl: editingBook.previewUrl || "",
        iapSKUProductId: editingBook.iapSKUProductId || "",
        id: editingBook.id,
      });
    }
  }, [editingBook]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && name === "isPremium") {
      setForm((prevForm) => ({
        ...prevForm,
        isPremium: checked,
        price: checked ? prevForm.price : "",
      }));
      return;
    }

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const generateSKU = () => {
    const randomPart = () => Math.random().toString(36).substring(2, 12);
    return `book_${randomPart()}_${randomPart().substring(0, 5)}_${randomPart().substring(0, 2)}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      price: form.isPremium ? form.price : 0,
      iapSKUProductId: form.iapSKUProductId && form.iapSKUProductId.trim() !== "" 
  ? form.iapSKUProductId 
  : generateSKU(),
    });

    setForm({
      title: "",
      thumbnailUrl: "",
      category: "",
      genre: "",
      contentType: "Books",
      price: "",
      isPremium: false,
      previewUrl: "",
      iapSKUProductId: "",
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

  const categoryOptions = form.category
    ? Array.from(new Set([...categories, form.category]))
    : categories;

  const genreOptions = form.genre
    ? Array.from(new Set([...genres, form.genre]))
    : genres;

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
        name="thumbnailUrl"
        placeholder="Thumbnail image URL"
        value={form.thumbnailUrl}
        onChange={handleChange}
      />

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        required
        disabled={loadingCategories}
      >
        <option value="">
          {loadingCategories ? "Loading categories..." : "Select Category"}
        </option>
        {categoryOptions.map((categoryName) => (
          <option key={categoryName} value={categoryName}>
            {categoryName}
          </option>
        ))}
      </select>

      <select
        name="genre"
        value={form.genre}
        onChange={handleChange}
        required
        disabled={loadingGenres}
      >
        <option value="">
          {loadingGenres ? "Loading genres..." : "Select Genre"}
        </option>
        {genreOptions.map((genreName) => (
          <option key={genreName} value={genreName}>
            {genreName}
          </option>
        ))}
      </select>

      <select
        name="contentType"
        value={form.contentType}
        onChange={handleChange}
        required
      >
        <option value="Books">Books</option>
        <option value="Pages">Pages</option>
      </select>

      {form.isPremium && (
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          min="0"
          required
        />
      )}

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

      <input
        name="iapSKUProductId"
        placeholder="IAP SKU Product ID (auto-generated if empty)"
        value={form.iapSKUProductId}
        onChange={handleChange}
      />

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
