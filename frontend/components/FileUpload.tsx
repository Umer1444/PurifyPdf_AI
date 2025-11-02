"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { Upload, FileText, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { uploadFile } from "@/lib/api";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onUploadComplete: (fileId: string) => void;
  onError: (error: string) => void;
}

export function FileUpload({
  onFileSelect,
  onUploadComplete,
  onError,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Validate file
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        onError("Please select a PDF file");
        toast.error("Only PDF files are supported");
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        onError("File size exceeds 50MB limit");
        toast.error("File size must be less than 50MB");
        return;
      }

      onFileSelect(file);
      setIsUploading(true);

      try {
        const response = await uploadFile(file);
        onUploadComplete(response.file_id);
        toast.success("File uploaded successfully!");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Upload failed";
        onError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsUploading(false);
      }
    },
    [onFileSelect, onUploadComplete, onError]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "application/pdf": [".pdf"],
      },
      maxFiles: 1,
      disabled: isUploading,
    });

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
            transition-all duration-300 glass-effect
            ${
              isDragActive && !isDragReject
                ? "border-primary-500 glow-border"
                : "border-gray-600"
            }
            ${isDragReject ? "border-red-500" : ""}
            ${
              isUploading
                ? "pointer-events-none opacity-50"
                : "hover:border-primary-500 hover:glow-border"
            }
          `}
        >
          <input {...getInputProps()} />

          <div className="space-y-6">
            <motion.div
              animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {isUploading ? (
                <div className="animate-spin w-16 h-16 mx-auto">
                  <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full"></div>
                </div>
              ) : isDragReject ? (
                <AlertCircle className="w-16 h-16 mx-auto text-red-500" />
              ) : (
                <div className="relative">
                  <Upload className="w-16 h-16 mx-auto text-primary-500 animate-float" />
                  <div className="flex absolute -bottom-2 -right-2 space-x-1">
                    <FileText className="w-6 h-6 text-primary-400" />
                    <div className="w-6 h-6 bg-orange-500 rounded text-white text-xs flex items-center justify-center font-bold">
                      P
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            <div>
              {isUploading ? (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Uploading...
                  </h3>
                  <p className="text-gray-400">
                    Please wait while we upload your PDF
                  </p>
                </div>
              ) : isDragReject ? (
                <div>
                  <h3 className="text-2xl font-bold text-red-400 mb-2">
                    Invalid File
                  </h3>
                  <p className="text-gray-400">
                    Please select a valid PDF file
                  </p>
                </div>
              ) : isDragActive ? (
                <div>
                  <h3 className="text-2xl font-bold text-primary-400 mb-2">
                    Drop it here!
                  </h3>
                  <p className="text-gray-400">Release to upload your PDF</p>
                </div>
              ) : (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Drag & drop your files here
                  </h3>
                  <p className="text-gray-400 mb-4">or click to browse files</p>
                  <div className="space-y-3">
                    <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
                      <span>📄 PDF files only</span>
                      <span>•</span>
                      <span>Max 50MB</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      <p className="mb-2 text-gray-400">
                        🎯 AI detects & removes:
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        <span className="px-2 py-1 bg-purple-500/20 rounded-full text-purple-300">
                          Gemini logos
                        </span>
                        <span className="px-2 py-1 bg-blue-500/20 rounded-full text-blue-300">
                          ChatGPT marks
                        </span>
                        <span className="px-2 py-1 bg-green-500/20 rounded-full text-green-300">
                          VoxDeck.ai
                        </span>
                        <span className="px-2 py-1 bg-red-500/20 rounded-full text-red-300">
                          Custom logos
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!isUploading && !isDragActive && (
              <motion.button
                type="button"
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Choose PDF File
              </motion.button>
            )}
          </div>

          {/* Animated background effect */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        </div>
      </motion.div>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>🔒 Your files are processed securely and deleted after 10 minutes</p>
        <p className="mt-2">
          📊 Supports: PDF documents with intelligent background reconstruction
        </p>
      </div>
    </div>
  );
}
