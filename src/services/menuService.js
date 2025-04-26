export const getPopularItems = async (limit = 10) => {
  try {
    const response = await fetch(`/api/menu/popular?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch popular items');
    return await response.json();
  } catch (error) {
    console.error('Error fetching popular items:', error);
    return [];
  }
};

export const getTopRatedRestaurants = async (limit = 5) => {
  try {
    const response = await fetch(`/api/restaurants/top?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch top restaurants');
    return await response.json();
  } catch (error) {
    console.error('Error fetching top restaurants:', error);
    return [];
  }
};

export const getTrendingItems = async (limit = 4) => {
  try {
    const response = await fetch(`/api/menu/trending?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch trending items');
    return await response.json();
  } catch (error) {
    console.error('Error fetching trending items:', error);
    return [];
  }
};

export const getRecommendedItems = async (userId, limit = 4) => {
  try {
    const response = await fetch(`/api/menu/recommended?userId=${userId}&limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch recommended items');
    return await response.json();
  } catch (error) {
    console.error('Error fetching recommended items:', error);
    return [];
  }
};

export const getItemsByCategory = async (categoryId) => {
  try {
    const response = await fetch(`/api/menu/category/${categoryId}`);
    if (!response.ok) throw new Error('Failed to fetch category items');
    return await response.json();
  } catch (error) {
    console.error('Error fetching category items:', error);
    return [];
  }
};

export const searchMenuItems = async (searchTerm) => {
  try {
    const response = await fetch(`/api/menu/search?q=${encodeURIComponent(searchTerm)}`);
    if (!response.ok) throw new Error('Failed to search menu items');
    return await response.json();
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