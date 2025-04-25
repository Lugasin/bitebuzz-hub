import { db } from '../config/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, Timestamp, orderBy } from 'firebase/firestore';
import { UserRole } from '../types/user';

export interface SupportTicket {
  id?: string;
  userId: string;
  userEmail: string;
  userName: string;
  subject: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category: 'ORDER' | 'PAYMENT' | 'DELIVERY' | 'ACCOUNT' | 'OTHER';
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  assignedToName?: string;
  resolution?: string;
  attachments?: string[];
  orderId?: string;
  restaurantId?: string;
}

export interface SupportMessage {
  id?: string;
  ticketId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  message: string;
  createdAt: Date;
  attachments?: string[];
}

export const createSupportTicket = async (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt'>): Promise<SupportTicket> => {
  const ticketsRef = collection(db, 'supportTickets');
  const now = new Date();
  
  const newTicket = {
    ...ticket,
    createdAt: now,
    updatedAt: now,
    status: 'OPEN' as const
  };

  const docRef = await addDoc(ticketsRef, newTicket);
  return { ...newTicket, id: docRef.id };
};

export const updateSupportTicket = async (ticketId: string, updates: Partial<SupportTicket>): Promise<void> => {
  const ticketRef = doc(db, 'supportTickets', ticketId);
  await updateDoc(ticketRef, {
    ...updates,
    updatedAt: new Date()
  });
};

export const addSupportMessage = async (message: Omit<SupportMessage, 'id' | 'createdAt'>): Promise<SupportMessage> => {
  const messagesRef = collection(db, 'supportMessages');
  const now = new Date();
  
  const newMessage = {
    ...message,
    createdAt: now
  };

  const docRef = await addDoc(messagesRef, newMessage);
  return { ...newMessage, id: docRef.id };
};

export const getSupportTickets = async (filters: {
  userId?: string;
  status?: SupportTicket['status'];
  priority?: SupportTicket['priority'];
  category?: SupportTicket['category'];
  assignedTo?: string;
  restaurantId?: string;
}): Promise<SupportTicket[]> => {
  let ticketsQuery = query(collection(db, 'supportTickets'), orderBy('createdAt', 'desc'));

  if (filters.userId) {
    ticketsQuery = query(ticketsQuery, where('userId', '==', filters.userId));
  }
  if (filters.status) {
    ticketsQuery = query(ticketsQuery, where('status', '==', filters.status));
  }
  if (filters.priority) {
    ticketsQuery = query(ticketsQuery, where('priority', '==', filters.priority));
  }
  if (filters.category) {
    ticketsQuery = query(ticketsQuery, where('category', '==', filters.category));
  }
  if (filters.assignedTo) {
    ticketsQuery = query(ticketsQuery, where('assignedTo', '==', filters.assignedTo));
  }
  if (filters.restaurantId) {
    ticketsQuery = query(ticketsQuery, where('restaurantId', '==', filters.restaurantId));
  }

  const snapshot = await getDocs(ticketsQuery);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SupportTicket));
};

export const getSupportMessages = async (ticketId: string): Promise<SupportMessage[]> => {
  const messagesQuery = query(
    collection(db, 'supportMessages'),
    where('ticketId', '==', ticketId),
    orderBy('createdAt', 'asc')
  );

  const snapshot = await getDocs(messagesQuery);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SupportMessage));
};

export const assignSupportTicket = async (ticketId: string, agentId: string, agentName: string): Promise<void> => {
  await updateSupportTicket(ticketId, {
    assignedTo: agentId,
    assignedToName: agentName,
    status: 'IN_PROGRESS'
  });
};

export const resolveSupportTicket = async (ticketId: string, resolution: string): Promise<void> => {
  await updateSupportTicket(ticketId, {
    status: 'RESOLVED',
    resolution
  });
}; 