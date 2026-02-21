import {
  get,
  push,
  ref,
  remove,
  set,
  update,
} from "firebase/database";
import { db } from "./config";

const CATEGORIES_COLLECTION = "categories";

/**
 * Fetch all categories from Realtime Database
 * @returns {Promise<Array>} Array of category objects with id field
 */
export const fetchCategories = async () => {
  try {
    const snapshot = await get(ref(db, CATEGORIES_COLLECTION));

    if (!snapshot.exists()) {
      return [];
    }

    const categories = Object.entries(snapshot.val()).map(([id, value]) => ({
      id,
      ...value,
    }));

    return categories.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

/**
 * Add a new category to Realtime Database
 * @param {string} name - Category name
 * @returns {Promise<string>} Generated key of the created category
 */
export const addCategoryToFirebase = async (name) => {
  try {
    const categoriesRef = ref(db, CATEGORIES_COLLECTION);
    const newCategoryRef = push(categoriesRef);

    await set(newCategoryRef, {
      name: name.trim(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return newCategoryRef.key;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

/**
 * Update a category in Realtime Database
 * @param {string} categoryId - Category key
 * @param {string} name - Updated category name
 * @returns {Promise<void>}
 */
export const updateCategoryInFirebase = async (categoryId, name) => {
  try {
    await update(ref(db, `${CATEGORIES_COLLECTION}/${categoryId}`), {
      name: name.trim(),
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

/**
 * Delete a category from Realtime Database
 * @param {string} categoryId - Category key
 * @returns {Promise<void>}
 */
export const deleteCategoryFromFirebase = async (categoryId) => {
  try {
    await remove(ref(db, `${CATEGORIES_COLLECTION}/${categoryId}`));
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
