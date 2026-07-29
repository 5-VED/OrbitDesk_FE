import { api } from '@/lib/axios';

export const ratingService = {
    submitRating: async (ticketId, { rating, feedback }) => {
        const response = await api.post(`/ratings/ticket/${ticketId}`, { rating, feedback });
        return response.data;
    },

    getRatingByTicket: async (ticketId) => {
        const response = await api.get(`/ratings/ticket/${ticketId}`);
        return response.data;
    },

    getAgentRating: async (agentId) => {
        const response = await api.get(`/ratings/agent/${agentId}`);
        return response.data;
    },
};
