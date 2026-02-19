import React, { useState, useEffect } from "react";
import {
  fetchGenres,
  addGenreToFirebase,
  updateGenreInFirebase,
  deleteGenreFromFirebase,
} from "../firebase/genreService";

const GenreManager = () => {
  const [genres, setGenres] = useState([]);
  const [newGenreName, setNewGenreName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [loadingGenres, setLoadingGenres] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = async () => {
    try {
      setLoadingGenres(true);
      const fetchedGenres = await fetchGenres();
      setGenres(fetchedGenres);
      setError(null);
    } catch (err) {
      setError("Failed to load genres");
      console.error(err);
    } finally {
      setLoadingGenres(false);
    }
  };

  const handleAddGenre = async (e) => {
    e.preventDefault();
    if (!newGenreName.trim()) {
      setError("Genre name cannot be empty");
      return;
    }

    try {
      setLoading(true);
      await addGenreToFirebase(newGenreName);
      setNewGenreName("");
      await loadGenres();
      setError(null);
    } catch (err) {
      setError("Failed to add genre");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGenre = async (id) => {
    if (!editingName.trim()) {
      setError("Genre name cannot be empty");
      return;
    }

    try {
      setLoading(true);
      await updateGenreInFirebase(id, editingName);
      setEditingId(null);
      setEditingName("");
      await loadGenres();
      setError(null);
    } catch (err) {
      setError("Failed to update genre");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGenre = async (id) => {
    if (!window.confirm("Are you sure you want to delete this genre?")) {
      return;
    }

    try {
      setLoading(true);
      await deleteGenreFromFirebase(id);
      await loadGenres();
      setError(null);
    } catch (err) {
      setError("Failed to delete genre");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (genre) => {
    setEditingId(genre.id);
    setEditingName(genre.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  return (
    <div className="category-manager">
      <h2>🎯 Manage Genres</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="category-form">
        <h3>Add New Genre</h3>
        <form onSubmit={handleAddGenre}>
          <input
            type="text"
            placeholder="Enter genre name (e.g., Adventure, Educational, Fantasy)"
            value={newGenreName}
            onChange={(e) => setNewGenreName(e.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "+ Add Genre"}
          </button>
        </form>
      </div>

      <div className="categories-list">
        <h3>All Genres ({genres.length})</h3>
        {loadingGenres ? (
          <p className="loading">Loading genres...</p>
        ) : genres.length === 0 ? (
          <p className="empty">No genres yet. Add one above!</p>
        ) : (
          <ul>
            {genres.map((genre) => (
              <li key={genre.id} className="category-item">
                {editingId === genre.id ? (
                  <div className="edit-form">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      disabled={loading}
                    />
                    <button
                      className="save-btn"
                      onClick={() => handleUpdateGenre(genre.id)}
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
                    <span className="category-name">{genre.name}</span>
                    <div className="category-actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleStartEdit(genre)}
                        disabled={loading}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteGenre(genre.id)}
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

export default GenreManager;
