"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileUpload } from "@/components/FileUpload";
import { ProcessingStatus } from "@/components/ProcessingStatus";
import { PDFPreview } from "@/components/PDFPreview";
import { Header } from "@/components/Header";
import { Features } from "@/components/Features";
import { WatermarkTypes } from "@/components/WatermarkTypes";
import Footer from "@/components/Footer";
import LoadingAnimation from "@/components/LoadingAnimation";
import AuthPage from "@/components/AuthPage";
import { onAuthStateChanged, User } from "@/lib/auth";
import { API_BASE_URL, healthCheck } from "@/lib/api";

export interface ProcessingState {
  fileId: string | null;
  status: "idle" | "uploading" | "processing" | "completed" | "error";
  progress: number;
  originalFile: File | null;
  processedFileUrl: string | null;
  error: string | null;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const [processingState, setProcessingState] = useState<ProcessingState>({
    fileId: null,
    status: "idle",
    progress: 0,
    originalFile: null,
    processedFileUrl: null,
    error: null,
  });

  useEffect(() => {
    console.log("🔥 Initializing Firebase Authentication...");

    let unsubscribe: (() => void) | null = null;

    const initAuth = async () => {
      try {
        // Set up Firebase auth listener
        unsubscribe = onAuthStateChanged((user) => {
          console.log(
            "🔥 Auth state changed:",
            user ? "User authenticated" : "No user"
          );
          setUser(user);
          setAuthLoading(false);
          setAuthError(null);
        });

        // Show loading animation for minimum 2 seconds for better UX
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      } catch (error: any) {
        console.error("❌ Firebase initialization error:", error);
        setAuthError(error.message || "Authentication service unavailable");
        setAuthLoading(false);
        setLoading(false);
      }
    };

    initAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const resetState = () => {
    setProcessingState({
      fileId: null,
      status: "idle",
      progress: 0,
      originalFile: null,
      processedFileUrl: null,
      error: null,
    });
  };

  // Show loading animation first
  if (loading) {
    return <LoadingAnimation />;
  }

  // Show error if Firebase failed to initialize
  if (authError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-red-400 text-6xl mb-4">🔥</div>
          <h1 className="text-2xl font-bold text-white mb-4">
            Service Unavailable
          </h1>
          <p className="text-gray-300 mb-6">{authError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show auth page if still determining auth state or user is not authenticated
  if (authLoading || !user) {
    return (
      <AuthPage
        onAuthSuccess={() => console.log("✅ Authentication successful")}
      />
    );
  }

  return (
    <main className="min-h-screen">
      <Header user={user} />

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-gradient">PurifyPDF</span>
            <br />
            <span className="text-white">AI Watermark Remover</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Remove ANY watermark from PDFs using advanced AI/ML technology.
            Detects and eliminates Gemini, ChatGPT, VoxDeck.ai, Canva, Figma,
            and ALL other watermarks with intelligent background reconstruction
            and seamless content preservation.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {processingState.status === "idle" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <FileUpload
                onFileSelect={(file) => {
                  setProcessingState((prev) => ({
                    ...prev,
                    originalFile: file,
                    status: "uploading",
                  }));
                }}
                onUploadComplete={(fileId) => {
                  setProcessingState((prev) => ({
                    ...prev,
                    fileId,
                    status: "processing",
                  }));
                }}
                onError={(error) => {
                  setProcessingState((prev) => ({
                    ...prev,
                    status: "error",
                    error,
                  }));
                }}
              />
            </motion.div>
          )}

          {(processingState.status === "uploading" ||
            processingState.status === "processing") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProcessingStatus
                fileId={processingState.fileId}
                status={processingState.status}
                progress={processingState.progress}
                onComplete={(processedFileUrl) => {
                  setProcessingState((prev) => ({
                    ...prev,
                    status: "completed",
                    processedFileUrl,
                    progress: 100,
                  }));
                }}
                onError={(error) => {
                  setProcessingState((prev) => ({
                    ...prev,
                    status: "error",
                    error,
                  }));
                }}
              />
            </motion.div>
          )}

          {processingState.status === "completed" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <PDFPreview
                originalFile={processingState.originalFile}
                processedFileUrl={processingState.processedFileUrl}
                fileId={processingState.fileId}
                onReset={resetState}
              />
            </motion.div>
          )}

          {processingState.status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="card max-w-md mx-auto">
                <div className="text-red-400 text-6xl mb-4">⚠️</div>
                <h3 className="text-2xl font-bold text-red-400 mb-4">
                  Processing Error
                </h3>
                <p className="text-gray-300 mb-6">{processingState.error}</p>
                <button onClick={resetState} className="btn-primary w-full">
                  Try Again
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {processingState.status === "idle" && (
          <>
            <Features />
            <WatermarkTypes />
          </>
        )}
      </div>

      <Footer />
    </main>
  );
}
