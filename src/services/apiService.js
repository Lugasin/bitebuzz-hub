const API_BASE_URL = 'http://localhost:3000/api';

export const apiService = {
  // Auth endpoints
  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) throw new Error('Login failed');
    return await response.json();
  },

  async register(userData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!response.ok) throw new Error('Registration failed');
    return await response.json();
  },

  // Menu endpoints
  async getPopularItems(limit = 10) {
    const response = await fetch(`${API_BASE_URL}/menu/popular?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch popular items');
    return await response.json();
  },

  async getTopRatedRestaurants(limit = 5) {
    const response = await fetch(`${API_BASE_URL}/restaurants/top?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch top restaurants');
    return await response.json();
  },

  async getTrendingItems(limit = 4) {
    const response = await fetch(`${API_BASE_URL}/menu/trending?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch trending items');
    return await response.json();
  },

  async getRecommendedItems(limit = 4) {
    const response = await fetch(`${API_BASE_URL}/menu/recommended?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch recommended items');
    return await response.json();
  },

  async getItemsByCategory(categoryId) {
    const response = await fetch(`${API_BASE_URL}/menu/category/${categoryId}`);
    if (!response.ok) throw new Error('Failed to fetch category items');
    return await response.json();
  },

  async searchMenuItems(searchTerm) {
    const response = await fetch(`${API_BASE_URL}/menu/search?q=${encodeURIComponent(searchTerm)}`);
    if (!response.ok) throw new Error('Failed to search menu items');
    return await response.json();
  },

  // User endpoints
  async getUserProfile() {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) throw new Error('Failed to fetch user profile');
    return await response.json();
  },

  async updateUserProfile(userData) {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(userData)
    });
    if (!response.ok) throw new Error('Failed to update user profile');
    return await response.json();
  },

  // Delivery Driver endpoints
  async getDeliveryDriverProfile(driverId) {
    const response = await fetch(`${API_BASE_URL}/drivers/${driverId}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) throw new Error('Failed to fetch driver profile');
    return await response.json();
  },

  async updateDeliveryDriverLocation(driverId, location) {
    const response = await fetch(`${API_BASE_URL}/drivers/${driverId}/location`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ location })
    });
    if (!response.ok) throw new Error('Failed to update driver location');
    return await response.json();
  },

  async updateDeliveryDriverStatus(driverId, status) {
    const response = await fetch(`${API_BASE_URL}/drivers/${driverId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update driver status');
    return await response.json();
  },

  async getActiveDeliveries(driverId) {
    const response = await fetch(`${API_BASE_URL}/drivers/${driverId}/active-deliveries`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) throw new Error('Failed to fetch active deliveries');
    return await response.json();
  },

  async getAvailableOrders(driverId) {
    const response = await fetch(`${API_BASE_URL}/drivers/${driverId}/available-orders`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) throw new Error('Failed to fetch available orders');
    return await response.json();
  },

  async getRecentDeliveries(driverId) {
    const response = await fetch(`${API_BASE_URL}/drivers/${driverId}/recent-deliveries`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) throw new Error('Failed to fetch recent deliveries');
    return await response.json();
  },

  async getDriverEarnings(driverId) {
    const response = await fetch(`${API_BASE_URL}/drivers/${driverId}/earnings`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) throw new Error('Failed to fetch driver earnings');
    return await response.json();
  },

  async acceptOrder(driverId, orderId) {
    const response = await fetch(`${API_BASE_URL}/drivers/${driverId}/orders/${orderId}/accept`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) throw new Error('Failed to accept order');
    return await response.json();
  },

  async completeDelivery(driverId, orderId) {
    const response = await fetch(`${API_BASE_URL}/drivers/${driverId}/orders/${orderId}/complete`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) throw new Error('Failed to complete delivery');
    return await response.json();
  }
}; 