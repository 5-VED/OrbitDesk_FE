import { api } from '@/lib/axios';

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/user/login', { email, password });
        // The backend sets the token in an httpOnly cookie.
        // We just store the user info for UI state.
        if (response.data.success) {
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
            return response.data.data; // { user, token } - token is in cookie now too
        }
        return response.data;
    },

    signup: async (userData) => {
        // Splitting name to accommodate backend schema
        const nameParts = userData.name.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : (firstName || 'User');

        const payload = {
            first_name: firstName,
            last_name: lastName,
            email: userData.email,
            password: userData.password,
            // Assuming phone is not in initial signup form, providing a default.
            phone: userData.phone,
            country_code: userData.countryCode ? userData.countryCode.replace(/-/g, '') : '+91',
            gender: userData.gender || 'other',
        };

        // If userData.company is an ID (24 hex chars), include it.
        if (userData.company && /^[0-9a-fA-F]{24}$/.test(userData.company)) {
            payload.organization_id = userData.company;
        }

        const response = await api.post('/user/signup', payload);
        return response.data;
    },

    updateProfile: async (userId, data) => {
        const response = await api.patch(`/user/${userId}`, data);
        if (response.data.success) {
            const currentUser = JSON.parse(localStorage.getItem('user'));
            const updatedUser = { ...currentUser, ...response.data.data };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        }
        return response.data;
    },

    logout: async () => {
        try {
            await api.post('/user/logout');
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            localStorage.removeItem('user');
            // Token is httpOnly cookie, browser handles removal on response or expiry,
            // but the logout endpoint explicitly clears it.
        }
    },

    checkSession: async () => {
        try {
            const response = await api.get('/user/me');
            if (response.data.success) {
                localStorage.setItem('user', JSON.stringify(response.data.data));
                return response.data.data;
            }
        } catch (error) {
            return null;
        }
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('user'); // Basic check, real check is /user/me
    }
};

export default api;
