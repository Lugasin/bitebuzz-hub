
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '../services/api';

// Define types properly
interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

interface Meal {
  id: string;
  name: string;
  imageUrl: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: Ingredient[];
}

interface DietPreference {
  type: string;
  restrictions: string[];
  allergies: string[];
  preferredCuisines: string[];
  calorieTarget: number;
  proteinTarget: number;
  carbTarget: number;
  fatTarget: number;
}

interface MealPlanData {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  meals: Meal[];
}

interface MealPlanProps {
  initialDietPreference?: DietPreference;
  onMealPlanGenerated?: (mealPlan: MealPlanData) => void;
}

const MealPlan: React.FC<MealPlanProps> = ({ initialDietPreference, onMealPlanGenerated }) => {
  const [mealPlan, setMealPlan] = useState<MealPlanData | null>(null);
  const [loading, setLoading] = useState(false);
  const [dietPreference, setDietPreference] = useState<DietPreference>(
    initialDietPreference || {
      type: 'CUSTOM',
      restrictions: [],
      allergies: [],
      preferredCuisines: [],
      calorieTarget: 2000,
      proteinTarget: 50,
      carbTarget: 250,
      fatTarget: 70
    }
  );
  const { user } = useAuth();
  const { toast } = useToast();

  const generateMealPlan = async (duration: number) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to generate a meal plan",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/meal-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          dietPreference,
          duration
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate meal plan');
      }

      const data = await response.json();
      setMealPlan(data);
      if (onMealPlanGenerated) {
        onMealPlanGenerated(data);
      }
      
      toast({
        title: "Success",
        description: "Meal plan generated successfully",
      });
    } catch (error) {
      console.error('Error generating meal plan:', error);
      toast({
        title: "Error",
        description: "Failed to generate meal plan",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (mealId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add items to cart",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          mealId,
          quantity: 1
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      toast({
        title: "Success",
        description: "Added to cart successfully",
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add to cart",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Meal Plan</h1>
      
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Diet Preferences</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="font-medium">Diet Type:</span>
            <Badge className="ml-2">{dietPreference.type}</Badge>
          </div>
          <div>
            <span className="font-medium">Calorie Target:</span>
            <span className="ml-2">{dietPreference.calorieTarget} kcal</span>
          </div>
          <div>
            <span className="font-medium">Macros:</span>
            <span className="ml-2">P: {dietPreference.proteinTarget}g C: {dietPreference.carbTarget}g F: {dietPreference.fatTarget}g</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <Button 
          onClick={() => generateMealPlan(7)}
          disabled={loading}
        >
          Generate 7-Day Plan
        </Button>
        <Button 
          onClick={() => generateMealPlan(14)}
          disabled={loading}
        >
          Generate 14-Day Plan
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p>Generating your personalized meal plan...</p>
        </div>
      ) : mealPlan ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mealPlan.meals.map((meal: Meal, index: number) => (
            <Card key={index} className="overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img 
                  src={meal.imageUrl} 
                  alt={meal.name}
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{meal.name}</h3>
                
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium">Calories:</span>
                    <span>{meal.calories} kcal</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium">Macros:</span>
                    <span>P: {meal.protein}g C: {meal.carbs}g F: {meal.fat}g</span>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-medium mb-1">Ingredients:</h4>
                    <ul className="text-sm">
                      {meal.ingredients.map((ingredient: Ingredient, i: number) => (
                        <li key={i} className="flex justify-between">
                          <span>{ingredient.name}:</span>
                          <span>{ingredient.quantity} {ingredient.unit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <Button 
                  onClick={() => addToCart(meal.id)}
                  className="w-full mt-4"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-500">No meal plan generated yet. Click the buttons above to create one!</p>
        </div>
      )}
    </div>
  );
};

export default MealPlan;
