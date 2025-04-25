import React, { useState } from 'react';
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Utensils, 
  Clock, 
  Wallet, 
  Heart, 
  Info, 
  CalendarDays, 
  ShoppingBag, 
  ChevronDown, 
  ChevronUp,
  Plus 
} from "lucide-react";
import { popularZambianDishes, formatZambianCurrency } from "@/utils/zambianCuisine";
import { useCart } from "@/context/CartContext";

const dietaryPreferences = [
  { id: "regular", label: "Regular", description: "Standard Zambian diet with all food groups" },
  { id: "vegetarian", label: "Vegetarian", description: "Excludes meat but includes dairy and eggs" },
  { id: "protein-rich", label: "Protein-Rich", description: "Extra protein for active lifestyles" },
  { id: "budget", label: "Budget-friendly", description: "Affordable meal options" },
  { id: "low-carb", label: "Low Carb", description: "Reduced carbohydrate options" }
];

// Predefined meal plans
const mealPlans = {
  regular: [
    {
      day: "Monday",
      meals: [
        { type: "Breakfast", name: "Maize porridge with groundnuts", price: 25 },
        { type: "Lunch", name: "Nshima with chicken stew", price: 75 },
        { type: "Dinner", name: "Rice with beef stew", price: 85 }
      ]
    },
    {
      day: "Tuesday",
      meals: [
        { type: "Breakfast", name: "Vitumbuwa (Zambian pancakes)", price: 20 },
        { type: "Lunch", name: "Nshima with kapenta", price: 60 },
        { type: "Dinner", name: "Nshima with village chicken", price: 85 }
      ]
    },
    {
      day: "Wednesday",
      meals: [
        { type: "Breakfast", name: "Bread with eggs", price: 35 },
        { type: "Lunch", name: "Nshima with caterpillars (Mopane worms)", price: 70 },
        { type: "Dinner", name: "Nshima with game meat", price: 90 }
      ]
    }
  ],
  vegetarian: [
    {
      day: "Monday",
      meals: [
        { type: "Breakfast", name: "Maize porridge with groundnuts", price: 25 },
        { type: "Lunch", name: "Nshima with ifisashi", price: 55 },
        { type: "Dinner", name: "Sweet potato with beans", price: 50 }
      ]
    },
    {
      day: "Tuesday",
      meals: [
        { type: "Breakfast", name: "Vitumbuwa with honey", price: 25 },
        { type: "Lunch", name: "Nshima with chikanda", price: 45 },
        { type: "Dinner", name: "Rice with mixed vegetables", price: 60 }
      ]
    },
    {
      day: "Wednesday",
      meals: [
        { type: "Breakfast", name: "Fruits and yogurt", price: 40 },
        { type: "Lunch", name: "Nshima with mushroom sauce", price: 55 },
        { type: "Dinner", name: "Pumpkin leaves with groundnuts", price: 50 }
      ]
    }
  ],
  "protein-rich": [
    {
      day: "Monday",
      meals: [
        { type: "Breakfast", name: "Eggs with sausage", price: 45 },
        { type: "Lunch", name: "Nshima with chicken and beans", price: 85 },
        { type: "Dinner", name: "Grilled fish with vegetables", price: 95 }
      ]
    },
    {
      day: "Tuesday",
      meals: [
        { type: "Breakfast", name: "Protein smoothie with nuts", price: 50 },
        { type: "Lunch", name: "Nshima with beef and groundnuts", price: 90 },
        { type: "Dinner", name: "Roast chicken with rice", price: 95 }
      ]
    },
    {
      day: "Wednesday",
      meals: [
        { type: "Breakfast", name: "Yogurt with seeds and fruits", price: 55 },
        { type: "Lunch", name: "Nshima with game meat", price: 90 },
        { type: "Dinner", name: "Tilapia with sweet potatoes", price: 100 }
      ]
    }
  ],
  budget: [
    {
      day: "Monday",
      meals: [
        { type: "Breakfast", name: "Maize porridge plain", price: 15 },
        { type: "Lunch", name: "Nshima with beans", price: 40 },
        { type: "Dinner", name: "Rice with vegetables", price: 45 }
      ]
    },
    {
      day: "Tuesday",
      meals: [
        { type: "Breakfast", name: "Vitumbuwa (2 pieces)", price: 15 },
        { type: "Lunch", name: "Nshima with small kapenta", price: 45 },
        { type: "Dinner", name: "Sweet potato with groundnuts", price: 40 }
      ]
    },
    {
      day: "Wednesday",
      meals: [
        { type: "Breakfast", name: "Tea with bread", price: 20 },
        { type: "Lunch", name: "Nshima with vegetables", price: 35 },
        { type: "Dinner", name: "Maize with beans", price: 40 }
      ]
    }
  ],
  "low-carb": [
    {
      day: "Monday",
      meals: [
        { type: "Breakfast", name: "Eggs and spinach", price: 45 },
        { type: "Lunch", name: "Grilled chicken with vegetables", price: 80 },
        { type: "Dinner", name: "Fish and mixed greens", price: 85 }
      ]
    },
    {
      day: "Tuesday",
      meals: [
        { type: "Breakfast", name: "Yogurt with berries", price: 50 },
        { type: "Lunch", name: "Beef and vegetable stir-fry", price: 85 },
        { type: "Dinner", name: "Grilled fish with okra", price: 90 }
      ]
    },
    {
      day: "Wednesday",
      meals: [
        { type: "Breakfast", name: "Avocado and eggs", price: 55 },
        { type: "Lunch", name: "Chicken salad with nuts", price: 75 },
        { type: "Dinner", name: "Beef stew with vegetables (no nshima)", price: 85 }
      ]
    }
  ]
};

const MealPlanningModule = () => {
  const [selectedDiet, setSelectedDiet] = useState("regular");
  const [budgetRange, setBudgetRange] = useState([150, 300]); // Daily budget in Kwacha
  const [expandedDays, setExpandedDays] = useState(["Monday"]);
  const { addItem } = useCart();

  const toggleDayExpansion = (day) => {
    setExpandedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day) 
        : [...prev, day]
    );
  };

  // Calculate total for a day's meals
  const calculateDayTotal = (day) => {
    return mealPlans[selectedDiet]
      .find(d => d.day === day)?.meals
      .reduce((sum, meal) => sum + meal.price, 0) || 0;
  };

  // Calculate total for the entire meal plan
  const calculatePlanTotal = () => {
    return mealPlans[selectedDiet].reduce((sum, day) => {
      const dayTotal = day.meals.reduce((mealSum, meal) => mealSum + meal.price, 0);
      return sum + dayTotal;
    }, 0);
  };

  // Add a single meal to cart
  const addMealToCart = (meal, day) => {
    addItem({
      id: `meal-${day}-${meal.type}-${Date.now()}`,
      name: `${meal.name} (${meal.type}, ${day})`,
      price: meal.price,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1574484284002-952d92456975?ixlib=rb-4.0.3&auto=format&fit=crop&q=80",
      vendorId: "zm-meal-plan",
      restaurantName: "Meal Plan"
    });
  };

  // Add all meals for a day to cart
  const addDayToCart = (day) => {
    const dayMeals = mealPlans[selectedDiet].find(d => d.day === day)?.meals || [];
    
    dayMeals.forEach(meal => {
      addMealToCart(meal, day);
    });
  };

  // Add entire meal plan to cart
  const addPlanToCart = () => {
    mealPlans[selectedDiet].forEach(day => {
      day.meals.forEach(meal => {
        addMealToCart(meal, day.day);
      });
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5 text-primary" />
            Meal Planning
          </CardTitle>
          <CardDescription>
            Plan your meals for the week based on your dietary preferences and budget
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Select Dietary Preference:</h3>
              <div className="flex flex-wrap gap-2">
                {dietaryPreferences.map(diet => (
                  <Badge 
                    key={diet.id}
                    variant={selectedDiet === diet.id ? "default" : "outline"}
                    className="cursor-pointer px-3 py-1"
                    onClick={() => setSelectedDiet(diet.id)}
                  >
                    {diet.label}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {dietaryPreferences.find(d => d.id === selectedDiet)?.description}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Daily Budget Range:</h3>
              <div className="px-2">
                <Slider 
                  defaultValue={budgetRange} 
                  max={500} 
                  min={50} 
                  step={10}
                  onValueChange={setBudgetRange}
                />
              </div>
              <div className="flex justify-between mt-1 text-sm text-muted-foreground">
                <span>{formatZambianCurrency(budgetRange[0])}</span>
                <span>{formatZambianCurrency(budgetRange[1])}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          Your Meal Plan
        </h2>
        <Button onClick={addPlanToCart} className="gap-2">
          <ShoppingBag className="h-4 w-4" />
          Add Entire Plan to Cart
        </Button>
      </div>

      <div className="space-y-4">
        {mealPlans[selectedDiet].map((day) => {
          const dayTotal = calculateDayTotal(day.day);
          const isInBudget = dayTotal >= budgetRange[0] && dayTotal <= budgetRange[1];
          const isExpanded = expandedDays.includes(day.day);
          
          return (
            <Card 
              key={day.day} 
              className={`overflow-hidden transition-all ${isInBudget ? '' : 'border-muted'}`}
            >
              <div 
                className={`flex items-center justify-between p-4 cursor-pointer ${isInBudget ? 'bg-background' : 'bg-muted/30'}`}
                onClick={() => toggleDayExpansion(day.day)}
              >
                <div className="flex items-center gap-3">
                  <div className="font-semibold">{day.day}</div>
                  {!isInBudget && (
                    <Badge variant="outline" className="text-amber-600 border-amber-600 bg-amber-50 dark:bg-amber-950/30">
                      Outside Budget
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="font-medium">
                    {formatZambianCurrency(dayTotal)}
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0" 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDayExpansion(day.day);
                    }}
                  >
                    {isExpanded ? <ChevronUp /> : <ChevronDown />}
                  </Button>
                </div>
              </div>

              {isExpanded && (
                <div className="p-4 border-t">
                  <div className="space-y-3">
                    {day.meals.map((meal, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
                      >
                        <div>
                          <div className="font-medium">{meal.name}</div>
                          <div className="text-sm text-muted-foreground">{meal.type}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="font-medium">{formatZambianCurrency(meal.price)}</div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => addMealToCart(meal, day.day)}
                          >
                            <Plus className="h-4 w-4 mr-1" /> Add
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addDayToCart(day.day);
                      }}
                    >
                      Add All {day.day} Meals
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <div className="mt-8 bg-muted/20 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold">Total for 3-Day Plan:</div>
          <div className="text-lg font-bold">{formatZambianCurrency(calculatePlanTotal())}</div>
        </div>
        <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
          <Info className="h-4 w-4" />
          You can extend this plan to a full week in your account settings
        </p>
      </div>
    </div>
  );
};

export default MealPlanningModule;