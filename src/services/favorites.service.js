import api from '../lib/axios';

/** GET /api/favorites — retrieve all saved favourite recipes */
export const getFavorites = () => api.get('/api/favorites');

/** POST /api/favorites — save a recipe object to favourites */
export const addFavorite = (recipe) => api.post('/api/favorites', recipe);

/** DELETE /api/favorites/:id — remove a recipe from favourites */
export const removeFavorite = (id) => api.delete(`/api/favorites/${id}`);
