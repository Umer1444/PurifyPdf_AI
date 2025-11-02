// Secure Firebase Authentication System with Environment Variables
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
  console.error("❌ Missing Firebase environment variables:", missingVars);
  console.error(
    "🔧 Please restart your development server after setting environment variables"
  );

  // Don't throw error in development, use fallback config
  if (process.env.NODE_ENV === "development") {
    console.warn("⚠️ Using fallback Firebase config for development");
  } else {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}\n` +
        "Please check your .env.local file and ensure all Firebase config variables are set."
    );
  }
}

// Firebase configuration using environment variables with fallback
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

console.log("🔥 Firebase config loaded successfully");

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);

// Custom User interface that matches our app needs
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
  console.log("🔥 Starting Google sign in...");

  const provider = new GoogleAuthProvider();
  provider.addScope("email");
  provider.addScope("profile");
  provider.setCustomParameters({
    prompt: "select_account",
  });

  try {
    console.log("🔥 Opening Google popup...");
    const result = await signInWithPopup(auth, provider);
    const user = convertFirebaseUser(result.user);

    console.log("✅ Google sign in successful:", {
      name: user.displayName,
      email: user.email,
    });

    // Verify user has email
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

    // Check if email is verified
    if (!user.emailVerified) {
      throw new Error("Please verify your email before signing in");
    }

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

    // Send email verification
    // await sendEmailVerification(result.user);

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
  console.log("🔥 Setting up Firebase auth state listener...");

  return firebaseOnAuthStateChanged(auth, (firebaseUser) => {
    console.log(
      "🔥 Firebase auth state changed:",
      firebaseUser ? "User exists" : "No user"
    );

    if (firebaseUser) {
      const user = convertFirebaseUser(firebaseUser);
      console.log("✅ Converted user:", {
        name: user.displayName,
        email: user.email,
      });
      callback(user);
    } else {
      console.log("❌ No authenticated user");
      callback(null);
    }
  });
};

// Get Current User
export const getCurrentUser = (): User | null => {
  const firebaseUser = auth.currentUser;
  return firebaseUser ? convertFirebaseUser(firebaseUser) : null;
};
