import axios from "axios";
import type { AxiosRequestConfig, AxiosRequestHeaders } from "axios";

const api = axios.create({
//   baseURL: "http://localhost:3000/api",
  baseURL: "https://wxyz-backend.onrender.com/api",
});

// REQUEST interceptor — attach access token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("userToken");
            if (token) {
                if (!config.headers) config.headers = {} as AxiosRequestHeaders;
                (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
            }
        return config;
    },
    (error) => Promise.reject(error),
);

// RESPONSE interceptor — handle token refresh on 401
let isRefreshing = false;
type QueueItem = {
    resolve: (token?: any) => void;
    reject: (err: any) => void;
};
let failedQueue: QueueItem[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

api.interceptors.response.use((response) => response,
    async (error) => {
        const originalRequest = (error.config as AxiosRequestConfig & { _retry?: boolean; headers?: any }) || {};

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise<string | null>((resolve, reject) => {
                failedQueue.push({ resolve, reject });
                })
                .then((token) => {
                    if (token) {
                    if (!originalRequest.headers) originalRequest.headers = {};
                    originalRequest.headers["Authorization"] = `Bearer ${token}`;
                    }
                    return api(originalRequest as AxiosRequestConfig);
                })
                .catch((err) => Promise.reject(err));
            }

            (originalRequest as any)._retry = true;
            isRefreshing = true;

            const accessToken = localStorage.getItem("userToken");
            const refreshToken = localStorage.getItem("userRefreshToken");

            try {
                const { data } = await axios.post(
                "https://scrmapi-lpkm.onrender.com/api/Login/RefreshToken",
                { accessToken, refreshToken },
                );

                console.log("Token refreshed:", data);

                if (data.accessToken) {
                    localStorage.setItem("scrmToken", data.accessToken);
                    if (data.refreshToken) {
                        localStorage.setItem("scrmRefreshToken", data.refreshToken);
                    }

                    api.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
                    if (!originalRequest.headers) originalRequest.headers = {};
                    originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;

                    processQueue(null, data.accessToken);
                    return api(originalRequest as AxiosRequestConfig);
                }

                // If refresh didn't return tokens, treat as failure
                throw new Error("No access token returned from refresh endpoint");
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                processQueue(refreshError, null);
                localStorage.removeItem("scrmToken");
                localStorage.removeItem("scrmRefreshToken");
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    },
);

export default api;