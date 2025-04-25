import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { z } from 'zod';
import {
  createSupportTicket,
  updateSupportTicket,
  addSupportMessage,
  getSupportTickets,
  getSupportMessages,
  assignSupportTicket,
  resolveSupportTicket,
  SupportTicket,
  SupportMessage
} from '../services/supportService';

const router = Router();

// Validation schemas
const createTicketSchema = z.object({
  body: z.object({
    subject: z.string().min(1).max(200),
    description: z.string().min(1).max(2000),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
    category: z.enum(['ORDER', 'PAYMENT', 'DELIVERY', 'ACCOUNT', 'OTHER']),
    orderId: z.string().optional(),
    restaurantId: z.string().optional(),
    attachments: z.array(z.string()).optional()
  })
});

const updateTicketSchema = z.object({
  params: z.object({
    ticketId: z.string()
  }),
  body: z.object({
    status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    assignedTo: z.string().optional(),
    resolution: z.string().optional()
  })
});

const messageSchema = z.object({
  params: z.object({
    ticketId: z.string()
  }),
  body: z.object({
    message: z.string().min(1).max(2000),
    attachments: z.array(z.string()).optional()
  })
});

// Create new support ticket
router.post(
  '/tickets',
  authenticate,
  validateRequest(createTicketSchema),
  async (req, res) => {
    try {
      const ticket = await createSupportTicket({
        ...req.body,
        userId: req.user.id,
        userEmail: req.user.email,
        userName: req.user.name
      });
      res.status(201).json(ticket);
    } catch (error) {
      console.error('Create ticket error:', error);
      res.status(500).json({ error: 'Failed to create support ticket' });
    }
  }
);

// Get support tickets with filters
router.get(
  '/tickets',
  authenticate,
  async (req, res) => {
    try {
      const filters: any = {};
      
      // Apply role-based filters
      if (req.user.role === 'CUSTOMER') {
        filters.userId = req.user.id;
      } else if (req.user.role === 'RESTAURANT_AGENT') {
        filters.restaurantId = req.user.restaurantId;
      } else if (req.user.role === 'SUPPORT_AGENT') {
        filters.assignedTo = req.user.id;
      }

      // Apply query filters
      if (req.query.status) filters.status = req.query.status;
      if (req.query.priority) filters.priority = req.query.priority;
      if (req.query.category) filters.category = req.query.category;

      const tickets = await getSupportTickets(filters);
      res.json(tickets);
    } catch (error) {
      console.error('Get tickets error:', error);
      res.status(500).json({ error: 'Failed to fetch support tickets' });
    }
  }
);

// Get ticket details and messages
router.get(
  '/tickets/:ticketId',
  authenticate,
  async (req, res) => {
    try {
      const ticket = (await getSupportTickets({ userId: req.user.id }))
        .find(t => t.id === req.params.ticketId);

      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }

      // Check access permissions
      if (req.user.role === 'CUSTOMER' && ticket.userId !== req.user.id) {
        return res.status(403).json({ error: 'Unauthorized access to ticket' });
      }
      if (req.user.role === 'RESTAURANT_AGENT' && ticket.restaurantId !== req.user.restaurantId) {
        return res.status(403).json({ error: 'Unauthorized access to ticket' });
      }

      const messages = await getSupportMessages(req.params.ticketId);
      res.json({ ticket, messages });
    } catch (error) {
      console.error('Get ticket error:', error);
      res.status(500).json({ error: 'Failed to fetch ticket details' });
    }
  }
);

// Add message to ticket
router.post(
  '/tickets/:ticketId/messages',
  authenticate,
  validateRequest(messageSchema),
  async (req, res) => {
    try {
      const message = await addSupportMessage({
        ...req.body,
        ticketId: req.params.ticketId,
        userId: req.user.id,
        userName: req.user.name,
        userRole: req.user.role
      });
      res.status(201).json(message);
    } catch (error) {
      console.error('Add message error:', error);
      res.status(500).json({ error: 'Failed to add message' });
    }
  }
);

// Assign ticket to support agent (Admin/Support Manager only)
router.post(
  '/tickets/:ticketId/assign',
  authenticate,
  async (req, res) => {
    try {
      if (!['ADMIN', 'SUPPORT_MANAGER'].includes(req.user.role)) {
        return res.status(403).json({ error: 'Unauthorized to assign tickets' });
      }

      await assignSupportTicket(
        req.params.ticketId,
        req.body.agentId,
        req.body.agentName
      );
      res.json({ message: 'Ticket assigned successfully' });
    } catch (error) {
      console.error('Assign ticket error:', error);
      res.status(500).json({ error: 'Failed to assign ticket' });
    }
  }
);

// Resolve ticket (Support Agent/Admin only)
router.post(
  '/tickets/:ticketId/resolve',
  authenticate,
  async (req, res) => {
    try {
      if (!['ADMIN', 'SUPPORT_AGENT'].includes(req.user.role)) {
        return res.status(403).json({ error: 'Unauthorized to resolve tickets' });
      }

      await resolveSupportTicket(req.params.ticketId, req.body.resolution);
      res.json({ message: 'Ticket resolved successfully' });
    } catch (error) {
      console.error('Resolve ticket error:', error);
      res.status(500).json({ error: 'Failed to resolve ticket' });
    }
  }
);

export default router; 