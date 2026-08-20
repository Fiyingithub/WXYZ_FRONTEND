import axios from "axios";
import type { AxiosRequestConfig, AxiosRequestHeaders } from "axios";

// const BASE_URL = "http://localhost:4000/api";
const BASE_URL = "https://wxyz-backend.onrender.com/api";

export const AUTH_LOGOUT_EVENT = "auth:logout";

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Important: sends refreshToken cookie
});


// REQUEST interceptor — attach access token
api.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("userToken");

        if (token) {

            if (!config.headers) {
                config.headers = {} as AxiosRequestHeaders;
            }

            (config.headers as Record<string, string>)["Authorization"] =
                `Bearer ${token}`;
        }

        return config;
    },

    (error) => Promise.reject(error)
);



let isRefreshing = false;


type QueueItem = {
    resolve: (token?: string) => void;
    reject: (error: any) => void;
};


let failedQueue: QueueItem[] = [];


const processQueue = (
    error: any,
    token: string | null = null
) => {

    failedQueue.forEach((promise) => {

        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token ?? undefined);
        }

    });


    failedQueue = [];
};



// RESPONSE interceptor — refresh expired access token

api.interceptors.response.use(

    (response) => response,


    async (error) => {

        const originalRequest =
            error.config as AxiosRequestConfig & {
                _retry?: boolean;
                headers?: any;
            };


        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {


            if (isRefreshing) {

                return new Promise((resolve, reject) => {

                    failedQueue.push({
                        resolve,
                        reject,
                    });

                })

                .then((token) => {

                    if (token) {

                        originalRequest.headers.Authorization =
                            `Bearer ${token}`;
                    }


                    return api(originalRequest);

                })

                .catch((err) =>
                    Promise.reject(err)
                );
            }



            originalRequest._retry = true;
            isRefreshing = true;



            try {


                // Shares BASE_URL with the rest of the app, so the
                // refreshToken cookie's origin always matches where
                // it was issued.
                const response = await axios.post(

                    `${BASE_URL}/user/refresh-token`,

                    {},

                    {
                        withCredentials: true,
                    }

                );



                const newAccessToken =
                    response.data.data.accessToken;



                // console.log(
                //     "Token refreshed:",
                //     newAccessToken
                // );



                localStorage.setItem(
                    "userToken",
                    newAccessToken
                );



                api.defaults.headers.common.Authorization =
                    `Bearer ${newAccessToken}`;



                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;



                processQueue(
                    null,
                    newAccessToken
                );



                // retry failed request
                return api(originalRequest);



            } catch (refreshError) {


                console.error(
                    "Token refresh failed:",
                    refreshError
                );


                processQueue(
                    refreshError,
                    null
                );


                localStorage.removeItem("userToken");
                localStorage.removeItem("userRefreshToken");

                // AuthProvider only reads localStorage once, on mount —
                // without this, isAuthenticated/user stay stale in React
                // state even though the session just died server-side.
                window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));


                return Promise.reject(
                    refreshError
                );


            } finally {

                isRefreshing = false;

            }

        }



        return Promise.reject(error);

    }

);


export default api;