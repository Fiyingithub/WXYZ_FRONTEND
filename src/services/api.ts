import axios from "axios";
import type { AxiosRequestConfig, AxiosRequestHeaders } from "axios";

const api = axios.create({
    // baseURL: "http://localhost:4000/api",
    baseURL: "https://wxyz-backend.onrender.com/api",
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


                // Call your refresh token endpoint
                const response = await axios.post(

                    `https://wxyz-backend.onrender.com/api/user/refresh-token`,

                    {},

                    {
                        withCredentials: true,
                    }

                );



                const newAccessToken =
                    response.data.data.accessToken;



                console.log(
                    "Token refreshed:",
                    newAccessToken
                );



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


                localStorage.removeItem(
                    "userToken"
                );


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