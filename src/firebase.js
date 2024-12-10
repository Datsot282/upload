// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6rMzD7UGFI09yhgAMfpmxzT4LTbamyi0",
  authDomain: "inventory-c526b.firebaseapp.com",
  projectId: "inventory-c526b",
  storageBucket: "inventory-c526b.firebasestorage.app",
  messagingSenderId: "210043635602",
  appId: "1:210043635602:web:9ce79df0dc31130b9ae34b",
  measurementId: "G-1KE4N3PHR1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Export the Firebase app and auth instance
export { auth };
