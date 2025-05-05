
// Support Service for handling support tickets and customer service

export interface SupportTicket {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  subject: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category: 'ORDER' | 'PAYMENT' | 'DELIVERY' | 'ACCOUNT' | 'OTHER';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  assignedName?: string;
  orderId?: string;
  restaurantId?: string;
  resolution?: string;
  attachments?: string[];
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  userRole: string;
  message: string;
  createdAt: string;
  attachments?: string[];
}

// In-memory storage for demo purposes
const tickets: SupportTicket[] = [];
const messages: SupportMessage[] = [];

export interface CreateTicketData {
  userId: string;
  userEmail: string;
  userName: string;
  subject: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category: 'ORDER' | 'PAYMENT' | 'DELIVERY' | 'ACCOUNT' | 'OTHER';
  orderId?: string;
  restaurantId?: string;
  attachments?: string[];
}

export async function createSupportTicket(data: CreateTicketData): Promise<SupportTicket> {
  const now = new Date().toISOString();
  
  const ticket: SupportTicket = {
    id: `ticket-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    userId: data.userId,
    userEmail: data.userEmail,
    userName: data.userName,
    subject: data.subject,
    description: data.description,
    status: 'OPEN',
    priority: data.priority,
    category: data.category,
    createdAt: now,
    updatedAt: now,
    orderId: data.orderId,
    restaurantId: data.restaurantId,
    attachments: data.attachments,
  };
  
  tickets.push(ticket);
  return ticket;
}

export async function updateSupportTicket(
  ticketId: string,
  updates: Partial<SupportTicket>
): Promise<SupportTicket | null> {
  const ticketIndex = tickets.findIndex(t => t.id === ticketId);
  
  if (ticketIndex === -1) {
    return null;
  }
  
  const ticket = tickets[ticketIndex];
  const updatedTicket = {
    ...ticket,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  tickets[ticketIndex] = updatedTicket;
  return updatedTicket;
}

export interface CreateMessageData {
  ticketId: string;
  userId: string;
  userName: string;
  userRole: string;
  message: string;
  attachments?: string[];
}

export async function addSupportMessage(data: CreateMessageData): Promise<SupportMessage> {
  const message: SupportMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    ticketId: data.ticketId,
    userId: data.userId,
    userName: data.userName,
    userRole: data.userRole,
    message: data.message,
    createdAt: new Date().toISOString(),
    attachments: data.attachments,
  };
  
  messages.push(message);
  
  // Update the ticket's updatedAt timestamp
  const ticketIndex = tickets.findIndex(t => t.id === data.ticketId);
  if (ticketIndex !== -1) {
    tickets[ticketIndex].updatedAt = message.createdAt;
  }
  
  return message;
}

export async function getSupportTickets(filters: Partial<SupportTicket> = {}): Promise<SupportTicket[]> {
  // Filter tickets based on provided filters
  return tickets.filter(ticket => {
    for (const [key, value] of Object.entries(filters)) {
      if (ticket[key as keyof SupportTicket] !== value) {
        return false;
      }
    }
    return true;
  });
}

export async function getSupportMessages(ticketId: string): Promise<SupportMessage[]> {
  return messages.filter(msg => msg.ticketId === ticketId);
}

export async function assignSupportTicket(
  ticketId: string,
  agentId: string,
  agentName: string
): Promise<SupportTicket | null> {
  return updateSupportTicket(ticketId, {
    assignedTo: agentId,
    assignedName: agentName,
    status: 'IN_PROGRESS',
  });
}

export async function resolveSupportTicket(
  ticketId: string,
  resolution: string
): Promise<SupportTicket | null> {
  return updateSupportTicket(ticketId, {
    status: 'RESOLVED',
    resolution,
  });
}
