import api from '../lib/axios';

/** POST /api/auth/register — create a new user account */
export const registerUser = (data) => api.post('/api/auth/register', data);

/** POST /api/auth/login — authenticate user and obtain JWT */
export const loginUser = (data) => api.post('/api/auth/login', data);

/** GET /api/auth/me — fetch profile of the currently authenticated user */
export const getMe = () => api.get('/api/auth/me');
