import { Router } from 'express';
import { getAnalytics } from '../services/analyticsService';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { z } from 'zod';

const router = Router();

const analyticsSchema = z.object({
  query: z.object({
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    restaurantId: z.string().optional()
  })
});

router.get(
  '/',
  authenticate,
  validateRequest(analyticsSchema),
  async (req, res) => {
    try {
      const { startDate, endDate, restaurantId } = req.query;
      
      // Check if user has permission to view analytics
      if (req.user.role === 'RESTAURANT_AGENT' && req.user.restaurantId !== restaurantId) {
        return res.status(403).json({ error: 'Unauthorized access to restaurant analytics' });
      }

      const analytics = await getAnalytics({
        startDate: startDate as string,
        endDate: endDate as string,
        restaurantId: restaurantId as string
      });

      res.json(analytics);
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({ error: 'Failed to fetch analytics data' });
    }
  }
);

export default router; 