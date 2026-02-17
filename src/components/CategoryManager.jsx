import React, { useState, useEffect } from "react";
import {
  fetchCategories,
  addCategoryToFirebase,
  updateCategoryInFirebase,
  deleteCategoryFromFirebase,
} from "../firebase/categoryService";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
      setError(null);
    } catch (err) {
      setError("Failed to load categories");
      console.error(err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setError("Category name cannot be empty");
      return;
    }

    try {
      setLoading(true);
      await addCategoryToFirebase(newCategoryName);
      setNewCategoryName("");
      await loadCategories();
      setError(null);
    } catch (err) {
      setError("Failed to add category");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async (id) => {
    if (!editingName.trim()) {
      setError("Category name cannot be empty");
      return;
    }

    try {
      setLoading(true);
      await updateCategoryInFirebase(id, editingName);
      setEditingId(null);
      setEditingName("");
      await loadCategories();
      setError(null);
    } catch (err) {
      setError("Failed to update category");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      setLoading(true);
      await deleteCategoryFromFirebase(id);
      await loadCategories();
      setError(null);
    } catch (err) {
      setError("Failed to delete category");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  return (
    <div className="category-manager">
      <h2>📚 Manage Categories</h2>

      {error && <div className="error-message">{error}</div>}

      {/* Add New Category Form */}
      <div className="category-form">
        <h3>Add New Category</h3>
        <form onSubmit={handleAddCategory}>
          <input
            type="text"
            placeholder="Enter category name (e.g., Coloring, Puzzle, Stories)"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "+ Add Category"}
          </button>
        </form>
      </div>

      {/* Categories List */}
      <div className="categories-list">
        <h3>All Categories ({categories.length})</h3>
        {loadingCategories ? (
          <p className="loading">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="empty">No categories yet. Add one above!</p>
        ) : (
          <ul>
            {categories.map((category) => (
              <li key={category.id} className="category-item">
                {editingId === category.id ? (
                  <div className="edit-form">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      disabled={loading}
                    />
                    <button
                      className="save-btn"
                      onClick={() => handleUpdateCategory(category.id)}
                      disabled={loading}
                    >
                      Save
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={handleCancelEdit}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="category-display">
                    <span className="category-name">{category.name}</span>
                    <div className="category-actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleStartEdit(category)}
                        disabled={loading}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteCategory(category.id)}
                        disabled={loading}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CategoryManager;
