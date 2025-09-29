// // services/api.js
// import axios from 'axios';

// const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// API.interceptors.request.use((req) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     req.headers.Authorization = `Bearer ${token}`;
//   }
//   return req;
// });

// export default API;


// src/services/api.ts
import axios from 'axios';
import type { User, Store, Rating, DashboardStats, PaginationParams } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (email: string, password: string) =>
    api.post('/auth/signin', { email, password }),
  register: (userData: Omit<User, 'id' | 'createdAt'> & { password: string }) =>
    api.post('/auth/signup', userData),
  resetPassword: (email: string, newPassword: string, confirmPassword: string) =>
    api.post('/auth/reset-password', { email, new_password: newPassword, confirm_password: confirmPassword }),
};

export const userService = {
  getUsers: (params?: PaginationParams) => api.get('/users', { params }),
  createUser: (userData: any) => api.post('/users', userData),
  getUserRatings: (userId: string) => api.get(`/users/${userId}/ratings`),
};

export const storeService = {
  getStores: (params?: PaginationParams) => api.get('/stores', { params }),
  createStore: (storeData: any) => api.post('/stores', storeData),
  submitRating: (storeId: string, ratingValue: number) =>
    api.post(`/stores/${storeId}/ratings`, { rating_value: ratingValue }),
  getStoreRatings: (storeId: string) => api.get(`/stores/${storeId}/ratings`),
};

export const ratingService = {
  updateRating: (ratingId: string, ratingValue: number) =>
    api.patch(`/ratings/${ratingId}`, { rating_value: ratingValue }),
  getStoreAggregation: (storeId: string) => api.get(`/ratings/aggregate/store/${storeId}`),
};

export const dashboardService = {
  getAdminDashboard: () => api.get('/dashboard/admin'),
  getStoreOwnerDashboard: () => api.get('/dashboard/store-owner'),
};

export default api;