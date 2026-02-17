# Firebase Integration - Quick Reference

## Component Integration Examples

### Example 1: Using Firebase in Your Components

```javascript
// In your component
import { addBookToFirebase, updateBookInFirebase, deleteBookFromFirebase } from '../firebase/firebaseService';

// Add a book
const handleAddBook = async (bookData) => {
  try {
    const newBookId = await addBookToFirebase(bookData);
    console.log('Book added with ID:', newBookId);
  } catch (error) {
    console.error('Failed to add book:', error);
  }
};

// Update a book
const handleUpdateBook = async (bookData) => {
  try {
    await updateBookInFirebase(bookData); // Must include 'id' field
    console.log('Book updated');
  } catch (error) {
    console.error('Failed to update book:', error);
  }
};

// Delete a book
const handleDeleteBook = async (bookId) => {
  try {
    await deleteBookFromFirebase(bookId);
    console.log('Book deleted');
  } catch (error) {
    console.error('Failed to delete book:', error);
  }
};
```

### Example 2: Using Authentication (Future Enhancement)

```javascript
import { loginUser, logoutUser, subscribeToAuthState } from '../firebase/authService';

// Login
const handleLogin = async (email, password) => {
  try {
    const user = await loginUser(email, password);
    console.log('Logged in as:', user.email);
  } catch (error) {
    console.error('Login failed:', error);
  }
};

// Logout
const handleLogout = async () => {
  try {
    await logoutUser();
    console.log('Logged out');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

// Listen to auth changes
useEffect(() => {
  const unsubscribe = subscribeToAuthState((user) => {
    if (user) {
      console.log('User is logged in:', user.email);
    } else {
      console.log('User is logged out');
    }
  });
  
  return unsubscribe; // Cleanup subscription
}, []);
```

## Current Implementation in App.jsx

```javascript
// App.jsx already handles:
- Loading books on mount: loadBooks()
- Adding books: addBook(book)
- Updating books: updateBook(updatedBook)
- Deleting books: deleteBook(id)
- Error handling and loading states
```

## Firestore Data Structure

### Books Collection

```javascript
{
  id: "auto-generated-id",
  title: "Book Title",
  category: "Category",
  price: 9.99,
  isPremium: true,
  previewUrl: "https://example.com/book.pdf",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## Common Tasks

### Task 1: Add a Book Form Validation

```javascript
const validateBook = (book) => {
  if (!book.title?.trim()) return 'Title is required';
  if (!book.category?.trim()) return 'Category is required';
  if (book.price < 0) return 'Price cannot be negative';
  if (!book.previewUrl?.trim()) return 'PDF URL is required';
  return null;
};

// Usage in BookForm.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  const error = validateBook(form);
  if (error) {
    alert(error);
    return;
  }
  await onSubmit(form);
};
```

### Task 2: Add Loading Spinner

```javascript
// In your component
import { useState } from 'react';

const [isLoading, setIsLoading] = useState(false);

const handleDelete = async (bookId) => {
  setIsLoading(true);
  try {
    await deleteBookFromFirebase(bookId);
  } finally {
    setIsLoading(false);
  }
};

// In JSX
{isLoading ? <span>Deleting...</span> : <button>Delete</button>}
```

### Task 3: Add Success/Error Toast Notifications

```javascript
const [notification, setNotification] = useState(null);

const showNotification = (message, type = 'success') => {
  setNotification({ message, type });
  setTimeout(() => setNotification(null), 3000);
};

// Usage
const handleAddBook = async (bookData) => {
  try {
    await addBookToFirebase(bookData);
    showNotification('Book added successfully!', 'success');
  } catch (error) {
    showNotification('Failed to add book', 'error');
  }
};

// In JSX
{notification && (
  <div className={`notification ${notification.type}`}>
    {notification.message}
  </div>
)}
```

### Task 4: Filter Books by Premium Status

```javascript
const filterBooks = (books, filterType) => {
  switch (filterType) {
    case 'premium':
      return books.filter(b => b.isPremium);
    case 'free':
      return books.filter(b => !b.isPremium);
    default:
      return books;
  }
};

// Usage in Home.jsx
const premiumBooks = filterBooks(books, 'premium');
const freeBooks = filterBooks(books, 'free');
```

### Task 5: Search Books

```javascript
const searchBooks = (books, query) => {
  const lowerQuery = query.toLowerCase();
  return books.filter(book =>
    book.title.toLowerCase().includes(lowerQuery) ||
    book.category.toLowerCase().includes(lowerQuery)
  );
};

// Usage
const [searchTerm, setSearchTerm] = useState('');
const results = searchBooks(books, searchTerm);
```

## Environment Variables Setup

Create `.env.local` file in your project root:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=yourproject.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=yourproject
VITE_FIREBASE_STORAGE_BUCKET=yourproject.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

Access in components:
```javascript
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
```

## Debugging Tips

### 1. Check Firebase Connection

```javascript
import { db } from '../firebase/config';

// In your component or console
console.log('Firestore instance:', db);
```

### 2. Monitor Firestore Operations

In Firebase Console:
1. Go to **Firestore Database**
2. Click **Rules** tab to verify rules
3. Check **Firestore Logs** in Cloud Logging for errors

### 3. Console Debugging

```javascript
// Add this to see all database operations
export const debugFirestore = async () => {
  try {
    const books = await fetchBooks();
    console.table(books);
  } catch (error) {
    console.error('Debug info:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
  }
};
```

## Performance Tips

1. **Use Pagination**: Load only 10-20 books per page
2. **Firestore Indexes**: Create indexes for frequently queried fields
3. **Caching**: Cache books locally to reduce database hits
4. **Real-time Listeners**: Use `onSnapshot()` for live updates (future enhancement)

## Next Steps for Enhancement

- [ ] Add user authentication
- [ ] Implement role-based access control
- [ ] Add real-time book updates with listeners
- [ ] Implement PDF upload to Cloud Storage
- [ ] Add user reviews/ratings
- [ ] Implement search with Algolia
- [ ] Add analytics tracking
- [ ] Implement offline support with Firestore offline persistence
