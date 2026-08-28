import api from '../lib/axios';

export const scanPantry = (payload) => api.post('/api/ai/scan-pantry', payload);

export const generateRecipes = (ingredients, kitchenFilters = {}) =>
  api.post('/api/ai/generate-recipes', { ingredients, kitchenFilters });

export const getHistory = () => api.get('/api/ai/history');

export const clearHistory = () => api.delete('/api/ai/history');
