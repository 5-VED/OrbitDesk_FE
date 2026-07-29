import { api } from '@/lib/axios';

export const dashboardService = {
    getStats: async () => {
        const response = await api.get('/dashboard/stats');
        return response.data;
    },

    getSlaOverview: async () => {
        const response = await api.get('/dashboard/sla-overview');
        return response.data;
    },

    getTopAgents: async () => {
        const response = await api.get('/dashboard/top-agents');
        return response.data;
    },

    getRecentActivity: async () => {
        const response = await api.get('/dashboard/recent-activity');
        return response.data;
    },
};
