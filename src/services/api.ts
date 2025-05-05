
import axios from 'axios';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login
          // In a real app, this would use a router
          console.error('Authentication required');
          break;
        case 403:
          // Forbidden
          console.error('You do not have permission to access this resource');
          break;
        case 500:
          console.error('Server error occurred');
          break;
        default:
          console.error(`Error: ${error.response.data.message || 'Unknown error'}`);
      }
    } else if (error.request) {
      console.error('No response received from server');
    } else {
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

// API categories
export const api = {
  // Authentication endpoints
  auth: {
    login: (email: string, password: string) => apiClient.post('/auth/login', { email, password }),
    register: (userData: any) => apiClient.post('/auth/register', userData),
    forgotPassword: (email: string) => apiClient.post('/auth/forgot-password', { email }),
    resetPassword: (token: string, password: string) =>
      apiClient.post('/auth/reset-password', { token, password }),
    validateToken: (token: string) => apiClient.post('/auth/validate-token', { token }),
  },
  
  // User endpoints
  user: {
    getProfile: () => apiClient.get('/user/profile'),
    updateProfile: (data: any) => apiClient.put('/user/profile', data),
    getAddresses: () => apiClient.get('/user/addresses'),
    addAddress: (address: any) => apiClient.post('/user/addresses', address),
  },
  
  // Restaurant endpoints
  restaurants: {
    getAll: (params?: any) => apiClient.get('/restaurants', { params }),
    getById: (id: number) => apiClient.get(`/restaurants/${id}`),
    getMenu: (id: number) => apiClient.get(`/restaurants/${id}/menu`),
  },
  
  // Order endpoints
  orders: {
    create: (orderData: any) => apiClient.post('/orders', orderData),
    getById: (id: number) => apiClient.get(`/orders/${id}`),
    getUserOrders: () => apiClient.get('/orders/user'),
    updateStatus: (id: number, status: string) =>
      apiClient.put(`/orders/${id}/status`, { status }),
  },
  
  // Analytics endpoints
  analytics: {
    get: (params?: any) => apiClient.get('/analytics', { params }),
    getOrdersByDate: (startDate: string, endDate: string) =>
      apiClient.get('/analytics/orders-by-date', { params: { startDate, endDate } }),
    getTopProducts: () => apiClient.get('/analytics/top-products'),
    getRevenue: (period: string) =>
      apiClient.get('/analytics/revenue', { params: { period } }),
  },
};
