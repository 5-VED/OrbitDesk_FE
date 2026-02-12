import { api } from '@/lib/axios';

export const organizationService = {
    // Get all organizations
    list: async (params = {}) => {
        const response = await api.get('/organizations', { params });
        return response.data;
    },

    // Get organization by ID
    getById: async (orgId) => {
        const response = await api.get(`/organizations/${orgId}`);
        return response.data;
    },

    // Create a new organization
    create: async (orgData) => {
        const response = await api.post('/organizations', orgData);
        return response.data;
    },

    // Update organization
    update: async (orgId, orgData) => {
        const response = await api.patch(`/organizations/${orgId}`, orgData);
        return response.data;
    },

    // Delete organization
    delete: async (orgId) => {
        const response = await api.delete(`/organizations/${orgId}`);
        return response.data;
    },
};

export default organizationService;
