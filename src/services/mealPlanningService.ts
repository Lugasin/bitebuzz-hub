
// Meal planning service

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

export interface MealIngredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: MealIngredient[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  cuisine: string;
  dietType: string[];
  imageUrl: string;
}

export interface MealPlan {
  id: string;
  userId: string;
  startDate: string;
  endDate: string;
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface MealPlanningService {
  generateMealPlan: (userId: string, preferences: DietPreference, duration: number) => Promise<MealPlan>;
  getMealPlan: (userId: string) => Promise<MealPlan | null>;
  updateMealPlan: (userId: string, mealPlan: MealPlan) => Promise<MealPlan>;
  getRecommendedMeals: (userId: string, preferences: DietPreference) => Promise<Meal[]>;
  getMealById: (mealId: string) => Promise<Meal | null>;
  createCustomMeal: (userId: string, meal: Omit<Meal, 'id'>) => Promise<Meal>;
}

// Implementation of the service
export const mealPlanningService: MealPlanningService = {
  async generateMealPlan(userId, preferences, duration) {
    // Mock implementation
    console.log(`Generating meal plan for user ${userId} with duration ${duration}`);
    
    // In a real app, this would call a database or external API
    const meals: Meal[] = [
      {
        id: '1',
        name: 'Healthy Breakfast Bowl',
        description: 'Nutritious breakfast bowl with oats, fruits, and nuts',
        calories: 450,
        protein: 15,
        carbs: 65,
        fat: 12,
        ingredients: [
          { id: '1', name: 'Oats', quantity: 50, unit: 'g' },
          { id: '2', name: 'Banana', quantity: 1, unit: 'piece' },
          { id: '3', name: 'Blueberries', quantity: 30, unit: 'g' }
        ],
        instructions: ['Mix oats with water', 'Add fruits and nuts'],
        prepTime: 5,
        cookTime: 5,
        cuisine: 'International',
        dietType: ['Vegetarian'],
        imageUrl: 'https://example.com/breakfast-bowl.jpg'
      },
      {
        id: '2',
        name: 'Grilled Chicken Salad',
        description: 'Fresh salad with grilled chicken and vegetables',
        calories: 350,
        protein: 30,
        carbs: 15,
        fat: 18,
        ingredients: [
          { id: '4', name: 'Chicken breast', quantity: 150, unit: 'g' },
          { id: '5', name: 'Mixed greens', quantity: 100, unit: 'g' },
          { id: '6', name: 'Olive oil', quantity: 15, unit: 'ml' }
        ],
        instructions: ['Grill chicken', 'Mix with greens and dressing'],
        prepTime: 10,
        cookTime: 15,
        cuisine: 'Mediterranean',
        dietType: ['High Protein'],
        imageUrl: 'https://example.com/chicken-salad.jpg'
      }
    ];
    
    return {
      id: `plan-${userId}-${Date.now()}`,
      userId,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + duration * 86400000).toISOString(),
      meals,
      totalCalories: meals.reduce((sum, meal) => sum + meal.calories, 0),
      totalProtein: meals.reduce((sum, meal) => sum + meal.protein, 0),
      totalCarbs: meals.reduce((sum, meal) => sum + meal.carbs, 0),
      totalFat: meals.reduce((sum, meal) => sum + meal.fat, 0)
    };
  },
  
  async getMealPlan(userId) {
    console.log(`Getting meal plan for user ${userId}`);
    // Mock implementation
    return null;
  },
  
  async updateMealPlan(userId, mealPlan) {
    console.log(`Updating meal plan for user ${userId}`);
    // Mock implementation
    return mealPlan;
  },
  
  async getRecommendedMeals(userId, preferences) {
    console.log(`Getting recommended meals for user ${userId}`);
    // Mock implementation
    return [];
  },
  
  async getMealById(mealId) {
    console.log(`Getting meal by ID ${mealId}`);
    // Mock implementation
    return null;
  },
  
  async createCustomMeal(userId, meal) {
    console.log(`Creating custom meal for user ${userId}`);
    // Mock implementation
    return {
      ...meal,
      id: `meal-${Date.now()}`
    };
  }
};

export default mealPlanningService;
