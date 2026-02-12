import { api } from '@/lib/axios';

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/user/login', { email, password });
        // The backend returns { data: { token, user } } inside response.data
        if (response.data.success && response.data.data.token) {
            localStorage.setItem('token', response.data.data.token);
            // The backend returns user object as well, let's store it
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
            return response.data.data;
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
            // Ideally, the form should be updated to collect phone.
            phone: '0000000000',
            // Organization ID handling might be needed if creating a new org or joining one.
            // For now, passing 'company' as a placeholder or if it's an ID.
            // Backend User model schema expects ObjectId for organization_id (ref: Organization).
            // If the user is creating a new company, maybe backend handles specific logic or separate endpoint.
            // But User controller just calls UserService.signup(req.body).
            // UserService checks existing user by email/phone.
            // Then creates user.
            // If organization_id is passed it must be an ObjectId.
            // If 'company' is a string name, we can't pass it directly to organization_id.
            // I'll omit organization_id for now unless it's a valid ID to avoid cast error.
            // (or if backend handles name -> org creation logic which it doesn't seem to yet based on snippets)
        };

        // If userData.company is an ID (24 hex chars), include it.
        // Otherwise, we might need a different flow for creating org.
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

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};

export default api;
