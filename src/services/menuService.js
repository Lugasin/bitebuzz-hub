import { apiService } from './apiService';

const API_BASE_URL = 'http://localhost:3000/api';

export const getPopularItems = async (limit = 10) => {
  try {
    return await apiService.getPopularItems(limit);
  } catch (error) {
    console.error('Error fetching popular items:', error);
    return [];
  }
};

export const getTopRatedRestaurants = async (limit = 5) => {
  try {
    return await apiService.getTopRatedRestaurants(limit);
  } catch (error) {
    console.error('Error fetching top restaurants:', error);
    return [];
  }
};

export const getTrendingItems = async (limit = 4) => {
  try {
    return await apiService.getTrendingItems(limit);
  } catch (error) {
    console.error('Error fetching trending items:', error);
    return [];
  }
};

export const getRecommendedItems = async (limit = 4) => {
  try {
    return await apiService.getRecommendedItems(limit);
  } catch (error) {
    console.error('Error fetching recommended items:', error);
    return [];
  }
};

export const getItemsByCategory = async (categoryId) => {
  try {
    return await apiService.getItemsByCategory(categoryId);
  } catch (error) {
    console.error('Error fetching category items:', error);
    return [];
  }
};

export const searchMenuItems = async (searchTerm) => {
  try {
    return await apiService.searchMenuItems(searchTerm);
  } catch (error) {
    console.error('Error searching menu items:', error);
    return [];
  }
};

export const ZAMBIAN_CATEGORIES = [
  {
    id: 1,
    name: 'Main Dishes',
    description: 'Traditional Zambian main courses',
    imageUrl: '/images/categories/main-dishes.jpg',
    subcategories: ['Nshima', 'Ifisashi', 'Kapenta', 'Chikanda']
  },
  {
    id: 2,
    name: 'Side Dishes',
    description: 'Perfect accompaniments to your meal',
    imageUrl: '/images/categories/side-dishes.jpg',
    subcategories: ['Vegetables', 'Relishes', 'Sauces']
  },
  {
    id: 3,
    name: 'Drinks',
    description: 'Traditional and modern beverages',
    imageUrl: '/images/categories/drinks.jpg',
    subcategories: ['Munkoyo', 'Maheu', 'Soft Drinks']
  },
  {
    id: 4,
    name: 'Alcohol',
    description: 'Local and imported alcoholic beverages',
    imageUrl: '/images/categories/alcohol.jpg',
    subcategories: ['Beer', 'Wine', 'Spirits']
  },
  {
    id: 5,
    name: 'Snacks',
    description: 'Quick bites and street food',
    imageUrl: '/images/categories/snacks.jpg',
    subcategories: ['Roasted Maize', 'Kapenta', 'Chips']
  },
  {
    id: 6,
    name: 'Desserts',
    description: 'Sweet treats to end your meal',
    imageUrl: '/images/categories/desserts.jpg',
    subcategories: ['Fritters', 'Cakes', 'Ice Cream']
  }
]; 