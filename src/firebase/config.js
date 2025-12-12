// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

// Firebase configuration object
export const firebaseConfig = {
  apiKey: "AIzaSyArIOctKU4qYDn9y9aUJch9WwypLptl7Iw",
  authDomain: "somiti-13503.firebaseapp.com",
  projectId: "somiti-13503",
  storageBucket: "somiti-13503.firebasestorage.app",
  messagingSenderId: "326795595039",
  appId: "1:326795595039:web:07796c5cf151862b4af42a",
  measurementId: "G-B556H1L5XS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (optional, only in production)
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export { analytics };

// Export the app instance
export default app;