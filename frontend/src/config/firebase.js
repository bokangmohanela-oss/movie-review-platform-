// Import Firebase modules
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJirR85Bc10KwtxYrt4RgzgdgnpSYmHH0",
  authDomain: "review-72cd1.firebaseapp.com",
  projectId: "review-72cd1",
  storageBucket: "review-72cd1.firebasestorage.app",
  messagingSenderId: "327507565213",
  appId: "1:327507565213:web:a842b77367e1f2af6ad274",
  measurementId: "G-7EDYJTRH8P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(app);
const auth = getAuth(app);

// Export the services
export { db, auth };
export default app;