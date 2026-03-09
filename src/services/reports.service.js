import { api } from '@/lib/axios';

export const reportsService = {
    getSummary: async (range = '7d') => {
        const response = await api.get('/reports/summary', { params: { range } });
        return response.data;
    },

    getTicketTrends: async (range = '7d') => {
        const response = await api.get('/reports/ticket-trends', { params: { range } });
        return response.data;
    },

    getAgentPerformance: async (range = '7d') => {
        const response = await api.get('/reports/agent-performance', { params: { range } });
        return response.data;
    },

    getChannelDistribution: async (range = '7d') => {
        const response = await api.get('/reports/channel-distribution', { params: { range } });
        return response.data;
    },

    getSlaCompliance: async (range = '30d') => {
        const response = await api.get('/reports/sla-compliance', { params: { range } });
        return response.data;
    },
};
