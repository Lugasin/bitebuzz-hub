
// Menu service for fetching and managing restaurant menu items

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  subcategory?: string;
  preparationTime: number;
  rating: number;
  ratingCount: number;
  isPopular: boolean;
  restaurantId?: string;
  restaurantName?: string;
  restaurantRating?: number;
  dietaryInfo: {
    isVegetarian: boolean;
    isVegan: boolean;
    isGlutenFree: boolean;
    isSpicy: boolean;
    allergens?: string[];
  }
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  subcategories: string[];
}

// Zambian cuisine categories
export const ZAMBIAN_CATEGORIES: MenuCategory[] = [
  {
    id: 'traditional',
    name: 'Traditional Zambian',
    description: 'Classic local dishes',
    imageUrl: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b',
    subcategories: ['Nshima & Relish', 'Stews', 'Village Dishes']
  },
  {
    id: 'fusion',
    name: 'Zambian Fusion',
    description: 'Modern takes on traditional dishes',
    imageUrl: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83',
    subcategories: ['Gourmet', 'International', 'Street Food']
  },
  {
    id: 'grilled',
    name: 'Grilled & BBQ',
    description: 'Flame-cooked meats & vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
    subcategories: ['Meats', 'Fish', 'Vegetables']
  },
  {
    id: 'drinks',
    name: 'Beverages',
    description: 'Traditional and modern drinks',
    imageUrl: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d',
    subcategories: ['Local Brews', 'Fruit Drinks', 'Tea & Coffee']
  }
];

// Mock API functions
export const getPopularItems = async (): Promise<MenuItem[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: '1',
      name: 'Nshima with Village Chicken',
      description: 'Traditional Zambian staple with free-range chicken',
      price: 80.00,
      imageUrl: 'https://images.unsplash.com/photo-1567982047351-76b6f93e38ee',
      category: 'traditional',
      subcategory: 'Nshima & Relish',
      preparationTime: 25,
      rating: 4.8,
      ratingCount: 156,
      isPopular: true,
      restaurantId: '1',
      restaurantName: 'Zambian Kitchen',
      dietaryInfo: {
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: true,
        isSpicy: false
      }
    },
    {
      id: '2',
      name: 'Chikanda (African Polony)',
      description: 'Vegetarian dish made from orchid tubers',
      price: 45.00,
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999',
      category: 'traditional',
      subcategory: 'Village Dishes',
      preparationTime: 30,
      rating: 4.3,
      ratingCount: 82,
      isPopular: true,
      restaurantId: '2',
      restaurantName: 'Lusaka Flavors',
      dietaryInfo: {
        isVegetarian: true,
        isVegan: true,
        isGlutenFree: true,
        isSpicy: false
      }
    },
    {
      id: '3',
      name: 'Ifisashi (Peanut Stew)',
      description: 'Vegetables cooked in peanut sauce',
      price: 55.00,
      imageUrl: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14',
      category: 'traditional',
      subcategory: 'Stews',
      preparationTime: 20,
      rating: 4.5,
      ratingCount: 104,
      isPopular: true,
      restaurantId: '3',
      restaurantName: 'Taste of Zambia',
      dietaryInfo: {
        isVegetarian: true,
        isVegan: true,
        isGlutenFree: true,
        isSpicy: true
      }
    }
  ];
};

export const getItemsByCategory = async (category: string, subcategory?: string): Promise<MenuItem[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock items - in a real app, these would come from a database
  const allItems: MenuItem[] = [
    // Traditional category
    {
      id: '101',
      name: 'Nshima with Kapenta',
      description: 'Traditional cornmeal porridge with dried fish',
      price: 65.00,
      imageUrl: 'https://images.unsplash.com/photo-1567982047351-76b6f93e38ee',
      category: 'traditional',
      subcategory: 'Nshima & Relish',
      preparationTime: 15,
      rating: 4.2,
      ratingCount: 78,
      isPopular: false,
      restaurantId: '1',
      dietaryInfo: {
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: true,
        isSpicy: false
      }
    },
    // Additional mock items would be added here
  ];
  
  // Filter by category and subcategory if provided
  return allItems.filter(item => {
    if (subcategory) {
      return item.category === category && item.subcategory === subcategory;
    }
    return item.category === category;
  });
};

export const getTopRatedRestaurants = async (): Promise<MenuItem[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock restaurants represented as menu items
  return [
    {
      id: 'rest-1',
      name: 'Zambian Delight',
      description: 'Authentic Zambian cuisine with modern touches',
      price: 0, // Not applicable for restaurant listing
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
      category: 'restaurant',
      preparationTime: 25, // Average prep time
      rating: 4.8,
      ratingCount: 247,
      isPopular: true,
      restaurantId: '1',
      restaurantName: 'Zambian Delight',
      restaurantRating: 4.8,
      dietaryInfo: {
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false,
        isSpicy: false
      }
    },
    // Additional restaurants would be added here
  ];
};
