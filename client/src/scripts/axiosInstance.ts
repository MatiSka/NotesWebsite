import axios, { type InternalAxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
    baseURL:    "http://localhost:8000",
    timeout:    5000,
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