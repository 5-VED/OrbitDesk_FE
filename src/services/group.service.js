import api from './auth.service';

export const groupService = {
    // Get all groups
    list: async (params = {}) => {
        const response = await api.get('/groups', { params });
        return response.data;
    },

    // Get group by ID
    getById: async (groupId) => {
        const response = await api.get(`/groups/${groupId}`);
        return response.data;
    },

    // Create a new group
    create: async (groupData) => {
        const response = await api.post('/groups', groupData);
        return response.data;
    },

    // Update group
    update: async (groupId, groupData) => {
        const response = await api.patch(`/groups/${groupId}`, groupData);
        return response.data;
    },

    // Delete group
    delete: async (groupId) => {
        const response = await api.delete(`/groups/${groupId}`);
        return response.data;
    },
};

export default groupService;
