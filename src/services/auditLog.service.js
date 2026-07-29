import { api } from '@/lib/axios';

export const auditLogService = {
    list: async (params = {}) => {
        const response = await api.get('/audit-logs', { params });
        return response.data;
    },

    exportCsv: async (params = {}) => {
        const response = await api.get('/audit-logs/export', {
            params,
            responseType: 'blob',
        });
        return response.data;
    },
};
