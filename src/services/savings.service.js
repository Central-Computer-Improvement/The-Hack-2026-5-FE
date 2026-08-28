import api from '../lib/axios';

export const recordSaving = (payload) => api.post('/api/savings', payload);

export const getSavings = () => api.get('/api/savings');

export const getSavingsSummary = () => api.get('/api/savings/summary');
