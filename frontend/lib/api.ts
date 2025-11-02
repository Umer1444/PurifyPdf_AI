import axios from "axios";

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-backend-url.com"
    : "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minutes timeout for large files
});

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
    const response = await api.post<UploadResponse>("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload progress: ${progress}%`);
        }
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.detail || error.message;
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
