# Google Drive PDF Integration Guide

## How to Add Google Drive PDFs to KidsZone CMS

### Step 1: Upload PDF to Google Drive
1. Go to [Google Drive](https://drive.google.com)
2. Upload your PDF file
3. Right-click the PDF → **Share**

### Step 2: Get the Sharing Link
1. Click **Share** → Set permissions to **Viewer** or **Commenter**
2. Copy the sharing link (it will look like):
   ```
   https://drive.google.com/file/d/1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p/view?usp=sharing
   ```

### Step 3: Add to KidsZone CMS
1. Click **+ Add Book** in the admin panel
2. Fill in Title, Category, Price
3. Paste the Google Drive link in the **Preview URL** field
4. The app will automatically convert it to a direct download URL
5. Check the live preview to verify it loads
6. Click **Add Book** to save to Firebase

### Example
```
Title: Harry Potter and the Philosopher's Stone
Category: Fantasy
Price: 9.99
Preview URL: https://drive.google.com/file/d/13Ugbm9lq1xYSFODU6t39XEJLrHk_OxTU/view?usp=sharing
```

## Supported URL Formats

✅ **Google Drive Sharing Links**
```
https://drive.google.com/file/d/{FILE_ID}/view?usp=sharing
https://drive.google.com/file/d/{FILE_ID}/view
```

✅ **Direct PDF URLs**
```
https://example.com/document.pdf
https://cdn.example.com/files/book.pdf
```

✅ **Local PDFs** (if hosted on your server)
```
/sample.pdf
/pdfs/mybook.pdf
```

## Troubleshooting

### ❌ "Invalid PDF URL" Error
**Cause**: URL is not accessible or not a valid PDF

**Solution**:
1. Check the Google Drive link is correct
2. Verify sharing is enabled (not restricted)
3. Try a direct PDF URL instead
4. Ensure the PDF is not corrupted

### ❌ "Failed to load PDF"
**Cause**: CORS (Cross-Origin) restriction or invalid permissions

**Solution**:
1. Use a Google Drive link (automatically converted)
2. Ensure Google Drive sharing is enabled
3. Check browser console for detailed error

### ❌ Blank PDF Preview
**Cause**: PDF is loading but not rendering

**Solution**:
1. Try using zoom controls (+ / - buttons)
2. Refresh the page
3. Test with a different PDF
4. Check browser console for errors

## How It Works

The app automatically detects Google Drive links and converts them:

```
Input:  https://drive.google.com/file/d/FILE_ID/view?usp=sharing
        ↓
Converted to: https://drive.google.com/uc?export=download&id=FILE_ID
        ↓
Displayed in PDF Viewer
```

This conversion enables the PDF viewer to access Google Drive PDFs without CORS issues.

## Best Practices

✅ Use **Viewer** sharing permission (not Editor)
✅ Test the PDF preview before saving the book
✅ Use clear, descriptive PDF file names
✅ Ensure PDFs are readable and not corrupted
✅ For large PDFs (>50MB), consider hosting directly instead

## Security Notes

🔒 Never share PDFs with public "Anyone with the link" if they contain sensitive data
🔒 Use Google Drive's access controls to limit who can view books
🔒 For premium books, consider hosting PDFs on a secure server instead
