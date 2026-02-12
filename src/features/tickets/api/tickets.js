import { api } from '@/lib/axios';

export const ticketService = {
    // List all tickets with optional filters
    list: async (params = {}) => {
        const response = await api.get('/tickets', { params });
        return response.data;
    },

    // Get ticket details by ID
    getDetails: async (ticketId) => {
        const response = await api.get(`/tickets/${ticketId}`);
        return response.data;
    },

    // Create a new ticket
    create: async (ticketData) => {
        const response = await api.post('/tickets', ticketData);
        return response.data;
    },

    // Update ticket
    update: async (ticketId, updateData) => {
        const response = await api.patch(`/tickets/${ticketId}`, updateData);
        return response.data;
    },

    // Update ticket status
    updateStatus: async (ticketId, status) => {
        const response = await api.patch(`/tickets/${ticketId}/status`, { status });
        return response.data;
    },

    // Update ticket priority
    updatePriority: async (ticketId, priority) => {
        const response = await api.patch(`/tickets/${ticketId}/priority`, { priority });
        return response.data;
    },

    // Assign ticket to agent
    assignTicket: async (ticketId, assigneeId) => {
        const response = await api.patch(`/tickets/${ticketId}/assign`, { assignee_id: assigneeId });
        return response.data;
    },

    // Delete ticket
    delete: async (ticketId) => {
        const response = await api.delete(`/tickets/${ticketId}`);
        return response.data;
    },

    // Get ticket comments
    getComments: async (ticketId) => {
        const response = await api.get(`/tickets/${ticketId}/comments`);
        return response.data;
    },

    // Add comment to ticket
    addComment: async (ticketId, commentData) => {
        const response = await api.post(`/tickets/${ticketId}/comments`, commentData);
        return response.data;
    },

    // Update comment
    updateComment: async (ticketId, commentId, commentData) => {
        const response = await api.patch(`/tickets/${ticketId}/comments/${commentId}`, commentData);
        return response.data;
    },

    // Delete comment
    deleteComment: async (ticketId, commentId) => {
        const response = await api.delete(`/tickets/${ticketId}/comments/${commentId}`);
        return response.data;
    },

    // Bulk update tickets
    bulkUpdate: async (ticketIds, updates) => {
        const response = await api.post('/tickets/bulk-update', {
            ticket_ids: ticketIds,
            updates,
        });
        return response.data;
    },

    // Bulk delete tickets
    bulkDelete: async (ticketIds) => {
        const response = await api.delete('/tickets/bulk-delete', {
            data: { ticket_ids: ticketIds },
        });
        return response.data;
    },
};

export default ticketService;
