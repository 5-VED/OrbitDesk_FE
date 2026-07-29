import { api } from '@/lib/axios';

export const notificationService = {
    list: async () => {
        const response = await api.get('/notifications');
        return response.data;
    },

    markRead: async (id) => {
        const response = await api.patch(`/notifications/${id}/read`);
        return response.data;
    },

    markAllRead: async () => {
        const response = await api.patch('/notifications/mark-all-read');
        return response.data;
    },
};
