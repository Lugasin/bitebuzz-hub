import axios from 'axios';
import config from './config';

// Create axios instance with default config
const api = axios.create({
  baseURL: config.api.baseUrl,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth token to headers here if needed
    // But prefer using HTTP-only cookies instead
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        await api.post('/auth/refresh');
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Redirect to login if refresh fails
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth service methods
export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  logout: async () => {
    await api.post('/auth/logout');
    // Clear any client-side state
    window.location.href = '/login';
  },

  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Protected API methods
export const protectedApi = {
  // Example protected endpoint
  getUserData: async () => {
    const response = await api.get('/user/data');
    return response.data;
  },

  // Add more protected endpoints as needed
};

export default api; 