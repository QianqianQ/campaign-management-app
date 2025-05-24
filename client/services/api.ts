import axios from "axios";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
console.log("API Base URL: ", apiBaseUrl);
const api = axios.create({
    baseURL: `${apiBaseUrl}`,
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
      // Skip token for auth endpoints
      if (config.url?.includes('/signin') || config.url?.includes('/signup')) {
        return config;
      }

      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

export const healthCheck = async () => {
    try {
        const response = await api.get('/api/health-check/');
        return response.data;
    } catch (error) {
        console.error('Error connecting to backend API:', error);
        throw error;
    }
};

export default api;

