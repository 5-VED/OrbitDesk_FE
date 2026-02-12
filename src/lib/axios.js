import axios from 'axios';

// Create instance
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Add Token & Tenant ID
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    // Future Multi-tenant logic can go here
    return config;
});

// Response Interceptor: Handle Errors globally
api.interceptors.response.use(
    (response) => response, // Axios automatically returns response.data ? No, usually response object.
    (error) => {
        if (error.response?.status === 401) {
            // Clear storage and redirect to login automatically
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
