import api from '../lib/axios';

/** POST /api/ai/scan-pantry — detect ingredients from a photo via Vision AI */
export const scanPantry = (payload) => api.post('/api/ai/scan-pantry', payload);

/** POST /api/ai/generate-recipes — generate zero-waste recipes from ingredients */
export const generateRecipes = (ingredients, kitchenFilters = {}) =>
  api.post('/api/ai/generate-recipes', { ingredients, kitchenFilters });

/** GET /api/ai/history — fetch the last 10 AI-generated recipe sessions */
export const getHistory = () => api.get('/api/ai/history');

/** DELETE /api/ai/history — clear all recipe history for the current user */
export const clearHistory = () => api.delete('/api/ai/history');
