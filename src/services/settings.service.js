import { api } from '@/lib/axios';

export const settingsService = {
    get: async (category) => {
        const params = category ? { category } : {};
        const response = await api.get('/settings', { params });
        return response.data;
    },

    update: async (category, data) => {
        const response = await api.patch(`/settings/${category}`, data);
        return response.data;
    },
};
