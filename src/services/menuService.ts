import { db } from '../config/firebase';
import { collection, query, where, getDocs, orderBy, limit, doc, getDoc } from 'firebase/firestore';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  imageUrl: string;
  rating: number;
  ratingCount: number;
  preparationTime: number;
  isPopular: boolean;
  isAvailable: boolean;
  restaurantId: string;
  restaurantName: string;
  restaurantRating: number;
  dietaryInfo: {
    isVegetarian: boolean;
    isVegan: boolean;
    isGlutenFree: boolean;
    isSpicy: boolean;
  };
  ingredients: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  subcategories: string[];
}

export const ZAMBIAN_CATEGORIES: MenuCategory[] = [
  {
    id: 'main-dishes',
    name: 'Main Dishes',
    description: 'Traditional Zambian main courses',
    imageUrl: '/images/categories/main-dishes.jpg',
    subcategories: ['Nshima', 'Ifisashi', 'Kapenta', 'Chikanda', 'Biltong']
  },
  {
    id: 'side-dishes',
    name: 'Side Dishes',
    description: 'Perfect accompaniments to your main meal',
    imageUrl: '/images/categories/side-dishes.jpg',
    subcategories: ['Vegetables', 'Relishes', 'Sauces', 'Salads']
  },
  {
    id: 'drinks',
    name: 'Drinks',
    description: 'Refreshing beverages',
    imageUrl: '/images/categories/drinks.jpg',
    subcategories: ['Soft Drinks', 'Juices', 'Traditional Drinks', 'Hot Beverages']
  },
  {
    id: 'alcohol',
    name: 'Alcohol',
    description: 'Local and imported alcoholic beverages',
    imageUrl: '/images/categories/alcohol.jpg',
    subcategories: ['Beer', 'Wine', 'Spirits', 'Traditional Brews']
  },
  {
    id: 'snacks',
    name: 'Snacks',
    description: 'Quick bites and street food',
    imageUrl: '/images/categories/snacks.jpg',
    subcategories: ['Street Food', 'Pastries', 'Fruits', 'Nuts']
  },
  {
    id: 'desserts',
    name: 'Desserts',
    description: 'Sweet treats and traditional desserts',
    imageUrl: '/images/categories/desserts.jpg',
    subcategories: ['Cakes', 'Traditional Sweets', 'Ice Cream', 'Fruits']
  }
];

export interface MenuFilterOptions {
  category?: string;
  subcategory?: string;
  minRating?: number;
  maxPrice?: number;
  dietaryRestrictions?: {
    isVegetarian?: boolean;
    isVegan?: boolean;
    isGlutenFree?: boolean;
    isSpicy?: boolean;
  };
  preparationTime?: number;
  restaurantId?: string;
  sortBy?: 'price' | 'rating' | 'preparationTime' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

export const getPopularItems = async (limit: number = 10): Promise<MenuItem[]> => {
  const itemsRef = collection(db, 'menuItems');
  const q = query(
    itemsRef,
    where('isPopular', '==', true),
    orderBy('rating', 'desc'),
    limit(limit)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
};

export const getItemsByCategory = async (
  category: string,
  subcategory?: string
): Promise<MenuItem[]> => {
  const itemsRef = collection(db, 'menuItems');
  let q = query(
    itemsRef,
    where('category', '==', category),
    orderBy('rating', 'desc')
  );
  
  if (subcategory) {
    q = query(
      itemsRef,
      where('category', '==', category),
      where('subcategory', '==', subcategory),
      orderBy('rating', 'desc')
    );
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
};

export const getTopRatedRestaurants = async (limit: number = 5): Promise<MenuItem[]> => {
  const itemsRef = collection(db, 'menuItems');
  const q = query(
    itemsRef,
    orderBy('restaurantRating', 'desc'),
    limit(limit)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
};

export const searchMenuItems = async (
  searchTerm: string,
  filters?: {
    category?: string;
    subcategory?: string;
    minRating?: number;
    maxPrice?: number;
  }
): Promise<MenuItem[]> => {
  const itemsRef = collection(db, 'menuItems');
  let q = query(itemsRef);
  
  if (filters?.category) {
    q = query(q, where('category', '==', filters.category));
  }
  
  if (filters?.subcategory) {
    q = query(q, where('subcategory', '==', filters.subcategory));
  }
  
  if (filters?.minRating) {
    q = query(q, where('rating', '>=', filters.minRating));
  }
  
  if (filters?.maxPrice) {
    q = query(q, where('price', '<=', filters.maxPrice));
  }
  
  const snapshot = await getDocs(q);
  const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
  
  return items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.restaurantName.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export const getFilteredItems = async (
  filters: MenuFilterOptions,
  limit: number = 20
): Promise<MenuItem[]> => {
  const itemsRef = collection(db, 'menuItems');
  let q = query(itemsRef);

  // Apply filters
  if (filters.category) {
    q = query(q, where('category', '==', filters.category));
  }
  
  if (filters.subcategory) {
    q = query(q, where('subcategory', '==', filters.subcategory));
  }
  
  if (filters.minRating) {
    q = query(q, where('rating', '>=', filters.minRating));
  }
  
  if (filters.maxPrice) {
    q = query(q, where('price', '<=', filters.maxPrice));
  }

  if (filters.dietaryRestrictions) {
    const { isVegetarian, isVegan, isGlutenFree, isSpicy } = filters.dietaryRestrictions;
    if (isVegetarian) {
      q = query(q, where('dietaryInfo.isVegetarian', '==', true));
    }
    if (isVegan) {
      q = query(q, where('dietaryInfo.isVegan', '==', true));
    }
    if (isGlutenFree) {
      q = query(q, where('dietaryInfo.isGlutenFree', '==', true));
    }
    if (isSpicy) {
      q = query(q, where('dietaryInfo.isSpicy', '==', true));
    }
  }

  if (filters.preparationTime) {
    q = query(q, where('preparationTime', '<=', filters.preparationTime));
  }

  if (filters.restaurantId) {
    q = query(q, where('restaurantId', '==', filters.restaurantId));
  }

  // Apply sorting
  if (filters.sortBy) {
    const order = filters.sortOrder === 'desc' ? 'desc' : 'asc';
    q = query(q, orderBy(filters.sortBy, order));
  }

  // Apply limit
  q = query(q, limit(limit));

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
};

export const getRestaurantMenu = async (
  restaurantId: string,
  filters?: Omit<MenuFilterOptions, 'restaurantId'>
): Promise<MenuItem[]> => {
  return getFilteredItems({ ...filters, restaurantId });
};

export const getRecommendedItems = async (
  userId: string,
  limit: number = 10
): Promise<MenuItem[]> => {
  // Get user's order history and preferences
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  const userData = userDoc.data();

  if (!userData) {
    return getPopularItems(limit);
  }

  const { orderHistory, dietaryPreferences } = userData;

  // Create filters based on user preferences
  const filters: MenuFilterOptions = {
    dietaryRestrictions: dietaryPreferences,
    sortBy: 'rating',
    sortOrder: 'desc'
  };

  // If user has order history, prioritize items from frequently ordered categories
  if (orderHistory?.length > 0) {
    const categoryCounts = orderHistory.reduce((acc: { [key: string]: number }, order) => {
      order.items.forEach((item: MenuItem) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
      });
      return acc;
    }, {});

    const favoriteCategory = Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0];

    if (favoriteCategory) {
      filters.category = favoriteCategory;
    }
  }

  return getFilteredItems(filters, limit);
};

export const getTrendingItems = async (limit: number = 10): Promise<MenuItem[]> => {
  const itemsRef = collection(db, 'menuItems');
  const q = query(
    itemsRef,
    where('isAvailable', '==', true),
    orderBy('ratingCount', 'desc'),
    limit(limit)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
};

export const getItemsByPriceRange = async (
  minPrice: number,
  maxPrice: number,
  filters?: Omit<MenuFilterOptions, 'minPrice' | 'maxPrice'>
): Promise<MenuItem[]> => {
  return getFilteredItems({
    ...filters,
    minPrice,
    maxPrice
  });
};

export const getItemsByPreparationTime = async (
  maxTime: number,
  filters?: Omit<MenuFilterOptions, 'preparationTime'>
): Promise<MenuItem[]> => {
  return getFilteredItems({
    ...filters,
    preparationTime: maxTime
  });
}; 