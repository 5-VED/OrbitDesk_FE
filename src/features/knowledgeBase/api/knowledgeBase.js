import { api } from '@/lib/axios';

export const knowledgeBaseService = {
    // Categories
    getCategories: async (params = {}) => {
        const response = await api.get('/kb/categories', { params });
        return response.data;
    },

    createCategory: async (payload) => {
        const response = await api.post('/kb/categories', payload);
        return response.data;
    },

    updateCategory: async (id, payload) => {
        const response = await api.patch(`/kb/categories/${id}`, payload);
        return response.data;
    },

    deleteCategory: async (id) => {
        const response = await api.delete(`/kb/categories/${id}`);
        return response.data;
    },

    // Articles
    getArticles: async (params = {}) => {
        const response = await api.get('/kb/articles', { params });
        return response.data;
    },

    getArticle: async (id) => {
        const response = await api.get(`/kb/articles/${id}`);
        return response.data;
    },

    createArticle: async (payload) => {
        const response = await api.post('/kb/articles', payload);
        return response.data;
    },

    updateArticle: async (id, payload) => {
        const response = await api.patch(`/kb/articles/${id}`, payload);
        return response.data;
    },

    deleteArticle: async (id) => {
        const response = await api.delete(`/kb/articles/${id}`);
        return response.data;
    },
};
