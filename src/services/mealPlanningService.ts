
// Define the meal planning service types and functions

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: Ingredient[];
  preparationTime: number;
  cuisineType: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface DietPreference {
  type: string;
  restrictions: string[];
  allergies: string[];
  preferredCuisines: string[];
  calorieTarget: number;
  proteinTarget: number;
  carbTarget: number;
  fatTarget: number;
}

export interface MealPlan {
  id: string;
  userId: string;
  dietPreference: DietPreference;
  startDate: string;
  endDate: string;
  meals: Meal[];
  createdAt: string;
  updatedAt: string;
}

export const mealPlanningService = {
  // Generate a meal plan based on user preferences and duration
  generateMealPlan: async (
    userId: string,
    dietPreference: DietPreference,
    duration: number
  ): Promise<MealPlan> => {
    // In a real app, this would call an API endpoint
    console.log(`Generating ${duration}-day meal plan for user ${userId}`);
    
    // Mock implementation
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + duration);
    
    const mockMeals: Meal[] = Array(duration * 3).fill(null).map((_, i) => ({
      id: `meal-${i}`,
      name: `Sample Meal ${i + 1}`,
      description: 'A delicious and nutritious meal',
      imageUrl: 'https://via.placeholder.com/300',
      calories: Math.floor(Math.random() * 300) + 200,
      protein: Math.floor(Math.random() * 20) + 10,
      carbs: Math.floor(Math.random() * 30) + 20,
      fat: Math.floor(Math.random() * 10) + 5,
      ingredients: [
        {
          id: `ingredient-${i}-1`,
          name: 'Ingredient 1',
          quantity: 100,
          unit: 'g',
          calories: 100,
          protein: 5,
          carbs: 10,
          fat: 2
        },
        {
          id: `ingredient-${i}-2`,
          name: 'Ingredient 2',
          quantity: 50,
          unit: 'g',
          calories: 80,
          protein: 4,
          carbs: 8,
          fat: 1
        }
      ],
      preparationTime: 30,
      cuisineType: 'mixed',
      mealType: i % 3 === 0 ? 'breakfast' : i % 3 === 1 ? 'lunch' : 'dinner'
    }));
    
    return {
      id: `plan-${Date.now()}`,
      userId,
      dietPreference,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      meals: mockMeals,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  
  // Get the current meal plan for a user
  getMealPlan: async (userId: string): Promise<MealPlan | null> => {
    // In a real app, this would fetch from an API
    console.log(`Fetching meal plan for user ${userId}`);
    
    // Mock implementation - return null to simulate no plan
    return null;
  }
};
