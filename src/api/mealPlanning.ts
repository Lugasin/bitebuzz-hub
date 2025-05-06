
import express from 'express';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { z } from 'zod';
import { 
  mealPlanningService,
  DietPreference 
} from '../services/mealPlanningService';

const router = express.Router();

// Schema for generating a meal plan
const mealPlanSchema = z.object({
  body: z.object({
    dietPreference: z.object({
      type: z.string(),
      restrictions: z.array(z.string()).optional().default([]),
      allergies: z.array(z.string()).optional().default([]),
      preferredCuisines: z.array(z.string()).optional().default([]),
      calorieTarget: z.number().optional().default(2000),
      proteinTarget: z.number().optional().default(50),
      carbTarget: z.number().optional().default(250),
      fatTarget: z.number().optional().default(70)
    }),
    duration: z.number().min(1).max(30)
  })
});

// Generate a meal plan
router.post(
  '/meal-plan',
  authenticate,
  validateRequest(mealPlanSchema),
  async (req, res) => {
    try {
      const { dietPreference, duration } = req.body;
      const userId = req.user.id;

      const mealPlan = await mealPlanningService.generateMealPlan(
        userId,
        dietPreference as DietPreference,
        duration
      );

      return res.status(200).json(mealPlan);
    } catch (error) {
      console.error('Error generating meal plan:', error);
      return res.status(500).json({
        message: 'Failed to generate meal plan'
      });
    }
  }
);

// Get current meal plan
router.get(
  '/meal-plan',
  authenticate,
  async (req, res) => {
    try {
      const userId = req.user.id;

      const mealPlan = await mealPlanningService.getMealPlan(userId);

      if (!mealPlan) {
        return res.status(404).json({
          message: 'No meal plan found'
        });
      }

      return res.status(200).json(mealPlan);
    } catch (error) {
      console.error('Error fetching meal plan:', error);
      return res.status(500).json({
        message: 'Failed to fetch meal plan'
      });
    }
  }
);

export default router;
