import axios, { type InternalAxiosRequestConfig } from "axios";
import { serverURL } from "./constants";

const axiosInstance = axios.create({
    baseURL:    serverURL,
    timeout:    10000,
    headers: {
        "Content-Type": "application/json"
    },
})

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem("token")

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
}, (err: string) => {
    return Promise.reject(err)
})

export default axiosInstance