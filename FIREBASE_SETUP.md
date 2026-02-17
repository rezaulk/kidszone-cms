# Firebase Integration Setup Guide

This document explains how to set up Firebase for the Kidszone CMS application.

## Prerequisites

- Firebase project created at [Firebase Console](https://console.firebase.google.com)
- Admin access to your Firebase project

## Setup Steps

### 1. Create a New Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter your project name (e.g., "kidszone-cms")
4. Follow the setup wizard

### 2. Enable Firebase Services

#### Firestore Database
1. In Firebase Console, go to **Build → Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select the region close to your location
5. Click **Create**

#### Firebase Storage (Optional - for PDF uploads)
1. Go to **Build → Storage**
2. Click **Get started**
3. Review the security rules and click **Done**

#### Authentication (Optional - if you want user authentication)
1. Go to **Build → Authentication**
2. Click **Get started**
3. Enable desired auth methods (Email/Password, Google, etc.)

### 3. Get Firebase Configuration

1. In Firebase Console, click the gear icon (Settings) next to "Project Overview"
2. Go to **Project settings**
3. Scroll down to "Your apps" section
4. Find your web app (or create one by clicking the `</>` icon)
5. Copy the Firebase config object with the following fields:
   - API Key
   - Auth Domain
   - Project ID
   - Storage Bucket
   - Messaging Sender ID
   - App ID

### 4. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Firebase configuration values in `.env.local`:
   ```
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
   VITE_FIREBASE_PROJECT_ID=your_project_id_here
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
   VITE_FIREBASE_APP_ID=your_app_id_here
   ```

### 5. Install Dependencies

```bash
npm install
```

### 6. Start Development Server

```bash
npm run dev
```

## Firestore Database Structure

Books are stored in a collection called `books` with the following structure:

```
books/
├── {bookId1}
│   ├── id: string (auto-generated)
│   ├── title: string
│   ├── category: string
│   ├── price: number
│   ├── isPremium: boolean
│   ├── previewUrl: string (URL to PDF)
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
├── {bookId2}
│   └── ...
```

## Firebase Security Rules

### Firestore Rules (Development)

For development, use these test mode rules. **Update for production!**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write for all users (development only!)
    match /books/{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Firestore Rules (Production)

For production, implement proper authentication:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read/write
    match /books/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## File Structure

```
src/
├── firebase/
│   ├── config.js           # Firebase initialization
│   └── firebaseService.js  # Book CRUD operations
├── components/
│   ├── BookCard.jsx
│   ├── BookForm.jsx
│   ├── Modal.jsx
│   └── ViewBook.jsx
├── pages/
│   └── Home.jsx
├── App.jsx                 # Updated with Firebase
├── main.jsx
└── index.css
```

## Available Functions (firebaseService.js)

### fetchBooks()
Retrieves all books from Firestore, ordered by creation date (newest first).

```javascript
const books = await fetchBooks();
```

### addBookToFirebase(book)
Adds a new book to Firestore.

```javascript
const bookId = await addBookToFirebase({
  title: "Book Title",
  category: "Category",
  price: 9.99,
  isPremium: true,
  previewUrl: "https://example.com/book.pdf"
});
```

### updateBookInFirebase(book)
Updates an existing book (must include `id` field).

```javascript
await updateBookInFirebase({
  id: "bookId",
  title: "Updated Title",
  category: "Category",
  price: 14.99,
  isPremium: false,
  previewUrl: "https://example.com/book.pdf"
});
```

### deleteBookFromFirebase(bookId)
Deletes a book from Firestore.

```javascript
await deleteBookFromFirebase("bookId");
```

## Troubleshooting

### "Permission denied" errors
- Ensure Firestore Database is enabled in Firebase Console
- Check your security rules (set to test mode for development)
- Verify environment variables are correctly set

### "Firebase is not defined"
- Make sure Firebase SDK is installed: `npm install`
- Check that `.env.local` exists with correct values

### PDFs not loading
- PDFs must be from a public URL or Firebase Storage
- CORS headers should allow your domain

## Next Steps

1. **Add Authentication**: Implement user login to track book ownership and permissions
2. **PDF Upload**: Enable users to upload PDFs to Firebase Storage
3. **User Profiles**: Store user data and their book collections
4. **Cloud Functions**: Add backend logic for complex operations
5. **Real-time Updates**: Use Firestore listeners for live data synchronization

## Environment Variables Checklist

- [ ] Created `.env.local` file
- [ ] Added `VITE_FIREBASE_API_KEY`
- [ ] Added `VITE_FIREBASE_AUTH_DOMAIN`
- [ ] Added `VITE_FIREBASE_PROJECT_ID`
- [ ] Added `VITE_FIREBASE_STORAGE_BUCKET`
- [ ] Added `VITE_FIREBASE_MESSAGING_SENDER_ID`
- [ ] Added `VITE_FIREBASE_APP_ID`
- [ ] Created Firestore Database
- [ ] Set Firestore Rules
- [ ] Installed dependencies (`npm install`)

For more information, visit the [Firebase Documentation](https://firebase.google.com/docs).
