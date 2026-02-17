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

const CATEGORIES_COLLECTION = "categories";

/**
 * Fetch all categories from Firestore
 * @returns {Promise<Array>} Array of category objects with id field
 */
export const fetchCategories = async () => {
  try {
    const q = query(collection(db, CATEGORIES_COLLECTION), orderBy("name", "asc"));
    const querySnapshot = await getDocs(q);
    const categories = [];
    querySnapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

/**
 * Add a new category to Firestore
 * @param {string} name - Category name
 * @returns {Promise<string>} Document ID of the created category
 */
export const addCategoryToFirebase = async (name) => {
  try {
    const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), {
      name: name.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

/**
 * Update a category in Firestore
 * @param {string} categoryId - Category document ID
 * @param {string} name - Updated category name
 * @returns {Promise<void>}
 */
export const updateCategoryInFirebase = async (categoryId, name) => {
  try {
    const categoryRef = doc(db, CATEGORIES_COLLECTION, categoryId);
    await updateDoc(categoryRef, {
      name: name.trim(),
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

/**
 * Delete a category from Firestore
 * @param {string} categoryId - Category document ID
 * @returns {Promise<void>}
 */
export const deleteCategoryFromFirebase = async (categoryId) => {
  try {
    await deleteDoc(doc(db, CATEGORIES_COLLECTION, categoryId));
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
