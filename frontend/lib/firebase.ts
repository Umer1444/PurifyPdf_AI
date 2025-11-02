// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYT-AOp9V07-Bj4IY8dIYwYh_VljZkP7s",
  authDomain: "edu-bf473.firebaseapp.com",
  projectId: "edu-bf473",
  storageBucket: "edu-bf473.firebasestorage.app",
  messagingSenderId: "965095260613",
  appId: "1:965095260613:web:9be01f24bb4423bbea0bac",
  measurementId: "G-HFHL5YRCWP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics =
  typeof window !== "undefined" ? getAnalytics(app) : null;

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Auth functions
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logOut = () => signOut(auth);
export { onAuthStateChanged };
