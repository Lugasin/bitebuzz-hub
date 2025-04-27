import express from 'express';
import commissionService from '../services/commissionService.js';
import { authenticateUser, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Get all commission rules
router.get('/', authenticateUser, authorizeRole('admin'), async (req, res) => {
  try {
    const rules = await commissionService.getAllRules();
    res.json(rules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get active commission rule
router.get('/active', authenticateUser, async (req, res) => {
  try {
    const rule = await commissionService.getActiveRule();
    res.json(rule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new commission rule
router.post('/', authenticateUser, authorizeRole('admin'), async (req, res) => {
  try {
    const rule = await commissionService.createRule(req.body, req.user.id);
    res.status(201).json(rule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update commission rule
router.put('/:ruleId', authenticateUser, authorizeRole('admin'), async (req, res) => {
  try {
    const rule = await commissionService.updateRule(req.params.ruleId, req.body, req.user.id);
    res.json(rule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete commission rule
router.delete('/:ruleId', authenticateUser, authorizeRole('admin'), async (req, res) => {
  try {
    await commissionService.deleteRule(req.params.ruleId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Calculate commission for an order
router.post('/calculate', authenticateUser, async (req, res) => {
  try {
    const { orderAmount, restaurantId } = req.body;
    const result = await commissionService.calculateCommission(orderAmount, restaurantId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 