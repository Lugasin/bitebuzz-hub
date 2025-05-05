
// Meal Planning Service

export enum DietPreference {
  VEGETARIAN = 'VEGETARIAN',
  VEGAN = 'VEGAN',
  KETO = 'KETO',
  PALEO = 'PALEO',
  GLUTEN_FREE = 'GLUTEN_FREE',
  DAIRY_FREE = 'DAIRY_FREE',
  CUSTOM = 'CUSTOM'
}

interface NutritionalTarget {
  calorieTarget: number;
  proteinTarget: number;
  carbTarget: number;
  fatTarget: number;
}

export interface DietPreferenceConfig extends NutritionalTarget {
  type: DietPreference;
  restrictions: string[];
  allergies: string[];
  preferredCuisines: string[];
}

interface MealPlanItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  image: string;
}

interface MealPlanDay {
  date: string;
  breakfast: MealPlanItem;
  lunch: MealPlanItem;
  dinner: MealPlanItem;
  snacks: MealPlanItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface MealPlan {
  userId: string;
  startDate: string;
  endDate: string;
  days: MealPlanDay[];
}

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
  category: string;
}

interface InventoryUpdate {
  quantity: number;
  action: 'ADD' | 'REMOVE';
}

interface InventoryAnalytics {
  totalItems: number;
  totalValue: number;
  lowStockItems: InventoryItem[];
  itemsByCategory: Record<string, { count: number; value: number }>;
  usageTrends: Array<{
    date: string;
    itemsUsed: number;
    value: number;
  }>;
}

export const generateMealPlan = async (
  userId: string,
  dietPreference: DietPreferenceConfig,
  duration: number
): Promise<MealPlan> => {
  // In a real implementation, this would query available menu items
  // that match the dietary preferences
  // For now, return mock data
  
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + duration - 1);
  
  // Generate a meal plan for each day
  const days: MealPlanDay[] = [];
  
  for (let i = 0; i < duration; i++) {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + i);
    
    // Generate a mock meal plan for this day
    const day: MealPlanDay = {
      date: currentDate.toISOString().split('T')[0],
      breakfast: createMockMeal('Breakfast'),
      lunch: createMockMeal('Lunch'),
      dinner: createMockMeal('Dinner'),
      snacks: [createMockMeal('Snack')],
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
    };
    
    // Calculate totals
    day.totalCalories = day.breakfast.calories + day.lunch.calories + day.dinner.calories + 
      day.snacks.reduce((sum, snack) => sum + snack.calories, 0);
      
    day.totalProtein = day.breakfast.protein + day.lunch.protein + day.dinner.protein + 
      day.snacks.reduce((sum, snack) => sum + snack.protein, 0);
      
    day.totalCarbs = day.breakfast.carbs + day.lunch.carbs + day.dinner.carbs + 
      day.snacks.reduce((sum, snack) => sum + snack.carbs, 0);
      
    day.totalFat = day.breakfast.fat + day.lunch.fat + day.dinner.fat + 
      day.snacks.reduce((sum, snack) => sum + snack.fat, 0);
    
    days.push(day);
  }
  
  return {
    userId,
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    days,
  };
};

export const updateInventory = async (
  restaurantId: string,
  updates: Record<string, InventoryUpdate>
): Promise<void> => {
  // In a real implementation, this would update inventory in a database
  console.log(`Updating inventory for restaurant ${restaurantId}`);
  console.log('Updates:', updates);
  
  // This would interact with a database in a real implementation
};

export const getInventoryAnalytics = async (
  restaurantId: string,
  startDate: Date,
  endDate: Date
): Promise<InventoryAnalytics> => {
  // In a real implementation, this would query inventory data
  // For now, return mock data
  
  // Generate mock usage trends
  const usageTrends: Array<{ date: string; itemsUsed: number; value: number }> = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    usageTrends.push({
      date: currentDate.toISOString().split('T')[0],
      itemsUsed: Math.floor(Math.random() * 50) + 10,
      value: Math.floor(Math.random() * 500) + 100,
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Mock analytics data
  return {
    totalItems: 250,
    totalValue: 12500,
    lowStockItems: [
      createMockInventoryItem('Tomatoes', 5),
      createMockInventoryItem('Chicken Breast', 8),
      createMockInventoryItem('Lettuce', 3),
    ],
    itemsByCategory: {
      'Vegetables': { count: 45, value: 1800 },
      'Meat': { count: 30, value: 4500 },
      'Dairy': { count: 15, value: 900 },
      'Grains': { count: 20, value: 600 },
      'Beverages': { count: 40, value: 2000 },
    },
    usageTrends,
  };
};

// Helper functions for creating mock data
function createMockMeal(type: string): MealPlanItem {
  const id = Math.random().toString(36).substring(2, 10);
  
  // Adjust nutritional values based on meal type
  let calories, protein, carbs, fat;
  
  switch (type) {
    case 'Breakfast':
      calories = Math.floor(Math.random() * 200) + 300;
      protein = Math.floor(Math.random() * 10) + 10;
      carbs = Math.floor(Math.random() * 20) + 30;
      fat = Math.floor(Math.random() * 5) + 10;
      break;
    case 'Lunch':
      calories = Math.floor(Math.random() * 300) + 500;
      protein = Math.floor(Math.random() * 15) + 25;
      carbs = Math.floor(Math.random() * 25) + 40;
      fat = Math.floor(Math.random() * 10) + 15;
      break;
    case 'Dinner':
      calories = Math.floor(Math.random() * 400) + 600;
      protein = Math.floor(Math.random() * 20) + 30;
      carbs = Math.floor(Math.random() * 30) + 45;
      fat = Math.floor(Math.random() * 15) + 20;
      break;
    default: // Snack
      calories = Math.floor(Math.random() * 100) + 150;
      protein = Math.floor(Math.random() * 5) + 5;
      carbs = Math.floor(Math.random() * 10) + 15;
      fat = Math.floor(Math.random() * 3) + 5;
  }
  
  return {
    id,
    restaurantId: 'rest-' + Math.random().toString(36).substring(2, 6),
    name: `${type} Item ${id.substring(0, 4)}`,
    description: `Delicious ${type.toLowerCase()} option that fits your dietary preferences.`,
    price: Math.floor(Math.random() * 10) + 5,
    calories,
    protein,
    carbs,
    fat,
    ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'],
    image: `https://picsum.photos/seed/${id}/300/200`,
  };
}

function createMockInventoryItem(name: string, quantity: number): InventoryItem {
  return {
    id: Math.random().toString(36).substring(2, 10),
    name,
    quantity,
    unit: quantity < 10 ? 'kg' : 'units',
    costPerUnit: Math.floor(Math.random() * 10) + 2,
    category: ['Vegetables', 'Meat', 'Dairy', 'Grains', 'Beverages'][Math.floor(Math.random() * 5)],
  };
}
