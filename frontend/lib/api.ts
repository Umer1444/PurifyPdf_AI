import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://purifypdf-ai.onrender.com"
    : "http://localhost:8000");

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minutes timeout for large files
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(
      `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
    );
    console.log(`🌐 Base URL: ${API_BASE_URL}`);
    return config;
  },
  (error) => {
    console.error("❌ API Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(
      "❌ API Response Error:",
      error.response?.status,
      error.response?.data
    );
    return Promise.reject(error);
  }
);

export interface UploadResponse {
  file_id: string;
  filename: string;
  status: string;
  message: string;
  timestamp?: string;
}

export interface ProcessResponse {
  file_id: string;
  status: string;
  output_available: boolean;
  processing_time: number;
  message: string;
  timestamp?: string;
}

export interface StatusResponse {
  file_id: string;
  status: string;
  progress?: number;
  message?: string;
  timestamp?: string;
}

export async function uploadFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    console.log(`📤 Uploading file: ${file.name} (${file.size} bytes)`);

    const response = await api.post<UploadResponse>("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`📊 Upload progress: ${progress}%`);
        }
      },
    });

    console.log(`✅ Upload successful: ${response.data.file_id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (
        error.code === "NETWORK_ERROR" ||
        error.message.includes("Network Error")
      ) {
        throw new Error(
          "Network error: Please check your internet connection and try again."
        );
      }
      if (error.response?.status === 0) {
        throw new Error(
          "Cannot connect to server. Please check if the backend is running."
        );
      }
      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message;
      throw new Error(`Upload failed: ${message}`);
    }
    throw new Error("Upload failed: Unknown error");
  }
}

export async function removeWatermark(
  fileId: string
): Promise<ProcessResponse> {
  try {
    const response = await api.post<ProcessResponse>(
      `/remove_watermark/${fileId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.detail || error.message;
      throw new Error(`Processing failed: ${message}`);
    }
    throw new Error("Processing failed: Unknown error");
  }
}

export async function getProcessingStatus(
  fileId: string
): Promise<StatusResponse> {
  try {
    const response = await api.get<StatusResponse>(`/status/${fileId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.detail || error.message;
      throw new Error(`Status check failed: ${message}`);
    }
    throw new Error("Status check failed: Unknown error");
  }
}

export function getDownloadUrl(fileId: string): string {
  return `${API_BASE_URL}/download/${fileId}`;
}

export async function downloadFile(fileId: string): Promise<Blob> {
  try {
    const response = await api.get(`/download/${fileId}`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.detail || error.message;
      throw new Error(`Download failed: ${message}`);
    }
    throw new Error("Download failed: Unknown error");
  }
}

// Health check function to test backend connection
export async function healthCheck(): Promise<boolean> {
  try {
    console.log(`🏥 Health check: ${API_BASE_URL}/health`);
    const response = await api.get("/health", { timeout: 10000 });
    console.log("✅ Backend is healthy:", response.data);
    return true;
  } catch (error) {
    console.error("❌ Backend health check failed:", error);
    return false;
  }
}

// Utility function to trigger file download in browser
export function triggerDownload(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

// Export the API base URL for debugging
export { API_BASE_URL };
