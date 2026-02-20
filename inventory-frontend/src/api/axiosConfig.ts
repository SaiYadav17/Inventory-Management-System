import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const axiosInstance = axios.create({
    baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('userInfo') || 'null');
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
