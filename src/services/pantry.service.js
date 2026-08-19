import api from '../lib/axios';

/** GET /api/pantry — retrieve all pantry items for the authenticated user */
export const getPantry = () => api.get('/api/pantry');

/** POST /api/pantry — add a new ingredient to the pantry */
export const addPantryItem = (data) => api.post('/api/pantry', data);

/** PUT /api/pantry/:id — update an existing pantry item */
export const updatePantryItem = (id, data) => api.put(`/api/pantry/${id}`, data);

/** DELETE /api/pantry/:id — remove an ingredient from the pantry */
export const deletePantryItem = (id) => api.delete(`/api/pantry/${id}`);
