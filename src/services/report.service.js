import { api } from '@/lib/axios';

export const reportService = {
    getSummary: async (params = {}) => {
        const response = await api.get('/reports/summary', { params });
        return response.data;
    },

    getTicketTrends: async (params = {}) => {
        const response = await api.get('/reports/ticket-trends', { params });
        return response.data;
    },

    getAgentPerformance: async (params = {}) => {
        const response = await api.get('/reports/agent-performance', { params });
        return response.data;
    },

    getChannelDistribution: async (params = {}) => {
        const response = await api.get('/reports/channel-distribution', { params });
        return response.data;
    },

    getSlaCompliance: async (params = {}) => {
        const response = await api.get('/reports/sla-compliance', { params });
        return response.data;
    },
};
