"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, RotateCcw, Eye, EyeOff } from "lucide-react";
import { downloadFile, triggerDownload } from "@/lib/api";
import toast from "react-hot-toast";

interface PDFPreviewProps {
  originalFile: File | null;
  processedFileUrl: string | null;
  fileId: string | null;
  onReset: () => void;
}

export function PDFPreview({
  originalFile,
  processedFileUrl,
  fileId,
  onReset,
}: PDFPreviewProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showComparison, setShowComparison] = useState(true);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);

  useEffect(() => {
    if (originalFile) {
      const url = URL.createObjectURL(originalFile);
      setOriginalPreview(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [originalFile]);

  const handleDownload = async () => {
    if (!fileId) return;

    setIsDownloading(true);
    try {
      const blob = await downloadFile(fileId);
      const filename = `cleaned_${originalFile?.name || "document.pdf"}`;
      triggerDownload(blob, filename);
      toast.success("File downloaded successfully!");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Download failed";
      toast.error(errorMessage);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="text-6xl mb-4">✨</div>
        <h2 className="text-4xl font-bold text-white mb-4">
          Watermark Removal Complete!
        </h2>
        <p className="text-xl text-gray-300">
          Your PDF has been processed successfully. Download the cleaned version
          below.
        </p>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <motion.button
          onClick={handleDownload}
          disabled={isDownloading}
          className="btn-primary flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isDownloading ? (
            <>
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              <span>Downloading...</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>Download Cleaned PDF</span>
            </>
          )}
        </motion.button>

        <motion.button
          onClick={() => setShowComparison(!showComparison)}
          className="btn-secondary flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {showComparison ? (
            <>
              <EyeOff className="w-5 h-5" />
              <span>Hide Comparison</span>
            </>
          ) : (
            <>
              <Eye className="w-5 h-5" />
              <span>Show Comparison</span>
            </>
          )}
        </motion.button>

        <motion.button
          onClick={onReset}
          className="btn-secondary flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw className="w-5 h-5" />
          <span>Process Another PDF</span>
        </motion.button>
      </div>

      {/* PDF Comparison */}
      {showComparison && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* Original PDF */}
          <div className="card">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
              Original PDF
            </h3>
            <div className="aspect-[3/4] bg-gray-800 rounded-lg overflow-hidden">
              {originalPreview ? (
                <iframe
                  src={`${originalPreview}#toolbar=0&navpanes=0&scrollbar=0`}
                  className="w-full h-full"
                  title="Original PDF Preview"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📄</div>
                    <p>Original PDF</p>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4 text-sm text-gray-400">
              <p>• Contains watermarks</p>
              <p>
                • Original file size:{" "}
                {originalFile
                  ? (originalFile.size / 1024 / 1024).toFixed(2)
                  : "0"}{" "}
                MB
              </p>
            </div>
          </div>

          {/* Processed PDF */}
          <div className="card">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              Cleaned PDF
            </h3>
            <div className="aspect-[3/4] bg-gray-800 rounded-lg overflow-hidden">
              {processedFileUrl ? (
                <iframe
                  src={`${processedFileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                  className="w-full h-full"
                  title="Cleaned PDF Preview"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <div className="text-4xl mb-2">✨</div>
                    <p>Cleaned PDF</p>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4 text-sm text-gray-400">
              <p>• Watermarks removed</p>
              <p>• Content preserved</p>
              <p>• Layout maintained</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Processing Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 card max-w-2xl mx-auto"
      >
        <h3 className="text-xl font-bold text-white mb-4">
          Processing Summary
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Original filename:</p>
            <p className="text-white font-medium">
              {originalFile?.name || "Unknown"}
            </p>
          </div>
          <div>
            <p className="text-gray-400">File size:</p>
            <p className="text-white font-medium">
              {originalFile
                ? (originalFile.size / 1024 / 1024).toFixed(2)
                : "0"}{" "}
              MB
            </p>
          </div>
          <div>
            <p className="text-gray-400">Processing status:</p>
            <p className="text-green-400 font-medium">✅ Completed</p>
          </div>
          <div>
            <p className="text-gray-400">Watermarks removed:</p>
            <p className="text-green-400 font-medium">✅ Successfully</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="text-green-400 mt-1">✅</div>
            <div>
              <h4 className="font-semibold text-green-400 mb-1">Success!</h4>
              <p className="text-sm text-gray-400">
                Your PDF has been processed successfully. The watermarks have
                been removed while preserving all original content and
                formatting.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
