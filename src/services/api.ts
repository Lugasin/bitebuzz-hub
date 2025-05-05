
import axios from 'axios';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API service with typed methods
export default {
  // Authentication
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
      apiClient.post('/auth/validate-token', { token }),
  },
  
  // User management
  users: {
    getProfile: () => 
      apiClient.get('/users/profile'),
    updateProfile: (userData: any) => 
      apiClient.put('/users/profile', userData),
    changePassword: (oldPassword: string, newPassword: string) => 
      apiClient.post('/users/change-password', { oldPassword, newPassword }),
  },
  
  // Restaurant management
  restaurants: {
    getAll: (params?: any) => 
      apiClient.get('/restaurants', { params }),
    getById: (id: string) => 
      apiClient.get(`/restaurants/${id}`),
    getMenu: (id: string) => 
      apiClient.get(`/restaurants/${id}/menu`),
    getReviews: (id: string) => 
      apiClient.get(`/restaurants/${id}/reviews`),
  },
  
  // Orders
  orders: {
    create: (orderData: any) => 
      apiClient.post('/orders', orderData),
    getById: (id: string) => 
      apiClient.get(`/orders/${id}`),
    getHistory: (params?: any) => 
      apiClient.get('/orders/history', { params }),
    cancel: (id: string, reason?: string) => 
      apiClient.post(`/orders/${id}/cancel`, { reason }),
    track: (id: string) => 
      apiClient.get(`/orders/${id}/track`),
  },
  
  // Analytics
  analytics: {
    getOverview: (startDate: string, endDate: string, restaurantId?: string) => 
      apiClient.get('/analytics', { 
        params: { startDate, endDate, restaurantId } 
      }),
    getSalesData: (period: string, restaurantId?: string) => 
      apiClient.get('/analytics/sales', { 
        params: { period, restaurantId } 
      }),
    getOrderStats: (period: string, restaurantId?: string) => 
      apiClient.get('/analytics/orders', { 
        params: { period, restaurantId } 
      }),
  },
  
  // Support
  support: {
    createTicket: (ticketData: any) => 
      apiClient.post('/support/tickets', ticketData),
    getTickets: (params?: any) => 
      apiClient.get('/support/tickets', { params }),
    getTicketById: (id: string) => 
      apiClient.get(`/support/tickets/${id}`),
    addMessage: (ticketId: string, message: string, attachments?: string[]) => 
      apiClient.post(`/support/tickets/${ticketId}/messages`, { message, attachments }),
  },
};
