import axios from 'axios';

// Create instance
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Add Token & Tenant ID
api.interceptors.request.use((config) => {
    // const token = localStorage.getItem('token');
    // if (token) {
    //     config.headers.Authorization = `Bearer ${token}`;
    // }
    // Token is now handled via httpOnly cookie by the browser
    return config;
});

// Response Interceptor: Handle Errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear storage and redirect to login automatically
            localStorage.removeItem('user');
            // Check if we are already on login page to avoid loop
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);
