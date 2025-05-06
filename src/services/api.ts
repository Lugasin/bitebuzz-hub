
import axios, { AxiosResponse } from 'axios';

const API_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Handle authentication errors
    if (response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// API services
export const api = {
  // Auth endpoints
  auth: {
    login: (email: string, password: string) => 
      apiClient.post('/auth/login', { email, password }),
    
    register: (userData: any) => 
      apiClient.post('/auth/register', userData),
    
    forgotPassword: (email: string) => 
      apiClient.post('/auth/forgot-password', { email }),
    
    resetPassword: (token: string, password: string) => 
      apiClient.post('/auth/reset-password', { token, password }),
    
    validateToken: (token: string) => 
      apiClient.post('/auth/validate-token', { token })
  },
  
  // User endpoints
  users: {
    getProfile: () => apiClient.get('/users/profile'),
    updateProfile: (data: any) => apiClient.put('/users/profile', data),
    getById: (id: string) => apiClient.get(`/users/${id}`),
    getAll: (params?: any) => apiClient.get('/users', { params }),
    changeRole: (userId: string, role: string) => 
      apiClient.put(`/users/${userId}/role`, { role })
  },
  
  // Restaurant endpoints
  restaurants: {
    getAll: (params?: any) => apiClient.get('/restaurants', { params }),
    getById: (id: string) => apiClient.get(`/restaurants/${id}`),
    create: (data: any) => apiClient.post('/restaurants', data),
    update: (id: string, data: any) => apiClient.put(`/restaurants/${id}`, data),
    delete: (id: string) => apiClient.delete(`/restaurants/${id}`),
    getMenu: (id: string) => apiClient.get(`/restaurants/${id}/menu`),
    updateMenu: (id: string, data: any) => 
      apiClient.put(`/restaurants/${id}/menu`, data)
  },
  
  // Order endpoints
  orders: {
    create: (data: any) => apiClient.post('/orders', data),
    getById: (id: string) => apiClient.get(`/orders/${id}`),
    getAll: (params?: any) => apiClient.get('/orders', { params }),
    update: (id: string, data: any) => apiClient.put(`/orders/${id}`, data),
    cancel: (id: string) => apiClient.put(`/orders/${id}/cancel`),
    trackDelivery: (id: string) => apiClient.get(`/orders/${id}/track`)
  },
  
  // Analytics endpoints
  analytics: {
    getDashboard: (params?: any) => apiClient.get('/analytics/dashboard', { params }),
    getSales: (params?: any) => apiClient.get('/analytics/sales', { params }),
    getCustomers: (params?: any) => apiClient.get('/analytics/customers', { params }),
    getPopularItems: (params?: any) => apiClient.get('/analytics/popular-items', { params })
  },
  
  // Support endpoints
  support: {
    createTicket: (data: any) => apiClient.post('/support/tickets', data),
    getTickets: (params?: any) => apiClient.get('/support/tickets', { params }),
    getTicketById: (id: string) => apiClient.get(`/support/tickets/${id}`),
    updateTicket: (id: string, data: any) => 
      apiClient.put(`/support/tickets/${id}`, data),
    addComment: (ticketId: string, data: any) => 
      apiClient.post(`/support/tickets/${ticketId}/comments`, data)
  }
};

// Create generic methods for components that need them
export const apiService = {
  get: (url: string, params?: any) => apiClient.get(url, { params }),
  post: (url: string, data: any) => apiClient.post(url, data),
  put: (url: string, data: any) => apiClient.put(url, data),
  delete: (url: string) => apiClient.delete(url)
};

export default api;
