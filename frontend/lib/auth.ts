// Secure Firebase Authentication System
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User as FirebaseUser,
  Auth,
} from "firebase/auth";

// Firebase configuration - production ready
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

// Initialize Firebase
let app;
let auth: Auth;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  console.log("🔥 Firebase initialized successfully");
} catch (error) {
  console.error("❌ Firebase initialization failed:", error);
  throw new Error("Firebase initialization failed");
}

export { auth };

// Custom User interface
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  emailVerified: boolean;
}

// Convert Firebase User to our User interface
const convertFirebaseUser = (firebaseUser: FirebaseUser): User => {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || "",
    displayName:
      firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
    photoURL: firebaseUser.photoURL || undefined,
    emailVerified: firebaseUser.emailVerified,
  };
};

// Google Sign In
export const signInWithGoogle = async (): Promise<User> => {
  const provider = new GoogleAuthProvider();
  provider.addScope("email");
  provider.addScope("profile");
  provider.setCustomParameters({
    prompt: "select_account",
  });

  try {
    const result = await signInWithPopup(auth, provider);
    const user = convertFirebaseUser(result.user);

    if (!user.email) {
      throw new Error("Email is required for authentication");
    }

    return user;
  } catch (error: any) {
    console.error("❌ Google sign in error:", error);
    throw new Error(error.message || "Failed to sign in with Google");
  }
};

// Email Sign In
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = convertFirebaseUser(result.user);
    return user;
  } catch (error: any) {
    console.error("Email sign in error:", error);
    throw new Error(error.message || "Failed to sign in with email");
  }
};

// Sign Up with Email
export const signUp = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = convertFirebaseUser(result.user);
    return user;
  } catch (error: any) {
    console.error("Sign up error:", error);
    throw new Error(error.message || "Failed to create account");
  }
};

// Log Out
export const logOut = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error("Logout error:", error);
    throw new Error(error.message || "Failed to log out");
  }
};

// Auth State Changed Listener
export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  return firebaseOnAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      const user = convertFirebaseUser(firebaseUser);
      callback(user);
    } else {
      callback(null);
    }
  });
};

// Get Current User
export const getCurrentUser = (): User | null => {
  const firebaseUser = auth.currentUser;
  return firebaseUser ? convertFirebaseUser(firebaseUser) : null;
};
