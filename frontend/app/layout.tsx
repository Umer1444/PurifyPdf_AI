import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PurifyPDF - AI-Powered PDF Watermark Remover",
  description:
    "World's #1 AI-powered PDF watermark removal tool. Remove branded watermarks while preserving your content with pixel-perfect precision.",
  keywords:
    "PDF watermark removal, AI PDF cleaner, remove VoxDeck watermark, PDF purifier, document cleaning, watermark eraser, PDF editor, AI document processing",
  authors: [{ name: "Umer1444", url: "https://github.com/Umer1444" }],
  openGraph: {
    title: "PurifyPDF - AI-Powered PDF Watermark Remover",
    description: "Remove watermarks from PDFs instantly with AI precision",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PurifyPDF - AI-Powered PDF Watermark Remover",
    description: "Remove watermarks from PDFs instantly with AI precision",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-dark-gradient">{children}</div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              color: "#fff",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            },
            success: {
              iconTheme: {
                primary: "#9c6dff",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
