import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '../services/api';

// Define UserRole type
type UserRole = 'customer' | 'vendor' | 'delivery' | 'admin' | 'support' | 'superadmin' | 'guest';

interface SupportTicket {
  id: string;
  subject: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category: 'ORDER' | 'PAYMENT' | 'DELIVERY' | 'ACCOUNT' | 'OTHER';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  assignedToName?: string;
  userName: string;
  userEmail: string;
}

interface SupportMessage {
  id: string;
  message: string;
  createdAt: string;
  userName: string;
  userRole: UserRole;
}

const SupportDashboard: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    priority: 'MEDIUM',
    category: 'OTHER'
  });
  
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTickets = async () => {
    try {
      setLoading(true);
      
      // Use apiService instead of api.get
      const response = await apiService.get('/support/tickets');
      setTickets(response.data);
    } catch (error) {
      console.error('Failed to fetch support tickets', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch support tickets',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (ticketId: string) => {
    try {
      // Use apiService instead of api.get
      const response = await apiService.get(`/support/tickets/${ticketId}`);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Failed to fetch messages', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch messages',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleTicketClick = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    fetchMessages(ticket.id);
    setIsTicketModalOpen(true);
  };

  const handleNewTicket = async () => {
    try {
      // Use apiService instead of api.post
      await apiService.post('/support/tickets', newTicket);
      
      toast({
        title: 'Success',
        description: 'Support ticket created successfully',
      });
      
      setIsNewTicketModalOpen(false);
      setNewTicket({
        subject: '',
        description: '',
        priority: 'MEDIUM',
        category: 'OTHER'
      });
      
      fetchTickets();
    } catch (error) {
      console.error('Failed to create support ticket', error);
      toast({
        title: 'Error',
        description: 'Failed to create support ticket',
        variant: 'destructive'
      });
    }
  };

  const handleSendMessage = async () => {
    if (!selectedTicket || !newMessage.trim()) return;

    try {
      // Use apiService instead of api.post
      await apiService.post(`/support/tickets/${selectedTicket.id}/messages`, {
        message: newMessage
      });
      
      toast({
        title: 'Success',
        description: 'Message sent successfully',
      });
      
      setNewMessage('');
      fetchMessages(selectedTicket.id);
    } catch (error) {
      console.error('Failed to send message', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      });
    }
  };

  const handleAssignTicket = async () => {
    if (!selectedTicket || !user) return;

    try {
      // Use apiService instead of api.post
      await apiService.post(`/support/tickets/${selectedTicket.id}/assign`, {
        agentId: user.id,
      });
      
      toast({
        title: 'Success',
        description: 'Ticket assigned successfully',
      });
      
      fetchTickets();
    } catch (error) {
      console.error('Failed to assign ticket', error);
      toast({
        title: 'Error',
        description: 'Failed to assign ticket',
        variant: 'destructive'
      });
    }
  };

  const handleResolveTicket = async () => {
    if (!selectedTicket) return;

    try {
      // Use apiService instead of api.post
      await apiService.post(`/support/tickets/${selectedTicket.id}/resolve`, {
        resolution: 'Resolved by support agent'
      });
      
      toast({
        title: 'Success',
        description: 'Ticket resolved successfully',
      });
      
      setIsTicketModalOpen(false);
      fetchTickets();
    } catch (error) {
      console.error('Failed to resolve ticket', error);
      toast({
        title: 'Error',
        description: 'Failed to resolve ticket',
        variant: 'destructive'
      });
    }
  };

  const getPriorityColor = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'LOW': return 'success';
      case 'MEDIUM': return 'info';
      case 'HIGH': return 'warning';
      case 'URGENT': return 'destructive';
      default: return 'default';
    }
  };

  const getStatusColor = (status: SupportTicket['status']) => {
    switch (status) {
      case 'OPEN': return 'info';
      case 'IN_PROGRESS': return 'warning';
      case 'RESOLVED': return 'success';
      case 'CLOSED': return 'default';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Support Dashboard</h1>
        <Button onClick={() => setIsNewTicketModalOpen(true)}>
          Create New Ticket
        </Button>
      </div>

      <Card className="mb-8">
        <Tabs defaultValue="all">
          <TabsList className="w-full border-b">
            <TabsTrigger value="all">All Tickets</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="inProgress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="p-4">
            {loading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : tickets.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Subject</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Priority</th>
                      <th className="text-left py-2">Category</th>
                      <th className="text-left py-2">Created</th>
                      <th className="text-left py-2">Assigned To</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map(ticket => (
                      <tr 
                        key={ticket.id} 
                        className="hover:bg-gray-50 cursor-pointer border-b"
                        onClick={() => handleTicketClick(ticket)}
                      >
                        <td className="py-3">{ticket.subject}</td>
                        <td className="py-3">
                          <Badge variant={getStatusColor(ticket.status) as any}>
                            {ticket.status}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <Badge variant={getPriorityColor(ticket.priority) as any}>
                            {ticket.priority}
                          </Badge>
                        </td>
                        <td className="py-3">{ticket.category}</td>
                        <td className="py-3">{formatDate(ticket.createdAt)}</td>
                        <td className="py-3">{ticket.assignedToName || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-8 text-gray-500">
                No tickets found
              </div>
            )}
          </TabsContent>
          
          {/* Other tab contents would filter the tickets by status */}
          <TabsContent value="open" className="p-4">
            {/* Similar content to "all" but filtered */}
          </TabsContent>
          <TabsContent value="inProgress" className="p-4">
            {/* Similar content to "all" but filtered */}
          </TabsContent>
          <TabsContent value="resolved" className="p-4">
            {/* Similar content to "all" but filtered */}
          </TabsContent>
        </Tabs>
      </Card>

      {/* Ticket Detail Modal */}
      <Dialog open={isTicketModalOpen} onOpenChange={setIsTicketModalOpen}>
        <DialogContent className="max-w-3xl">
          {selectedTicket && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedTicket.subject}</DialogTitle>
                <DialogDescription>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant={getStatusColor(selectedTicket.status) as any}>
                      {selectedTicket.status}
                    </Badge>
                    <Badge variant={getPriorityColor(selectedTicket.priority) as any}>
                      {selectedTicket.priority}
                    </Badge>
                    <Badge variant="outline">{selectedTicket.category}</Badge>
                  </div>
                  <div className="mt-2 text-sm">
                    <p>Created by: {selectedTicket.userName}</p>
                    <p>Email: {selectedTicket.userEmail}</p>
                    <p>Created: {formatDate(selectedTicket.createdAt)}</p>
                  </div>
                </DialogDescription>
              </DialogHeader>
              
              <div className="border rounded-md p-4 max-h-64 overflow-y-auto">
                <h3 className="font-semibold mb-2">Messages</h3>
                {messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className="flex items-start gap-3">
                        <Avatar>
                          <span>{msg.userName[0]}</span>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{msg.userName}</span>
                            <Badge className="text-xs">
                              {msg.userRole}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {formatDate(msg.createdAt)}
                            </span>
                          </div>
                          <p className="mt-1">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No messages yet</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Textarea 
                  placeholder="Type your message..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button onClick={handleSendMessage}>
                  Send Message
                </Button>
              </div>
              
              {user?.role === 'admin' || user?.role === 'support' ? (
                <DialogFooter className="flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={handleAssignTicket}
                  >
                    Assign to Me
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleResolveTicket}
                  >
                    Resolve Ticket
                  </Button>
                </DialogFooter>
              ) : null}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* New Ticket Modal */}
      <Dialog open={isNewTicketModalOpen} onOpenChange={setIsNewTicketModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Support Ticket</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">Subject</label>
              <Input
                id="subject"
                value={newTicket.subject}
                onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea
                id="description"
                rows={4}
                value={newTicket.description}
                onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="priority" className="text-sm font-medium">Priority</label>
                <Select
                  value={newTicket.priority}
                  onValueChange={(value: string) => setNewTicket({...newTicket, priority: value as any})}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">Category</label>
                <Select
                  value={newTicket.category}
                  onValueChange={(value: string) => setNewTicket({...newTicket, category: value as any})}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ORDER">Order</SelectItem>
                    <SelectItem value="PAYMENT">Payment</SelectItem>
                    <SelectItem value="DELIVERY">Delivery</SelectItem>
                    <SelectItem value="ACCOUNT">Account</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={handleNewTicket}>Create Ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupportDashboard;
