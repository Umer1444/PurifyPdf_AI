// Firebase configuration using environment variables
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Validate required environment variables
const requiredEnvVars = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error("🔥 Missing Firebase environment variables:", missingVars);
  console.error("📝 Please check your .env.local file");
  // Don't throw error, use fallback config for development
}

// Firebase configuration object with fallback
const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyBYT-AOp9V07-Bj4IY8dIYwYh_VljZkP7s",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "edu-bf473.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "edu-bf473",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "edu-bf473.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "965095260613",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:965095260613:web:9be01f24bb4423bbea0bac",
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-HFHL5YRCWP",
};

console.log("🔥 Firebase config loaded:", {
  apiKey: firebaseConfig.apiKey.substring(0, 10) + "...",
  projectId: firebaseConfig.projectId,
});

// Initialize Firebase with error handling
let app;
let auth;
let db;
let storage;

try {
  console.log("🔥 Initializing Firebase...");
  app = initializeApp(firebaseConfig);

  // Initialize Firebase services
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  console.log("✅ Firebase initialized successfully");
} catch (error) {
  console.error("❌ Firebase initialization failed:", error);
  throw error;
}

export { auth, db, storage };

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

// Export the app instance
export default app;
