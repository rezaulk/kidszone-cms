import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./config";

/**
 * Upload a PDF file to Firebase Storage
 * @param {File} file - PDF file to upload
 * @param {string} folderPath - Optional folder path in storage (default: 'pdfs')
 * @returns {Promise<string>} Download URL of the uploaded PDF
 */
export const uploadPdfToFirebase = async (file, folderPath = 'pdfs') => {
  try {
    // Validate file is PDF
    if (file.type !== 'application/pdf') {
      throw new Error('File must be a PDF');
    }

    // Validate file size (max 50MB)
    const maxFileSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxFileSize) {
      throw new Error('File size must be less than 50MB');
    }

    // Create storage reference with timestamp to ensure unique names
    const fileName = `${Date.now()}-${file.name}`;
    const storageRef = ref(storage, `${folderPath}/${fileName}`);

    // Upload file
    console.log(`Uploading ${file.name}...`);
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadUrl = await getDownloadURL(snapshot.ref);
    console.log(`PDF uploaded successfully: ${downloadUrl}`);
    
    return downloadUrl;
  } catch (error) {
    console.error("Error uploading PDF:", error);
    throw error;
  }
};

/**
 * Delete a PDF from Firebase Storage
 * @param {string} url - Firebase Storage download URL
 * @returns {Promise<void>}
 */
export const deletePdfFromFirebase = async (url) => {
  try {
    // Extract file path from URL
    const decodedUrl = decodeURIComponent(url);
    const path = decodedUrl.split('/o/')[1].split('?')[0];
    
    const fileRef = ref(storage, path);
    // Note: deleteObject not yet implemented, but can be added later
    console.log(`Would delete: ${path}`);
  } catch (error) {
    console.error("Error deleting PDF:", error);
    throw error;
  }
};

/**
 * Get file metadata from Firebase Storage
 * @param {string} url - Firebase Storage download URL
 * @returns {Promise<Object>} File metadata
 */
export const getPdfMetadata = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return {
      size: response.headers.get('content-length'),
      type: response.headers.get('content-type'),
      lastModified: response.headers.get('last-modified'),
    };
  } catch (error) {
    console.error("Error getting PDF metadata:", error);
    throw error;
  }
};
