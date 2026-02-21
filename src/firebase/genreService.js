import {
  get,
  push,
  ref,
  remove,
  set,
  update,
} from "firebase/database";
import { db } from "./config";

const GENRES_COLLECTION = "genres";

/**
 * Fetch all genres from Realtime Database
 * @returns {Promise<Array>} Array of genre objects with id field
 */
export const fetchGenres = async () => {
  try {
    const snapshot = await get(ref(db, GENRES_COLLECTION));

    if (!snapshot.exists()) {
      return [];
    }

    const genres = Object.entries(snapshot.val()).map(([id, value]) => ({
      id,
      ...value,
    }));

    return genres.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  } catch (error) {
    console.error("Error fetching genres:", error);
    throw error;
  }
};

/**
 * Add a new genre to Realtime Database
 * @param {string} name - Genre name
 * @returns {Promise<string>} Generated key of the created genre
 */
export const addGenreToFirebase = async (name) => {
  try {
    const genresRef = ref(db, GENRES_COLLECTION);
    const newGenreRef = push(genresRef);

    await set(newGenreRef, {
      name: name.trim(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return newGenreRef.key;
  } catch (error) {
    console.error("Error adding genre:", error);
    throw error;
  }
};

/**
 * Update a genre in Realtime Database
 * @param {string} genreId - Genre key
 * @param {string} name - Updated genre name
 * @returns {Promise<void>}
 */
export const updateGenreInFirebase = async (genreId, name) => {
  try {
    await update(ref(db, `${GENRES_COLLECTION}/${genreId}`), {
      name: name.trim(),
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error("Error updating genre:", error);
    throw error;
  }
};

/**
 * Delete a genre from Realtime Database
 * @param {string} genreId - Genre key
 * @returns {Promise<void>}
 */
export const deleteGenreFromFirebase = async (genreId) => {
  try {
    await remove(ref(db, `${GENRES_COLLECTION}/${genreId}`));
  } catch (error) {
    console.error("Error deleting genre:", error);
    throw error;
  }
};
