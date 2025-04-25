import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { z } from 'zod';
import {
  generateMealPlan,
  updateInventory,
  getInventoryAnalytics,
  DietPreference
} from '../services/mealPlanningService';

const router = Router();

// Validation schemas
const dietPreferenceSchema = z.object({
  type: z.enum(['VEGETARIAN', 'VEGAN', 'KETO', 'PALEO', 'GLUTEN_FREE', 'DAIRY_FREE', 'CUSTOM']),
  restrictions: z.array(z.string()),
  allergies: z.array(z.string()),
  preferredCuisines: z.array(z.string()),
  calorieTarget: z.number().min(0),
  proteinTarget: z.number().min(0),
  carbTarget: z.number().min(0),
  fatTarget: z.number().min(0)
});

const generateMealPlanSchema = z.object({
  body: z.object({
    dietPreference: dietPreferenceSchema,
    duration: z.number().min(1).max(30) // Max 30 days
  })
});

const updateInventorySchema = z.object({
  body: z.object({
    updates: z.record(z.string(), z.object({
      quantity: z.number().min(0),
      action: z.enum(['ADD', 'REMOVE'])
    }))
  })
});

const inventoryAnalyticsSchema = z.object({
  query: z.object({
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
  })
});

// Generate meal plan
router.post(
  '/meal-plan',
  authenticate,
  validateRequest(generateMealPlanSchema),
  async (req, res) => {
    try {
      const mealPlan = await generateMealPlan(
        req.user.id,
        req.body.dietPreference,
        req.body.duration
      );
      res.json(mealPlan);
    } catch (error) {
      console.error('Generate meal plan error:', error);
      res.status(500).json({ error: 'Failed to generate meal plan' });
    }
  }
);

// Update inventory
router.post(
  '/inventory',
  authenticate,
  validateRequest(updateInventorySchema),
  async (req, res) => {
    try {
      if (req.user.role !== 'RESTAURANT_AGENT' && req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Unauthorized to update inventory' });
      }

      await updateInventory(req.user.restaurantId, req.body.updates);
      res.json({ message: 'Inventory updated successfully' });
    } catch (error) {
      console.error('Update inventory error:', error);
      res.status(500).json({ error: 'Failed to update inventory' });
    }
  }
);

// Get inventory analytics
router.get(
  '/inventory/analytics',
  authenticate,
  validateRequest(inventoryAnalyticsSchema),
  async (req, res) => {
    try {
      if (req.user.role !== 'RESTAURANT_AGENT' && req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Unauthorized to view inventory analytics' });
      }

      const analytics = await getInventoryAnalytics(
        req.user.restaurantId,
        new Date(req.query.startDate as string),
        new Date(req.query.endDate as string)
      );
      res.json(analytics);
    } catch (error) {
      console.error('Get inventory analytics error:', error);
      res.status(500).json({ error: 'Failed to fetch inventory analytics' });
    }
  }
);

export default router; 