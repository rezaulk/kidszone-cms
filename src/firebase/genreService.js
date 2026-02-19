import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./config";

const GENRES_COLLECTION = "genres";

/**
 * Fetch all genres from Firestore
 * @returns {Promise<Array>} Array of genre objects with id field
 */
export const fetchGenres = async () => {
  try {
    const q = query(collection(db, GENRES_COLLECTION), orderBy("name", "asc"));
    const querySnapshot = await getDocs(q);
    const genres = [];
    querySnapshot.forEach((genreDoc) => {
      genres.push({
        id: genreDoc.id,
        ...genreDoc.data(),
      });
    });
    return genres;
  } catch (error) {
    console.error("Error fetching genres:", error);
    throw error;
  }
};

/**
 * Add a new genre to Firestore
 * @param {string} name - Genre name
 * @returns {Promise<string>} Document ID of the created genre
 */
export const addGenreToFirebase = async (name) => {
  try {
    const docRef = await addDoc(collection(db, GENRES_COLLECTION), {
      name: name.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding genre:", error);
    throw error;
  }
};

/**
 * Update a genre in Firestore
 * @param {string} genreId - Genre document ID
 * @param {string} name - Updated genre name
 * @returns {Promise<void>}
 */
export const updateGenreInFirebase = async (genreId, name) => {
  try {
    const genreRef = doc(db, GENRES_COLLECTION, genreId);
    await updateDoc(genreRef, {
      name: name.trim(),
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating genre:", error);
    throw error;
  }
};

/**
 * Delete a genre from Firestore
 * @param {string} genreId - Genre document ID
 * @returns {Promise<void>}
 */
export const deleteGenreFromFirebase = async (genreId) => {
  try {
    await deleteDoc(doc(db, GENRES_COLLECTION, genreId));
  } catch (error) {
    console.error("Error deleting genre:", error);
    throw error;
  }
};
