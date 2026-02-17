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

const BOOKS_COLLECTION = "books";

/**
 * Fetch all books from Firestore
 * @returns {Promise<Array>} Array of book objects with id field
 */
export const fetchBooks = async () => {
  try {
    const q = query(collection(db, BOOKS_COLLECTION), orderBy("title", "asc"));
    const querySnapshot = await getDocs(q);
    const books = [];
    querySnapshot.forEach((doc) => {
      books.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return books;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
};

/**
 * Add a new book to Firestore
 * @param {Object} book - Book object without id
 * @returns {Promise<string>} Document ID of the created book
 */
export const addBookToFirebase = async (book) => {
  try {
    debugger;
    const docRef = await addDoc(collection(db, BOOKS_COLLECTION), {
      ...book,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding book:", error);
    throw error;
  }
};

/**
 * Update an existing book in Firestore
 * @param {string} bookId - Document ID
 * @param {Object} book - Updated book object (should include id field)
 * @returns {Promise<void>}
 */
export const updateBookInFirebase = async (book) => {
  try {
    const { id, ...bookData } = book;
    const bookRef = doc(db, BOOKS_COLLECTION, id);
    await updateDoc(bookRef, {
      ...bookData,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating book:", error);
    throw error;
  }
};

/**
 * Delete a book from Firestore
 * @param {string} bookId - Document ID
 * @returns {Promise<void>}
 */
export const deleteBookFromFirebase = async (bookId) => {
  try {
    await deleteDoc(doc(db, BOOKS_COLLECTION, bookId));
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
