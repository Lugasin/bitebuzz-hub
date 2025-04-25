
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/layouts/MainLayout.tsx";
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
  DialogClose,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import {
  Search,
  Download,
  Eye,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Store,
  Truck,
  User,
  AlertTriangle,
  Printer,
  X
} from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";

const AdminOrders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const { currentUser } = useAuth();

  const viewOrderDetails = useCallback((order) => {
    setSelectedOrder(order);
    setOrderDialogOpen(true);
  }, []);

  const handleSearch = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const assignDriver = async () => {
    toast({
      title: "Driver assigned",
      description: `A driver has been assigned to order #${selectedOrder.id}`,
    });
  };
  
  const cancelOrder = async () => {
    const orderId = selectedOrder.id;
    try {
      console.log("Cancelling order", { orderId });
      await deleteOrder(orderId);
      console.log("Order cancelled successfully:", orderId);
      toast({
        title: "Order cancelled",
        description: `Order #${selectedOrder.id} has been cancelled`,
      });
      await getOrders();
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast({ variant: "destructive", title: "Error cancelling order", description: `An error occurred while trying to cancel order #${orderId}` });
    }
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
  
  const getOrders = async () => {
    setLoading(true);
    try {
      console.log("Getting orders");
      const orders = await getAllOrders();
        console.log("Orders retrieved:", orders);
      setOrders(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({ variant: "destructive", title: "Error fetching orders", description: "An error occurred while trying to retrieve the orders." });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
     try {
      console.log("Updating order status", { orderId, newStatus });
        const updatedOrder = await updateOrder(orderId, { status: newStatus });
      console.log("Order status updated successfully:", updatedOrder);
      await getOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
        toast({ variant: "destructive", title: "Error updating order", description: `An error occurred while trying to update the order status of #${orderId}` });
    }
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    if (value === "refunded") {      
      setPaymentFilter("refunded");
    } else {
    }
  };

  useEffect(() => {
    if (!currentUser)
      return;    
      console.log("currentUser: ", currentUser);
    getOrders();
  },[currentUser]);

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
          const orderDate = parseISO(order.date);
      
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
                <span>Date: {dateFilter}</span>
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
                <span>Payment: {paymentFilter}</span>
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
          
          <Card >
            <CardContent className="p-0 overflow-auto">
            {loading && (
              <div className="flex justify-center items-center w-full h-full p-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
              </div>
            )}
            {!loading && (
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
            )}
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
                    <div key={selectedOrder.issueDescription}>
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
                    <div key={selectedOrder.cancellationReason}>
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
                              <Avatar >
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
                    <X className="h-4 w-4 mr-2" />
                    Cancel Order
                  </Button>
                )}
                
                {selectedOrder.paymentStatus !== "refunded" && selectedOrder.paymentMethod !== "Cash on Delivery" && (
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
