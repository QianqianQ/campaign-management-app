import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { showToast } from "@/lib/utils";

interface ApiErrorResponse {
  error?: string;
  [key: string]: unknown;
}

// Helper to extract all error messages from response data
function extractErrorMsgs(data: ApiErrorResponse): string {
  const messages: string[] = [];

  // Handle each key in the response data
  Object.entries(data).forEach(([, value]) => {
    if (Array.isArray(value)) {
      // Handle arrays of error messages
      messages.push(...value.filter(msg => typeof msg === 'string'));
    } else if (typeof value === 'string') {
      // Handle single string messages
      messages.push(value);
    } else if (typeof value === 'object' && value !== null) {
      // Recursively extract messages
      const nestedMessages = extractErrorMsgs(value as ApiErrorResponse);
      if (nestedMessages) {
        messages.push(nestedMessages);
      }
    }
  });

  return messages.join('\n') || 'An unexpected error occurred';
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

const apiClient = axios.create({
  baseURL,
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a request interceptor to include the auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {

  // Skip token for auth endpoints
  if (config.url?.includes('/signin') || config.url?.includes('/signup')) {
    return config;
  }
  // Get auth token
  // TODO: Use a more secure way to store the token
  if (typeof window !== 'undefined') {
    const access_token = localStorage.getItem("access_token");
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
  }
  return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
)

// Add a response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const errRes = error.response;
    const resData = errRes?.data as ApiErrorResponse;
    if (errRes?.status === 401) {
      if (typeof window !== 'undefined') {
        // Handle unauthorized error
        localStorage.removeItem("access_token");
        if (!window.location.pathname.includes('/signin')) {
        window.location.href = "/signin";
        }
      }
    } else {
      showToast("Error", extractErrorMsgs(resData));
    }
    return Promise.reject(error);
  }
)

export default apiClient;
