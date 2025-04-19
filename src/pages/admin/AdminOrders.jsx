
import React, { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import {
  Search,
  Filter,
  Download,
  Eye,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Store,
  Truck,
  User,
  AlertTriangle,
  MoreVertical,
  Printer,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

// Mock orders data
const orders = [
  {
    id: "ORD12345",
    date: new Date(2023, 6, 15, 19, 30),
    customer: {
      id: "c1",
      name: "Jane Cooper",
      email: "jane.cooper@example.com",
      phone: "+1 (123) 456-7891",
      avatar: "https://randomuser.me/api/portraits/women/12.jpg"
    },
    restaurant: {
      id: "1",
      name: "Chicken King",
      email: "contact@chickenking.com",
      phone: "+1 (123) 456-7890",
      image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    },
    driver: {
      id: "d1",
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1 (123) 456-7895",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    items: [
      { name: "Crispy Chicken Burger", quantity: 2, price: 70 },
      { name: "Fries", quantity: 1, price: 30 }
    ],
    subtotal: 170,
    deliveryFee: 30,
    serviceFee: 10,
    total: 210,
    status: "delivered",
    paymentMethod: "Credit Card",
    paymentStatus: "paid"
  },
  {
    id: "ORD12346",
    date: new Date(2023, 6, 10, 13, 15),
    customer: {
      id: "c2",
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      phone: "+1 (123) 456-7892",
      avatar: "https://randomuser.me/api/portraits/men/42.jpg"
    },
    restaurant: {
      id: "2",
      name: "Pizza Palace",
      email: "contact@pizzapalace.com",
      phone: "+1 (123) 456-7893",
      image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    },
    driver: {
      id: "d2",
      name: "Emily White",
      email: "emily.white@example.com",
      phone: "+1 (123) 456-7896",
      avatar: "https://randomuser.me/api/portraits/women/22.jpg"
    },
    items: [
      { name: "Pepperoni Pizza", quantity: 1, price: 95 },
      { name: "Garlic Bread", quantity: 1, price: 25 }
    ],
    subtotal: 120,
    deliveryFee: 35,
    serviceFee: 10,
    total: 165,
    status: "delivered",
    paymentMethod: "Cash on Delivery",
    paymentStatus: "paid"
  },
  {
    id: "ORD12347",
    date: new Date(),
    customer: {
      id: "c3",
      name: "Sarah Wilson",
      email: "sarah.wilson@example.com",
      phone: "+1 (123) 456-7894",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    restaurant: {
      id: "3",
      name: "Fresh Fries",
      email: "contact@freshfries.com",
      phone: "+1 (123) 456-7897",
      image: "https://images.unsplash.com/photo-1685109649408-c5c56ae4428d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    },
    driver: null, // Not assigned yet
    items: [
      { name: "Loaded Fries", quantity: 1, price: 50 },
      { name: "Soft Drink", quantity: 2, price: 15 }
    ],
    subtotal: 80,
    deliveryFee: 25,
    serviceFee: 10,
    total: 115,
    status: "processing",
    paymentMethod: "E-eats Wallet",
    paymentStatus: "paid"
  },
  {
    id: "ORD12348",
    date: new Date(2023, 6, 5, 20, 45),
    customer: {
      id: "c4",
      name: "Michael Brown",
      email: "michael.brown@example.com",
      phone: "+1 (123) 456-7898",
      avatar: "https://randomuser.me/api/portraits/men/62.jpg"
    },
    restaurant: {
      id: "1",
      name: "Chicken King",
      email: "contact@chickenking.com",
      phone: "+1 (123) 456-7890",
      image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    },
    driver: {
      id: "d3",
      name: "David Clark",
      email: "david.clark@example.com",
      phone: "+1 (123) 456-7899",
      avatar: "https://randomuser.me/api/portraits/men/12.jpg"
    },
    items: [
      { name: "Family Combo", quantity: 1, price: 220 }
    ],
    subtotal: 220,
    deliveryFee: 30,
    serviceFee: 10,
    total: 260,
    status: "cancelled",
    paymentMethod: "Credit Card",
    paymentStatus: "refunded",
    cancellationReason: "Customer requested cancellation"
  },
  {
    id: "ORD12349",
    date: new Date(2023, 6, 7, 18, 20),
    customer: {
      id: "c5",
      name: "Emma Davis",
      email: "emma.davis@example.com",
      phone: "+1 (123) 456-7900",
      avatar: "https://randomuser.me/api/portraits/women/52.jpg"
    },
    restaurant: {
      id: "2",
      name: "Pizza Palace",
      email: "contact@pizzapalace.com",
      phone: "+1 (123) 456-7893",
      image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    },
    driver: {
      id: "d2",
      name: "Emily White",
      email: "emily.white@example.com",
      phone: "+1 (123) 456-7896",
      avatar: "https://randomuser.me/api/portraits/women/22.jpg"
    },
    items: [
      { name: "Margherita Pizza", quantity: 1, price: 85 },
      { name: "Coke", quantity: 2, price: 10 }
    ],
    subtotal: 105,
    deliveryFee: 35,
    serviceFee: 10,
    total: 150,
    status: "delivered",
    paymentMethod: "PayPal",
    paymentStatus: "paid"
  },
  {
    id: "ORD12350",
    date: new Date(2023, 6, 8, 12, 35),
    customer: {
      id: "c6",
      name: "Daniel Taylor",
      email: "daniel.taylor@example.com",
      phone: "+1 (123) 456-7901",
      avatar: "https://randomuser.me/api/portraits/men/72.jpg"
    },
    restaurant: {
      id: "4",
      name: "Beverage Bar",
      email: "contact@beveragebar.com",
      phone: "+1 (123) 456-7902",
      image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    },
    driver: {
      id: "d1",
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1 (123) 456-7895",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    items: [
      { name: "Iced Coffee", quantity: 3, price: 25 },
      { name: "Chocolate Muffin", quantity: 2, price: 15 }
    ],
    subtotal: 105,
    deliveryFee: 20,
    serviceFee: 10,
    total: 135,
    status: "issue",
    paymentMethod: "Credit Card",
    paymentStatus: "paid",
    issueDescription: "Order delivered incomplete, missing muffins"
  }
];

const AdminOrders = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  
  const handleTabChange = (value) => {
    setActiveTab(value);
  };
  
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setOrderDialogOpen(true);
  };
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const assignDriver = () => {
    toast({
      title: "Driver assigned",
      description: `A driver has been assigned to order #${selectedOrder.id}`,
    });
  };
  
  const cancelOrder = () => {
    toast({
      title: "Order cancelled",
      description: `Order #${selectedOrder.id} has been cancelled`,
    });
  };
  
  const refundOrder = () => {
    toast({
      title: "Refund processed",
      description: `A refund has been processed for order #${selectedOrder.id}`,
    });
  };
  
  const resolveIssue = () => {
    toast({
      title: "Issue resolved",
      description: `The issue with order #${selectedOrder.id} has been marked as resolved`,
    });
  };
  
  const printReceipt = () => {
    toast({
      title: "Receipt printed",
      description: `Receipt for order #${selectedOrder.id} has been sent to printer`,
    });
  };
  
  const exportOrders = () => {
    toast({
      title: "Export started",
      description: "Orders are being exported to CSV",
    });
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case "processing":
        return <Badge variant="secondary">Processing</Badge>;
      case "prepared":
        return <Badge variant="secondary">Prepared</Badge>;
      case "picked_up":
        return <Badge variant="warning">Picked Up</Badge>;
      case "delivering":
        return <Badge variant="warning">On the Way</Badge>;
      case "delivered":
        return <Badge variant="success">Delivered</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      case "issue":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Issue Reported</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return <Badge variant="outline" className="border-green-500 text-green-500">Paid</Badge>;
      case "pending":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Pending</Badge>;
      case "failed":
        return <Badge variant="outline" className="border-red-500 text-red-500">Failed</Badge>;
      case "refunded":
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Filter orders based on search query, status tab, and other filters
  const filteredOrders = orders.filter(order => {
    // Filter by tab (status)
    if (activeTab !== "all" && order.status !== activeTab) {
      return false;
    }
    
    // Filter by payment status
    if (paymentFilter !== "all" && order.paymentStatus !== paymentFilter) {
      return false;
    }
    
    // Filter by date range
    if (dateFilter !== "all") {
      const today = new Date();
      const orderDate = new Date(order.date);
      
      switch (dateFilter) {
        case "today":
          if (orderDate.toDateString() !== today.toDateString()) {
            return false;
          }
          break;
        case "week":
          const weekAgo = new Date(today);
          weekAgo.setDate(today.getDate() - 7);
          if (orderDate < weekAgo) {
            return false;
          }
          break;
        case "month":
          const monthAgo = new Date(today);
          monthAgo.setMonth(today.getMonth() - 1);
          if (orderDate < monthAgo) {
            return false;
          }
          break;
        default:
          break;
      }
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(query) ||
        order.customer.name.toLowerCase().includes(query) ||
        order.restaurant.name.toLowerCase().includes(query) ||
        (order.driver && order.driver.name.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Orders Management</h1>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportOrders}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID, customer, restaurant..."
              className="pl-10"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[140px]">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>Date: </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-[140px]">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>Payment: </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full" onValueChange={handleTabChange} value={activeTab}>
          <TabsList className="grid grid-cols-4 lg:grid-cols-7 mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="delivering">Delivering</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            <TabsTrigger value="issue">Issues</TabsTrigger>
            <TabsTrigger value="refunded">Refunded</TabsTrigger>
          </TabsList>
          
          <Card>
            <CardContent className="p-0 overflow-auto">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Restaurant</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
                            <AlertCircle className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <p className="text-lg font-medium mb-1">No orders found</p>
                          <p className="text-sm text-muted-foreground">
                            Try adjusting your filters or search query
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{format(order.date, "MMM d, yyyy")}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={order.customer.avatar} alt={order.customer.name} />
                              <AvatarFallback>{order.customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <span>{order.customer.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={order.restaurant.image} alt={order.restaurant.name} />
                              <AvatarFallback>{order.restaurant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <span>{order.restaurant.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{formatCurrency(order.total)}</TableCell>
                        <TableCell>
                          {getStatusBadge(order.status)}
                        </TableCell>
                        <TableCell>
                          {getPaymentStatusBadge(order.paymentStatus)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => viewOrderDetails(order)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Tabs>
        
        {/* Order Details Dialog */}
        {selectedOrder && (
          <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
            <DialogContent className="max-w-4xl">
              <DialogTitle className="flex justify-between items-center">
                <span>Order {selectedOrder.id}</span>
                <div className="flex gap-2">
                  {getStatusBadge(selectedOrder.status)}
                  {getPaymentStatusBadge(selectedOrder.paymentStatus)}
                </div>
              </DialogTitle>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - Order Info */}
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Order Information</h3>
                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Date:</span>
                            <span>{format(selectedOrder.date, "MMM d, yyyy 'at' h:mm a")}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Payment Method:</span>
                            <span>{selectedOrder.paymentMethod}</span>
                          </div>
                          
                          <Separator className="my-2" />
                          
                          <div className="space-y-3">
                            {selectedOrder.items.map((item, index) => (
                              <div key={index} className="flex justify-between">
                                <span>{item.quantity}x {item.name}</span>
                                <span>{formatCurrency(item.price * item.quantity)}</span>
                              </div>
                            ))}
                          </div>
                          
                          <Separator className="my-2" />
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Subtotal</span>
                              <span>{formatCurrency(selectedOrder.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Delivery Fee</span>
                              <span>{formatCurrency(selectedOrder.deliveryFee)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Service Fee</span>
                              <span>{formatCurrency(selectedOrder.serviceFee)}</span>
                            </div>
                            <div className="flex justify-between font-bold mt-2 text-lg">
                              <span>Total</span>
                              <span>{formatCurrency(selectedOrder.total)}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {selectedOrder.status === "issue" && (
                    <div>
                      <h3 className="text-lg font-medium mb-2 flex items-center">
                        <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
                        Issue Details
                      </h3>
                      <Card className="border-yellow-500/50">
                        <CardContent className="p-4">
                          <p>{selectedOrder.issueDescription}</p>
                          <div className="mt-4 flex justify-end">
                            <Button onClick={resolveIssue}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark as Resolved
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  
                  {selectedOrder.status === "cancelled" && (
                    <div>
                      <h3 className="text-lg font-medium mb-2 flex items-center">
                        <XCircle className="h-5 w-5 mr-2 text-destructive" />
                        Cancellation Details
                      </h3>
                      <Card className="border-destructive/50">
                        <CardContent className="p-4">
                          <p>Reason: {selectedOrder.cancellationReason}</p>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
                
                {/* Right Column - People Info */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      <User className="h-5 w-5 mr-2 text-primary" />
                      Customer
                    </h3>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar>
                            <AvatarImage src={selectedOrder.customer.avatar} alt={selectedOrder.customer.name} />
                            <AvatarFallback>{selectedOrder.customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{selectedOrder.customer.name}</h4>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{selectedOrder.customer.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{selectedOrder.customer.phone}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      <Store className="h-5 w-5 mr-2 text-primary" />
                      Restaurant
                    </h3>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar>
                            <AvatarImage src={selectedOrder.restaurant.image} alt={selectedOrder.restaurant.name} />
                            <AvatarFallback>{selectedOrder.restaurant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{selectedOrder.restaurant.name}</h4>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{selectedOrder.restaurant.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{selectedOrder.restaurant.phone}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      <Truck className="h-5 w-5 mr-2 text-primary" />
                      Delivery Driver
                    </h3>
                    <Card>
                      <CardContent className="p-4">
                        {selectedOrder.driver ? (
                          <>
                            <div className="flex items-center gap-3 mb-3">
                              <Avatar>
                                <AvatarImage src={selectedOrder.driver.avatar} alt={selectedOrder.driver.name} />
                                <AvatarFallback>{selectedOrder.driver.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">{selectedOrder.driver.name}</h4>
                              </div>
                            </div>
                            
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{selectedOrder.driver.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{selectedOrder.driver.phone}</span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-muted-foreground mb-4">No driver assigned yet</p>
                            <Button onClick={assignDriver}>
                              Assign Driver
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-end gap-2 mt-4">
                <Button variant="outline" onClick={printReceipt}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print Receipt
                </Button>
                
                {selectedOrder.status !== "cancelled" && selectedOrder.status !== "delivered" && (
                  <Button variant="destructive" onClick={cancelOrder}>
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Order
                  </Button>
                )}
                
                {selectedOrder.status !== "refunded" && selectedOrder.paymentStatus !== "refunded" && selectedOrder.paymentMethod !== "Cash on Delivery" && (
                  <Button variant="outline" onClick={refundOrder}>
                    Refund Order
                  </Button>
                )}
                
                <DialogClose asChild>
                  <Button variant="secondary">Close</Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </MainLayout>
  );
};

export default AdminOrders;
