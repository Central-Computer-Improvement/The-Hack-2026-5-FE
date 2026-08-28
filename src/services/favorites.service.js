import api from '../lib/axios';

export const getFavorites = () => api.get('/api/favorites');

export const addFavorite = (recipe) => api.post('/api/favorites', recipe);

export const removeFavorite = (id) => api.delete(`/api/favorites/${id}`);
