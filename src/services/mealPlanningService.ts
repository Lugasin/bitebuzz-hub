import { db } from '../config/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, Timestamp, orderBy } from 'firebase/firestore';

export interface DietPreference {
  type: 'VEGETARIAN' | 'VEGAN' | 'KETO' | 'PALEO' | 'GLUTEN_FREE' | 'DAIRY_FREE' | 'CUSTOM';
  restrictions: string[];
  allergies: string[];
  preferredCuisines: string[];
  calorieTarget: number;
  proteinTarget: number;
  carbTarget: number;
  fatTarget: number;
}

export interface MealPlan {
  id?: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  dietPreference: DietPreference;
  meals: {
    [day: string]: {
      breakfast: Meal;
      lunch: Meal;
      dinner: Meal;
      snacks: Meal[];
    };
  };
  totalCalories: number;
  totalCost: number;
  ingredients: {
    [ingredientId: string]: {
      quantity: number;
      unit: string;
      cost: number;
    };
  };
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  ingredients: {
    id: string;
    quantity: number;
    unit: string;
  }[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  preparationTime: number;
  cookingTime: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  tags: string[];
}

export interface InventoryItem {
  id?: string;
  restaurantId: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minQuantity: number;
  maxQuantity: number;
  cost: number;
  supplier: string;
  lastRestocked: Date;
  nextRestockDate: Date;
  shelfLife: number; // in days
}

export const generateMealPlan = async (
  userId: string,
  dietPreference: DietPreference,
  duration: number // in days
): Promise<MealPlan> => {
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + duration);

  // Get available meals based on diet preferences
  const mealsQuery = query(
    collection(db, 'meals'),
    where('tags', 'array-contains-any', dietPreference.preferredCuisines)
  );
  const mealsSnapshot = await getDocs(mealsQuery);
  const availableMeals = mealsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Meal));

  // Filter meals based on restrictions and allergies
  const filteredMeals = availableMeals.filter(meal => {
    const ingredients = meal.ingredients.map(i => i.id);
    return !dietPreference.restrictions.some(r => ingredients.includes(r)) &&
           !dietPreference.allergies.some(a => ingredients.includes(a));
  });

  // Generate meal plan
  const mealPlan: MealPlan = {
    userId,
    startDate,
    endDate,
    dietPreference,
    meals: {},
    totalCalories: 0,
    totalCost: 0,
    ingredients: {}
  };

  // Generate meals for each day
  for (let i = 0; i < duration; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dayKey = date.toISOString().split('T')[0];

    // Select random meals that meet nutritional requirements
    const breakfast = selectMeal(filteredMeals, 'breakfast', dietPreference);
    const lunch = selectMeal(filteredMeals, 'lunch', dietPreference);
    const dinner = selectMeal(filteredMeals, 'dinner', dietPreference);
    const snacks = [
      selectMeal(filteredMeals, 'snack', dietPreference),
      selectMeal(filteredMeals, 'snack', dietPreference)
    ];

    mealPlan.meals[dayKey] = { breakfast, lunch, dinner, snacks };

    // Update nutritional totals
    mealPlan.totalCalories += breakfast.calories + lunch.calories + dinner.calories +
      snacks.reduce((sum, snack) => sum + snack.calories, 0);

    // Update ingredient quantities and costs
    updateIngredientQuantities(mealPlan, breakfast, lunch, dinner, snacks);
  }

  return mealPlan;
};

const selectMeal = (
  meals: Meal[],
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack',
  dietPreference: DietPreference
): Meal => {
  const filtered = meals.filter(meal => meal.tags.includes(type));
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
};

const updateIngredientQuantities = (
  mealPlan: MealPlan,
  breakfast: Meal,
  lunch: Meal,
  dinner: Meal,
  snacks: Meal[]
) => {
  const allMeals = [breakfast, lunch, dinner, ...snacks];
  
  allMeals.forEach(meal => {
    meal.ingredients.forEach(ingredient => {
      if (!mealPlan.ingredients[ingredient.id]) {
        mealPlan.ingredients[ingredient.id] = {
          quantity: 0,
          unit: ingredient.unit,
          cost: 0 // This should be fetched from inventory
        };
      }
      mealPlan.ingredients[ingredient.id].quantity += ingredient.quantity;
    });
  });
};

export const updateInventory = async (
  restaurantId: string,
  updates: {
    [ingredientId: string]: {
      quantity: number;
      action: 'ADD' | 'REMOVE';
    };
  }
): Promise<void> => {
  const inventoryRef = collection(db, 'inventory');
  
  for (const [ingredientId, update] of Object.entries(updates)) {
    const itemRef = doc(inventoryRef, ingredientId);
    const item = await getDocs(itemRef);
    
    if (item.exists()) {
      const currentQuantity = item.data().quantity;
      const newQuantity = update.action === 'ADD' 
        ? currentQuantity + update.quantity 
        : currentQuantity - update.quantity;

      if (newQuantity < 0) {
        throw new Error(`Insufficient inventory for ${ingredientId}`);
      }

      await updateDoc(itemRef, {
        quantity: newQuantity,
        lastRestocked: new Date()
      });

      // Check if restock is needed
      if (newQuantity <= item.data().minQuantity) {
        await createRestockNotification(restaurantId, ingredientId);
      }
    }
  }
};

const createRestockNotification = async (
  restaurantId: string,
  ingredientId: string
): Promise<void> => {
  const notificationsRef = collection(db, 'notifications');
  await addDoc(notificationsRef, {
    type: 'INVENTORY_LOW',
    restaurantId,
    ingredientId,
    createdAt: new Date(),
    status: 'PENDING'
  });
};

export const getInventoryAnalytics = async (
  restaurantId: string,
  startDate: Date,
  endDate: Date
): Promise<{
  lowStockItems: InventoryItem[];
  expiringSoon: InventoryItem[];
  usageTrends: {
    [ingredientId: string]: {
      dailyUsage: number;
      peakHours: number[];
    };
  };
}> => {
  const inventoryQuery = query(
    collection(db, 'inventory'),
    where('restaurantId', '==', restaurantId)
  );
  const inventorySnapshot = await getDocs(inventoryQuery);
  const inventory = inventorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InventoryItem));

  // Get low stock items
  const lowStockItems = inventory.filter(item => 
    item.quantity <= item.minQuantity
  );

  // Get items expiring soon
  const expiringSoon = inventory.filter(item => {
    const daysUntilExpiry = (item.nextRestockDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
    return daysUntilExpiry <= 7; // Items expiring in 7 days or less
  });

  // Get usage trends
  const ordersQuery = query(
    collection(db, 'orders'),
    where('restaurantId', '==', restaurantId),
    where('createdAt', '>=', startDate),
    where('createdAt', '<=', endDate)
  );
  const ordersSnapshot = await getDocs(ordersQuery);
  const orders = ordersSnapshot.docs.map(doc => doc.data());

  const usageTrends: { [key: string]: { dailyUsage: number; peakHours: number[] } } = {};
  
  orders.forEach(order => {
    order.items.forEach((item: any) => {
      if (!usageTrends[item.ingredientId]) {
        usageTrends[item.ingredientId] = {
          dailyUsage: 0,
          peakHours: []
        };
      }
      usageTrends[item.ingredientId].dailyUsage += item.quantity;
      
      const hour = new Date(order.createdAt).getHours();
      if (!usageTrends[item.ingredientId].peakHours.includes(hour)) {
        usageTrends[item.ingredientId].peakHours.push(hour);
      }
    });
  });

  return {
    lowStockItems,
    expiringSoon,
    usageTrends
  };
}; 