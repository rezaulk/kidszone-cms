import {
  get,
  push,
  ref,
  remove,
  set,
  update,
} from "firebase/database";
import { db } from "./config";

const BOOKS_COLLECTION = "books";

/**
 * Fetch all books from Realtime Database
 * @returns {Promise<Array>} Array of book objects with id field
 */
export const fetchBooks = async () => {
  try {
    const snapshot = await get(ref(db, BOOKS_COLLECTION));

    if (!snapshot.exists()) {
      return [];
    }

    const books = Object.entries(snapshot.val()).map(([id, value]) => ({
      id,
      ...value,
    }));

    return books.sort((a, b) =>
      (a.title || "").localeCompare(b.title || "")
    );
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
};

/**
 * Add a new book to Realtime Database
 * @param {Object} book - Book object without id
 * @returns {Promise<string>} Generated key of the created book
 */
export const addBookToFirebase = async (book) => {
  try {
    const booksRef = ref(db, BOOKS_COLLECTION);
    const newBookRef = push(booksRef);

    await set(newBookRef, {
      ...book,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return newBookRef.key;
  } catch (error) {
    console.error("Error adding book:", error);
    throw error;
  }
};

/**
 * Update an existing book in Realtime Database
 * @param {Object} book - Updated book object (should include id field)
 * @returns {Promise<void>}
 */
export const updateBookInFirebase = async (book) => {
  try {
    const { id, ...bookData } = book;

    await update(ref(db, `${BOOKS_COLLECTION}/${id}`), {
      ...bookData,
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error("Error updating book:", error);
    throw error;
  }
};

/**
 * Delete a book from Realtime Database
 * @param {string} bookId - Realtime DB key
 * @returns {Promise<void>}
 */
export const deleteBookFromFirebase = async (bookId) => {
  try {
    await remove(ref(db, `${BOOKS_COLLECTION}/${bookId}`));
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error;
  }
};

/**
 * Upload a PDF file to Firebase Storage
 * Note: Implement this if you want to store PDFs in Firebase
 * For now, book.previewUrl should contain a public PDF URL
 */
// export const uploadPDF = async (file) => {
//   try {
//     const storageRef = ref(storage, `pdfs/${Date.now()}-${file.name}`);
//     const snapshot = await uploadBytes(storageRef, file);
//     const downloadUrl = await getDownloadURL(snapshot.ref);
//     return downloadUrl;
//   } catch (error) {
//     console.error("Error uploading PDF:", error);
//     throw error;
//   }
// };
