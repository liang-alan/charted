import axios from "axios";

// 🔹 Switch baseURL depending on environment
const isDev = process.env.NODE_ENV === "development";

export const BASE_URL = isDev
    ? "http://localhost:4000" // or your LAN IP for testing on device
    : "https://charted-api.onrender.com";

const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

// 🔹 Interceptor to add token dynamically
apiClient.interceptors.request.use(
    async (config) => {
        const token = ""; // later: pull from SecureStore or Context

        if (token) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${token}`,
            } as typeof config.headers;
        }

        return config;
    },
    (error) => Promise.reject(error)
);
export default apiClient;
