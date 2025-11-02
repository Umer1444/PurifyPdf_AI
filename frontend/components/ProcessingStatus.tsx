"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { removeWatermark, getProcessingStatus } from "@/lib/api";
import toast from "react-hot-toast";

interface ProcessingStatusProps {
  fileId: string | null;
  status: "uploading" | "processing";
  progress: number;
  onComplete: (processedFileUrl: string) => void;
  onError: (error: string) => void;
}

export function ProcessingStatus({
  fileId,
  status,
  progress,
  onComplete,
  onError,
}: ProcessingStatusProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);

  const steps = [
    { name: "Uploading", description: "Uploading your PDF file" },
    {
      name: "Analyzing",
      description: "AI is analyzing the document for branded watermarks",
    },
    {
      name: "Detecting",
      description: "Detecting 'Made with' boxes and branded overlays",
    },
    {
      name: "Removing",
      description: "Removing watermark boxes while preserving content",
    },
    { name: "Finalizing", description: "Generating clean PDF file" },
  ];

  useEffect(() => {
    if (status === "uploading") {
      setCurrentStep(0);
      setProcessingProgress(20);
    } else if (status === "processing" && fileId) {
      startProcessing();
    }
  }, [status, fileId]);

  const startProcessing = async () => {
    if (!fileId) return;

    try {
      setCurrentStep(1);
      setProcessingProgress(40);

      // Start watermark removal
      const response = await removeWatermark(fileId);

      if (response.status === "completed") {
        // Simulate processing steps for better UX
        await simulateProcessingSteps();
        onComplete(`/api/download/${fileId}`);
      } else {
        // Poll for status updates
        pollProcessingStatus();
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Processing failed";
      onError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const simulateProcessingSteps = async () => {
    const stepDurations = [1000, 1500, 2000, 1000]; // Duration for each step

    for (let i = 1; i < steps.length; i++) {
      setCurrentStep(i);
      setProcessingProgress(20 + i * 20);
      await new Promise((resolve) => setTimeout(resolve, stepDurations[i - 1]));
    }

    setProcessingProgress(100);
  };

  const pollProcessingStatus = async () => {
    if (!fileId) return;

    const pollInterval = setInterval(async () => {
      try {
        const statusResponse = await getProcessingStatus(fileId);

        if (statusResponse.status === "completed") {
          clearInterval(pollInterval);
          setProcessingProgress(100);
          onComplete(`/api/download/${fileId}`);
        } else if (statusResponse.status === "error") {
          clearInterval(pollInterval);
          onError("Processing failed");
        }

        // Update progress if available
        if (statusResponse.progress) {
          setProcessingProgress(statusResponse.progress);
          setCurrentStep(Math.floor(statusResponse.progress / 20));
        }
      } catch (error) {
        clearInterval(pollInterval);
        onError("Failed to check processing status");
      }
    }, 2000); // Poll every 2 seconds

    // Cleanup after 5 minutes
    setTimeout(() => {
      clearInterval(pollInterval);
      onError("Processing timeout");
    }, 300000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-4"
          >
            <Loader2 className="w-16 h-16 text-primary-500" />
          </motion.div>

          <h2 className="text-3xl font-bold text-white mb-2">
            Processing Your PDF
          </h2>
          <p className="text-gray-400">
            Our AI is working to remove watermarks while preserving your content
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Progress</span>
            <span className="text-sm text-primary-400 font-semibold">
              {processingProgress}%
            </span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${processingProgress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Processing Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-300 ${
                index === currentStep
                  ? "bg-primary-500/20 border border-primary-500/50"
                  : index < currentStep
                  ? "bg-green-500/20 border border-green-500/50"
                  : "bg-gray-800/50 border border-gray-700"
              }`}
            >
              <div className="flex-shrink-0">
                {index < currentStep ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : index === currentStep ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Loader2 className="w-6 h-6 text-primary-400" />
                  </motion.div>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-gray-600" />
                )}
              </div>

              <div className="flex-1">
                <h3
                  className={`font-semibold ${
                    index === currentStep
                      ? "text-primary-400"
                      : index < currentStep
                      ? "text-green-400"
                      : "text-gray-400"
                  }`}
                >
                  {step.name}
                </h3>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Processing Info */}
        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="text-blue-400 mt-1">ℹ️</div>
            <div>
              <h4 className="font-semibold text-blue-400 mb-1">
                Processing Information
              </h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• AI analyzes your PDF to identify watermark patterns</li>
                <li>• Original text and images are preserved during removal</li>
                <li>• Processing time varies based on document complexity</li>
                <li>
                  • Your file will be automatically deleted after 10 minutes
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
