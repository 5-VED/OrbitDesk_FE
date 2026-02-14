import { api } from '../lib/axios';

export const aiService = {
    /**
     * Generate a smart reply based on the ticket context using AI.
     * @param {Object} data - Contains ticketId and optional context
     * @returns {Promise<string>} The generated reply text
     */
    generateReply: async (data) => {
        const response = await api.post('/ai/generate-reply', data);
        return response.data;
    },

    /**
     * Summarize a ticket conversation
     * @param {string} ticketId 
     * @returns {Promise<string>} Summary text
     */
    summarizeTicket: async (data) => {
        const response = await api.post('/ai/summarize', data);
        return response.data;
    },

    /**
     * Analyze sentiment of a text
     * @param {string} text 
     * @returns {Promise<Object>} Sentiment data { label, score, emoji }
     */
    analyzeSentiment: async (text) => {
        const response = await api.post('/ai/analyze-sentiment', { text });
        return response.data;
    },

    /**
     * Suggest tags for a ticket
     * @param {string} ticketId 
     * @returns {Promise<Array>} List of suggested tags
     */
    suggestTags: async (content) => {
        // content can be a string (description) or object { ticketId }
        // If string, we send ticketContent. If object with ticketId, we might need to fetch content backend side,
        // but currently backend controller expects ticketContent.
        // So let's align frontend to always send ticketContent or let backend handle it.
        // For now, let's assume content is the text description.
        const response = await api.post('/ai/suggest-tags', { ticketContent: content });
        return response.data;
    }
};
