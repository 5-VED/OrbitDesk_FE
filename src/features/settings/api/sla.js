import { api } from '@/lib/axios';

export const slaService = {
    // List all policies
    list: async (params = {}) => {
        const response = await api.get('/sla', { params });
        return response.data;
    },

    // Get policy details
    getDetails: async (id) => {
        const response = await api.get(`/sla/${id}`);
        return response.data;
    },

    // Create a new policy
    create: async (data) => {
        const response = await api.post('/sla', data);
        return response.data;
    },

    // Update policy
    update: async (id, data) => {
        const response = await api.patch(`/sla/${id}`, data);
        return response.data;
    },

    // Delete policy
    delete: async (id) => {
        const response = await api.delete(`/sla/${id}`);
        return response.data;
    },

    // Reorder policies
    reorder: async (orderedIds) => {
        const response = await api.post('/sla/reorder', { orderedIds });
        return response.data;
    }
};

export default slaService;
