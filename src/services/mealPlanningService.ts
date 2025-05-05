
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
  name: string;
  quantity: number;
  unit: string;
}

export interface MealItem {
  id: string;
  name: string;
  description?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: MealIngredient[];
}

export interface MealPlan {
  id: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  meals: MealItem[];
}

export const generateMealPlan = async (
  preferences: DietPreference,
  duration: number
): Promise<MealPlan> => {
  // In a real implementation, this would make API calls or use an algorithm
  // to generate a meal plan based on the user's preferences
  const mockMeals: MealItem[] = [
    {
      id: '1',
      name: 'Grilled Chicken Salad',
      description: 'Fresh greens with grilled chicken breast',
      calories: 350,
      protein: 30,
      carbs: 20,
      fat: 15,
      ingredients: [
        { name: 'Chicken Breast', quantity: 150, unit: 'g' },
        { name: 'Mixed Greens', quantity: 100, unit: 'g' },
        { name: 'Olive Oil', quantity: 10, unit: 'ml' },
      ],
    },
    // Add more mock meals as needed
  ];

  return {
    id: 'plan-1',
    userId: 'user-1',
    startDate: new Date(),
    endDate: new Date(Date.now() + duration * 24 * 60 * 60 * 1000),
    meals: mockMeals,
  };
};
