import { api } from '@/lib/axios';

export const userService = {
    // Get all users (can filter by role)
    list: async (params = {}) => {
        const response = await api.get('/user', { params });
        return response.data;
    },

    // Get agents (users who can be assigned tickets)
    getAgents: async () => {
        // Now calling the specific endpoint that returns stats
        const response = await api.get('/user/agents');
        return response.data; // Expected { success: true, data: { agents: [], pagination: {} } }
    },

    // Get user by ID
    getById: async (userId) => {
        const response = await api.get(`/user/${userId}`);
        return response.data;
    },

    // Update user
    update: async (userId, userData) => {
        const response = await api.patch(`/user/${userId}`, userData);
        return response.data;
    },

    // Create user (for Admin adding customers/agents)
    create: async (userData) => {
        const response = await api.post('/user', userData);
        return response.data;
    },

    importUser: async (formData) => {
        const response = await api.post('/user/bulk-import', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/user/${id}`);
        return response.data;
    },

    bulkDelete: async (ids) => {
        const response = await api.post('/user/bulk-delete', { ids });
        return response.data;
    },
};

export default userService;
