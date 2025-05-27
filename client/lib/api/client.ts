import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios"

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
console.log('API Base URL:', baseURL);

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
  console.log('Making request to:', (config.baseURL || '') + (config.url || ''));

  // Skip token for auth endpoints
  if (config.url?.includes('/signin') || config.url?.includes('/signup')) {
    return config;
  }
  // Try to get auth token
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
    console.log('API request:', response.config.url, 'Response:', response);
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Handle unauthorized error
        localStorage.removeItem("access_token");
        if (!window.location.pathname.includes('/signin')) {
        window.location.href = "/signin";
        }
      }
    }
    return Promise.reject(error);
  }
)

export default apiClient;
