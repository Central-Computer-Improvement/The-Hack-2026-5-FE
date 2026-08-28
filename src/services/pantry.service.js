import api from '../lib/axios';

export const getPantry = () => api.get('/api/pantry');

export const addPantryItem = (data) => api.post('/api/pantry', data);

export const updatePantryItem = (id, data) => api.put(`/api/pantry/${id}`, data);

export const deletePantryItem = (id) => api.delete(`/api/pantry/${id}`);
