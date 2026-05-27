import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/signup') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  signup: (payload) => api.post('/auth/signup', payload).then((r) => r.data.data),
  login: (payload) => api.post('/auth/login', payload).then((r) => r.data.data),
  me: () => api.get('/auth/me').then((r) => r.data.data),
};

export const taskApi = {
  list: (params = {}) => api.get('/tasks', { params }).then((r) => r.data),
  stats: () => api.get('/tasks/stats').then((r) => r.data.data),
  create: (payload) => api.post('/tasks', payload).then((r) => r.data.data),
  update: (id, payload) => api.put(`/tasks/${id}`, payload).then((r) => r.data.data),
  toggle: (id) => api.patch(`/tasks/${id}/toggle`).then((r) => r.data.data),
  remove: (id) => api.delete(`/tasks/${id}`).then((r) => r.data),
};

export const extractError = (err, fallback = 'Something went wrong') => {
  const data = err?.response?.data;
  if (data?.errors?.length) return data.errors.map((e) => e.message).join(', ');
  return data?.message || err?.message || fallback;
};

export default api;
