import axios from "axios";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
console.log("API Base URL: ", apiBaseUrl);
const api = axios.create({
    baseURL: apiBaseUrl,
});

export const healthCheck = async () => {
    try {
        const response = await api.get('/health-check/');
        return response.data;
    } catch (error) {
        console.error('Error connecting to backend API:', error);
        throw error;
    }
};

export default api;

