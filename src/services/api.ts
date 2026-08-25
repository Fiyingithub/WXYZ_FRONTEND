import axios from "axios";
import type {
    AxiosRequestConfig,
    AxiosRequestHeaders,
} from "axios";


// ============================================================
// BASE URL
// ============================================================

// const BASE_URL = "http://localhost:4000/api";
const BASE_URL = "https://wxyz-backend.onrender.com/api";


// ============================================================
// AUTH EVENTS
// ============================================================

export const AUTH_LOGOUT_EVENT = "auth:logout";


// ============================================================
// AXIOS INSTANCE
// ============================================================

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Sends refreshToken cookie
});


// ============================================================
// PUBLIC AUTH ROUTES
// These routes should NOT receive the access token
// ============================================================

const isPublicAuthRoute = (
    config: AxiosRequestConfig
): boolean => {

    const method = config.method?.toLowerCase();

    const url = config.url ?? "";

    return (
        method === "post" &&
        (
            url === "/user/signup" ||
            url === "/user/login"
        )
    );
};


// ============================================================
// REQUEST INTERCEPTOR
// Attach access token to protected requests
// ============================================================

api.interceptors.request.use(

    (config) => {

        // ------------------------------------------------------
        // Skip Authorization header for signup and login
        // ------------------------------------------------------

        if (isPublicAuthRoute(config)) {
            return config;
        }


        // ------------------------------------------------------
        // Get access token from localStorage
        // ------------------------------------------------------

        const token = localStorage.getItem("userToken");


        if (token) {

            // Axios normally creates headers for us,
            // but this makes the code safe.
            if (!config.headers) {
                config.headers = {} as AxiosRequestHeaders;
            }


            (
                config.headers as Record<string, string>
            ).Authorization = `Bearer ${token}`;
        }


        return config;
    },


    (error) => {
        return Promise.reject(error);
    }

);


// ============================================================
// TOKEN REFRESH STATE
// ============================================================

let isRefreshing = false;


// ============================================================
// FAILED REQUEST QUEUE
// ============================================================

type QueueItem = {

    resolve: (token?: string) => void;

    reject: (error: any) => void;
};


let failedQueue: QueueItem[] = [];


// ============================================================
// PROCESS QUEUED REQUESTS
// ============================================================

const processQueue = (
    error: any,
    token: string | null = null
) => {

    failedQueue.forEach((promise) => {

        if (error) {

            promise.reject(error);

        } else {

            promise.resolve(
                token ?? undefined
            );

        }

    });


    failedQueue = [];
};


// ============================================================
// RESPONSE INTERCEPTOR
// Handle expired access tokens
// ============================================================

api.interceptors.response.use(

    // ----------------------------------------------------------
    // Successful response
    // ----------------------------------------------------------

    (response) => {
        return response;
    },


    // ----------------------------------------------------------
    // Failed response
    // ----------------------------------------------------------

    async (error) => {

        const originalRequest =
            error.config as AxiosRequestConfig & {
                _retry?: boolean;
                headers?: any;
            };


        // ------------------------------------------------------
        // Only handle 401 errors
        // ------------------------------------------------------

        if (
            error.response?.status !== 401 ||
            originalRequest._retry
        ) {

            return Promise.reject(error);
        }


        // ------------------------------------------------------
        // IMPORTANT:
        // Don't try to refresh authentication for signup/login
        //
        // If login/signup returns 401, that is an actual
        // authentication/validation error.
        // ------------------------------------------------------

        if (isPublicAuthRoute(originalRequest)) {

            return Promise.reject(error);
        }


        // ------------------------------------------------------
        // If another request is already refreshing the token,
        // put this request into the queue.
        // ------------------------------------------------------

        if (isRefreshing) {

            return new Promise(
                (resolve, reject) => {

                    failedQueue.push({
                        resolve,
                        reject,
                    });

                }
            )
                .then((token) => {

                    if (token) {

                        if (!originalRequest.headers) {
                            originalRequest.headers = {};
                        }


                        originalRequest.headers.Authorization =
                            `Bearer ${token}`;
                    }


                    return api(originalRequest);

                })
                .catch((err) => {

                    return Promise.reject(err);

                });
        }


        // ------------------------------------------------------
        // Mark request as retrying
        // ------------------------------------------------------

        originalRequest._retry = true;

        isRefreshing = true;


        try {

            // --------------------------------------------------
            // Refresh access token
            //
            // We intentionally use axios directly instead of
            // "api" so the expired Authorization token isn't
            // attached to the refresh request.
            // --------------------------------------------------

            const response = await axios.post(

                `${BASE_URL}/user/refresh-token`,

                {},

                {
                    withCredentials: true,
                }

            );


            // --------------------------------------------------
            // Get new access token
            // --------------------------------------------------

            const newAccessToken =
                response.data.data.accessToken;


            // --------------------------------------------------
            // Store new token
            // --------------------------------------------------

            localStorage.setItem(
                "userToken",
                newAccessToken
            );


            // --------------------------------------------------
            // Update Axios default Authorization
            // --------------------------------------------------

            api.defaults.headers.common.Authorization =
                `Bearer ${newAccessToken}`;


            // --------------------------------------------------
            // Update original failed request
            // --------------------------------------------------

            if (!originalRequest.headers) {
                originalRequest.headers = {};
            }


            originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;


            // --------------------------------------------------
            // Resolve all queued requests
            // --------------------------------------------------

            processQueue(
                null,
                newAccessToken
            );


            // --------------------------------------------------
            // Retry original request
            // --------------------------------------------------

            return api(originalRequest);

        } catch (refreshError) {

            // --------------------------------------------------
            // Refresh token failed
            // --------------------------------------------------

            console.error(
                "Token refresh failed:",
                refreshError
            );


            // --------------------------------------------------
            // Reject all queued requests
            // --------------------------------------------------

            processQueue(
                refreshError,
                null
            );


            // --------------------------------------------------
            // Clear authentication state
            // --------------------------------------------------

            localStorage.removeItem(
                "userToken"
            );

            localStorage.removeItem(
                "userRefreshToken"
            );


            // --------------------------------------------------
            // Notify AuthProvider
            // --------------------------------------------------

            window.dispatchEvent(
                new Event(AUTH_LOGOUT_EVENT)
            );


            return Promise.reject(
                refreshError
            );

        } finally {

            // --------------------------------------------------
            // Allow another refresh attempt
            // --------------------------------------------------

            isRefreshing = false;
        }

    }

);


// ============================================================
// EXPORT
// ============================================================

export default api;