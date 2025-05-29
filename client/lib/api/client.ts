import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { showToast } from "@/lib/utils";

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
    const resData: any = errRes?.data;
    if (errRes?.status === 401) {
      if (typeof window !== 'undefined') {
        // Handle unauthorized error
        localStorage.removeItem("access_token");
        if (!window.location.pathname.includes('/signin')) {
        window.location.href = "/signin";
        }
      }
    } else {
      if (resData.non_field_errors) {
        showToast("Error", resData.non_field_errors.join(", "));
      } else {
        showToast("Error", resData.detail || resData.error || "Unexpected error");
      }
    }
    return Promise.reject(error);
  }
)

export default apiClient;
