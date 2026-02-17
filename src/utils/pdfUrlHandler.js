/**
 * Convert Google Drive sharing link to preview iframe URL
 * @param {string} url - Google Drive sharing URL or direct PDF URL
 * @returns {object} Object with type and URL
 */
export const convertGoogleDriveUrl = (url) => {
  if (!url) return null;

  // Check if it's a Google Drive sharing link
  const googleDriveShareRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9-_]+)/;
  const match = url.match(googleDriveShareRegex);

  if (match && match[1]) {
    const fileId = match[1];
    // Return iframe preview URL (works without CORS issues)
    return {
      type: 'iframe',
      url: `https://drive.google.com/file/d/${fileId}/preview`
    };
  }

  // Return as direct PDF (react-pdf)
  return {
    type: 'pdf',
    url: url
  };
};
