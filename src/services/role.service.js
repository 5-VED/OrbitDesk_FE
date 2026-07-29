import { api } from '@/lib/axios';

export const roleService = {
    list: async () => {
        const response = await api.get('/role');
        return response.data;
    },

    create: async (roleData) => {
        const response = await api.post('/role', roleData);
        return response.data;
    },

    update: async (id, roleData) => {
        const response = await api.patch(`/role/${id}`, roleData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/role/${id}`);
        return response.data;
    },
};
