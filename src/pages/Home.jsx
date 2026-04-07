import React, { useState, useMemo, useEffect } from "react";
import BookCard from "../components/BookCard";
import BookForm from "../components/BookForm";
import Modal from "../components/Modal";
import ViewBook from "../components/ViewBook";
import CategoryManager from "../components/CategoryManager";
import GenreManager from "../components/GenreManager";
import { fetchCategories } from "../firebase/categoryService";
import { fetchGenres } from "../firebase/genreService";


const Home = ({ books, addBook, updateBook, deleteBook }) => {
  const [editingBook, setEditingBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [genreFilter, setGenreFilter] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [genres, setGenres] = useState(["All"]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showGenreManager, setShowGenreManager] = useState(false);

  const [viewingBook, setViewingBook] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [skuFilter, setSkuFilter] = useState("All");

  // Fetch categories from Firebase on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        const fetchedCategories = await fetchCategories();
        const categoryNames = fetchedCategories.map((cat) => cat.name);
        setCategories(["All", ...categoryNames]);
      } catch (error) {
        console.error("Failed to load categories:", error);
        setCategories(["All"]);
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, [showCategoryManager]);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        setLoadingGenres(true);
        const fetchedGenres = await fetchGenres();
        const genreNames = fetchedGenres.map((genre) => genre.name);
        setGenres(["All", ...genreNames]);
      } catch (error) {
        console.error("Failed to load genres:", error);
        setGenres(["All"]);
      } finally {
        setLoadingGenres(false);
      }
    };

    loadGenres();
  }, [showGenreManager]);


  // Dashboard calculations
const totalBooks = books.length;

const totalPremium = books.filter((b) => b.isPremium).length;

const totalFree = books.filter((b) => !b.isPremium).length;

const totalCategories = new Set(books.map((b) => b.category)).size;

const totalRevenue = books.reduce(
  (sum, book) => sum + Number(book.price),
  0
);



  const filteredBooks = useMemo(() => {
    const fromTs = dateFrom ? new Date(dateFrom).getTime() : null;
    const toTs = dateTo ? new Date(dateTo + "T23:59:59").getTime() : null;

    return books.filter((book) => {
      const matchSearch = book.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchCategory =
        categoryFilter === "All" || book.category === categoryFilter;

      const matchGenre =
        genreFilter === "All" || book.genre === genreFilter;

      const matchDate =
        (!fromTs || (book.createdAt && book.createdAt >= fromTs)) &&
        (!toTs || (book.createdAt && book.createdAt <= toTs));

      const matchSku =
        skuFilter === "All" ||
        (skuFilter === "Has SKU" && !!book.iapSKUProductId) ||
        (skuFilter === "Missing SKU" && !book.iapSKUProductId);

      return matchSearch && matchCategory && matchGenre && matchDate && matchSku;
    });
  }, [books, search, categoryFilter, genreFilter, dateFrom, dateTo, skuFilter]);


const filteredCount = filteredBooks.length;


  const openAddModal = () => {
    setEditingBook(null);
    setIsModalOpen(true);
  };

  const openEditModal = (book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleSubmit = (book) => {
    if (editingBook) {
      updateBook(book);
    } else {
      addBook(book);
    }
    setIsModalOpen(false);
    setEditingBook(null);
  };

  const openViewModal = (book) => {
  setViewingBook(book);
  setIsViewModalOpen(true);
};


  return (
    <div className="container">
      <h1>Kidszone Admin Panel</h1>


{/* Dashboard Stats */}
<div className="stats-grid">
  <div className="stat-card">
    <h3>{totalBooks}</h3>
    <p>Total Books</p>
  </div>

  <div className="stat-card premium-card">
    <h3>{totalPremium}</h3>
    <p>Premium Books</p>
  </div>

  <div className="stat-card free-card">
    <h3>{totalFree}</h3>
    <p>Free Books</p>
  </div>

  {/* <div className="stat-card">
    <h3>{totalCategories}</h3>
    <p>Categories</p>
  </div>

  <div className="stat-card revenue-card">
    <h3>${totalRevenue}</h3>
    <p>Total Revenue</p>
  </div>

  <div className="stat-card filter-card">
    <h3>{filteredCount}</h3>
    <p>Showing Results</p>
  </div> */}
</div>

{/* Category Manager Toggle */}
<div style={{ textAlign: "center", marginBottom: "20px" }}>
  <button
    className="add-btn"
    onClick={() => setShowCategoryManager(!showCategoryManager)}
    style={{ marginBottom: "20px" }}
  >
    {showCategoryManager ? "🔒 Hide Categories" : "📚 Manage Categories"}
  </button>

  <button
    className="add-btn"
    onClick={() => setShowGenreManager(!showGenreManager)}
    style={{ marginBottom: "20px", marginLeft: "12px" }}
  >
    {showGenreManager ? "🔒 Hide Genres" : "🎯 Manage Genres"}
  </button>
</div>

{/* Category Manager */}
{showCategoryManager && <CategoryManager />}
{showGenreManager && <GenreManager />}

      {/* Top Bar */}
      <div className="top-bar">
        <input
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          disabled={loadingCategories}
        >
          {categories.map((cat, index) => (
            <option key={index}>{cat}</option>
          ))}
        </select>

        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          disabled={loadingGenres}
        >
          {genres.map((genre, index) => (
            <option key={index}>{genre}</option>
          ))}
        </select>

        <select
          value={skuFilter}
          onChange={(e) => setSkuFilter(e.target.value)}
        >
          <option value="All">All SKU</option>
          <option value="Has SKU">Has SKU</option>
          <option value="Missing SKU">Missing SKU</option>
        </select>

        <button className="add-btn" onClick={openAddModal}>
          + Add Book
        </button>
      </div>

      {/* Date Filter */}
      <div className="date-filter-bar">
        <label>
          From:
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </label>
        <label>
          To:
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </label>
        {(dateFrom || dateTo) && (
          <button
            className="clear-date-btn"
            onClick={() => { setDateFrom(""); setDateTo(""); }}
          >
            Clear Dates
          </button>
        )}
      </div>

      {/* Book List */}
      <div className="grid">
        {filteredBooks.map((book) => (
         <BookCard
  key={book.id}
  book={book}
  onEdit={openEditModal}
  onDelete={deleteBook}
  onView={openViewModal}
/>

        ))}
      </div>

      {/* Shared Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <BookForm
          onSubmit={handleSubmit}
          editingBook={editingBook}
        />
      </Modal>


      {/* View Modal */}
<Modal
  isOpen={isViewModalOpen}
  onClose={() => setIsViewModalOpen(false)}
>
  <ViewBook book={viewingBook} />
</Modal>


    </div>
  );
};

export default Home;
