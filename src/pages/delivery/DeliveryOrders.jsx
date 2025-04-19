
import React, { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import {
  MapPin,
  Navigation,
  Phone,
  Package,
  CheckCircle,
  Clock,
  Truck,
  AlertCircle,
  Frown,
  ChevronRight,
  User,
  Store,
  CircleDollarSign
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";

// Mock delivery orders data
const deliveryOrders = [
  {
    id: "DEL12345",
    status: "available",
    createdAt: new Date(new Date().getTime() - 5 * 60000), // 5 minutes ago
    restaurant: {
      id: "1",
      name: "Chicken King",
      address: "123 Main St, City, State",
      location: { lat: -15.3875, lng: 28.3228 },
      image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
      phone: "+1 (123) 456-7890"
    },
    customer: {
      id: "c1",
      name: "Jane Cooper",
      address: "456 Park Ave, City, State",
      location: { lat: -15.4006, lng: 28.3228 },
      phone: "+1 (123) 456-7891"
    },
    items: [
      { name: "Crispy Chicken Burger", quantity: 2 },
      { name: "Fries", quantity: 1 },
      { name: "Cola", quantity: 2 }
    ],
    total: 170,
    deliveryFee: 30,
    estimatedDistance: "2.5 km",
    estimatedTime: "15 min"
  },
  {
    id: "DEL12346",
    status: "active",
    acceptedAt: new Date(new Date().getTime() - 15 * 60000), // 15 minutes ago
    pickedUpAt: new Date(new Date().getTime() - 5 * 60000), // 5 minutes ago
    createdAt: new Date(new Date().getTime() - 25 * 60000), // 25 minutes ago
    restaurant: {
      id: "2",
      name: "Pizza Palace",
      address: "789 Food St, City, State",
      location: { lat: -15.3906, lng: 28.3128 },
      image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
      phone: "+1 (123) 456-7892"
    },
    customer: {
      id: "c2",
      name: "Robert Johnson",
      address: "101 Delivery Rd, City, State",
      location: { lat: -15.4043, lng: 28.3172 },
      phone: "+1 (123) 456-7893"
    },
    items: [
      { name: "Pepperoni Pizza (Large)", quantity: 1 },
      { name: "Garlic Bread", quantity: 1 }
    ],
    total: 120,
    deliveryFee: 35,
    estimatedDistance: "3.2 km",
    estimatedTime: "12 min"
  },
  {
    id: "DEL12347",
    status: "completed",
    acceptedAt: new Date(new Date().getTime() - 75 * 60000), // 75 minutes ago
    pickedUpAt: new Date(new Date().getTime() - 65 * 60000), // 65 minutes ago
    deliveredAt: new Date(new Date().getTime() - 55 * 60000), // 55 minutes ago
    createdAt: new Date(new Date().getTime() - 85 * 60000), // 85 minutes ago
    restaurant: {
      id: "3",
      name: "Fresh Fries",
      address: "222 Snack Blvd, City, State",
      location: { lat: -15.3950, lng: 28.3100 },
      image: "https://images.unsplash.com/photo-1685109649408-c5c56ae4428d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
      phone: "+1 (123) 456-7894"
    },
    customer: {
      id: "c3",
      name: "Sarah Wilson",
      address: "303 Customer Ave, City, State",
      location: { lat: -15.4015, lng: 28.3109 },
      phone: "+1 (123) 456-7895"
    },
    items: [
      { name: "Loaded Fries", quantity: 1 },
      { name: "Soft Drink", quantity: 2 }
    ],
    total: 80,
    deliveryFee: 25,
    estimatedDistance: "1.8 km",
    estimatedTime: "10 min",
    rating: 5,
    review: "Excellent service and fast delivery!"
  },
  {
    id: "DEL12348",
    status: "completed",
    acceptedAt: new Date(new Date().getTime() - 240 * 60000), // 4 hours ago
    pickedUpAt: new Date(new Date().getTime() - 230 * 60000), // 3 hours 50 minutes ago
    deliveredAt: new Date(new Date().getTime() - 215 * 60000), // 3 hours 35 minutes ago
    createdAt: new Date(new Date().getTime() - 250 * 60000), // 4 hours 10 minutes ago
    restaurant: {
      id: "1",
      name: "Chicken King",
      address: "123 Main St, City, State",
      location: { lat: -15.3875, lng: 28.3228 },
      image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
      phone: "+1 (123) 456-7890"
    },
    customer: {
      id: "c4",
      name: "Michael Brown",
      address: "404 Home St, City, State",
      location: { lat: -15.3905, lng: 28.3128 },
      phone: "+1 (123) 456-7896"
    },
    items: [
      { name: "Family Combo", quantity: 1 }
    ],
    total: 220,
    deliveryFee: 30,
    estimatedDistance: "2.2 km",
    estimatedTime: "14 min",
    rating: 4,
    review: "Good service, food was still hot."
  },
  {
    id: "DEL12349",
    status: "cancelled",
    acceptedAt: new Date(new Date().getTime() - 320 * 60000), // 5 hours 20 minutes ago
    cancelledAt: new Date(new Date().getTime() - 310 * 60000), // 5 hours 10 minutes ago
    createdAt: new Date(new Date().getTime() - 330 * 60000), // 5 hours 30 minutes ago
    restaurant: {
      id: "2",
      name: "Pizza Palace",
      address: "789 Food St, City, State",
      location: { lat: -15.3906, lng: 28.3128 },
      image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
      phone: "+1 (123) 456-7892"
    },
    customer: {
      id: "c5",
      name: "Emily Davis",
      address: "505 Cancel St, City, State",
      location: { lat: -15.4025, lng: 28.3145 },
      phone: "+1 (123) 456-7897"
    },
    items: [
      { name: "Margherita Pizza", quantity: 1 },
      { name: "Caesar Salad", quantity: 1 }
    ],
    total: 95,
    deliveryFee: 35,
    estimatedDistance: "2.8 km",
    estimatedTime: "18 min",
    cancellationReason: "Restaurant closed early"
  }
];

const DeliveryOrders = () => {
  const [activeTab, setActiveTab] = useState("available");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  
  const handleTabChange = (value) => {
    setActiveTab(value);
  };
  
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setOrderDialogOpen(true);
  };
  
  const acceptOrder = (orderId) => {
    // Update order status logic would go here in a real app
    toast({
      title: "Order accepted",
      description: `You have accepted order #${orderId}`,
    });
    
    // Simulate order status update
    setTimeout(() => {
      setActiveTab("active");
    }, 500);
  };
  
  const markAsPickedUp = (orderId) => {
    // Update order status logic would go here in a real app
    toast({
      title: "Order picked up",
      description: `You have marked order #${orderId} as picked up`,
    });
  };
  
  const markAsDelivered = (orderId) => {
    // Update order status logic would go here in a real app
    toast({
      title: "Order delivered",
      description: `You have delivered order #${orderId}`,
    });
    
    // Simulate order status update
    setTimeout(() => {
      setActiveTab("completed");
    }, 500);
  };
  
  const reportIssue = (orderId) => {
    // Issue reporting logic would go here in a real app
    toast({
      title: "Issue reported",
      description: `You have reported an issue with order #${orderId}`,
    });
  };
  
  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);
    
    toast({
      title: isAvailable ? "You are now offline" : "You are now online",
      description: isAvailable 
        ? "You won't receive new delivery requests" 
        : "You will start receiving delivery requests",
    });
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case "available":
        return <Badge variant="secondary">Available</Badge>;
      case "active":
        return <Badge variant="warning">In Progress</Badge>;
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const filteredOrders = deliveryOrders.filter(order => order.status === activeTab);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold">Delivery Orders</h1>
          
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <Label htmlFor="available" className="mr-2">Available for Deliveries</Label>
            <Switch 
              id="available" 
              checked={isAvailable} 
              onCheckedChange={toggleAvailability} 
            />
          </div>
        </div>
        
        <Tabs defaultValue="available" className="w-full" onValueChange={handleTabChange} value={activeTab}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-muted rounded-full">
                  {activeTab === "available" ? (
                    <Package className="h-8 w-8 text-muted-foreground" />
                  ) : activeTab === "active" ? (
                    <Truck className="h-8 w-8 text-muted-foreground" />
                  ) : activeTab === "completed" ? (
                    <CheckCircle className="h-8 w-8 text-muted-foreground" />
                  ) : (
                    <Frown className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <h2 className="text-xl font-semibold mb-2">No {activeTab} orders</h2>
                <p className="text-muted-foreground mb-6">
                  {activeTab === "available" 
                    ? "There are no available orders at the moment. Check back soon!" 
                    : activeTab === "active" 
                    ? "You don't have any active deliveries right now."
                    : activeTab === "completed"
                    ? "You haven't completed any deliveries yet."
                    : "You don't have any cancelled orders."}
                </p>
                {!isAvailable && activeTab === "available" && (
                  <Button onClick={toggleAvailability}>
                    Go Online
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <Card key={order.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row border-b">
                        <div className="md:w-1/4 h-24 md:h-auto">
                          <img 
                            src={order.restaurant.image} 
                            alt={order.restaurant.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-lg">{order.restaurant.name}</h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                {formatDistanceToNow(order.createdAt, { addSuffix: true })}
                              </p>
                            </div>
                            <div>{getStatusBadge(order.status)}</div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4 text-sm">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span>{order.estimatedDistance}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span>Est. {order.estimatedTime}</span>
                            </div>
                            <div className="flex items-center">
                              <CircleDollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span>{formatCurrency(order.deliveryFee)}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 text-sm">
                            <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full">
                              <Store className="h-3 w-3" />
                              <span className="truncate max-w-[100px]">{order.restaurant.address.split(',')[0]}</span>
                            </div>
                            <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full">
                              <User className="h-3 w-3" />
                              <span className="truncate max-w-[100px]">{order.customer.address.split(',')[0]}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-2">
                        <div className="text-sm">
                          <span className="font-medium">Order:</span> #{order.id}
                        </div>
                        
                        <div className="flex flex-wrap justify-end gap-2">
                          {order.status === "available" && (
                            <>
                              <Button size="sm" variant="outline" onClick={() => viewOrderDetails(order)}>
                                View Details
                              </Button>
                              <Button size="sm" onClick={() => acceptOrder(order.id)}>
                                Accept
                              </Button>
                            </>
                          )}
                          
                          {order.status === "active" && (
                            <>
                              <Button size="sm" variant="outline" onClick={() => viewOrderDetails(order)}>
                                View Details
                              </Button>
                              {!order.pickedUpAt ? (
                                <Button size="sm" onClick={() => markAsPickedUp(order.id)}>
                                  Mark as Picked Up
                                </Button>
                              ) : (
                                <Button size="sm" onClick={() => markAsDelivered(order.id)}>
                                  Mark as Delivered
                                </Button>
                              )}
                              <Button size="sm" variant="destructive" onClick={() => reportIssue(order.id)}>
                                Report Issue
                              </Button>
                            </>
                          )}
                          
                          {(order.status === "completed" || order.status === "cancelled") && (
                            <Button size="sm" variant="outline" onClick={() => viewOrderDetails(order)}>
                              View Details
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Order Details Dialog */}
        {selectedOrder && (
          <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
            <DialogContent className="max-w-3xl">
              <DialogTitle className="flex justify-between items-center">
                Order #{selectedOrder.id}
                {getStatusBadge(selectedOrder.status)}
              </DialogTitle>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Store className="h-5 w-5 text-primary" />
                    Restaurant Information
                  </h3>
                  
                  <Card className="mb-4">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-12 w-12 rounded-full overflow-hidden">
                          <img 
                            src={selectedOrder.restaurant.image} 
                            alt={selectedOrder.restaurant.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{selectedOrder.restaurant.name}</h4>
                          <p className="text-sm text-muted-foreground">{selectedOrder.restaurant.address}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between gap-2">
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => window.open(`tel:${selectedOrder.restaurant.phone}`)}>
                          <Phone className="mr-2 h-4 w-4" />
                          Call
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => window.open(`https://maps.google.com/?q=${selectedOrder.restaurant.location.lat},${selectedOrder.restaurant.location.lng}`)}>
                          <Navigation className="mr-2 h-4 w-4" />
                          Directions
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Customer Information
                  </h3>
                  
                  <Card className="mb-4">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>{selectedOrder.customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{selectedOrder.customer.name}</h4>
                          <p className="text-sm text-muted-foreground">{selectedOrder.customer.address}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between gap-2">
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => window.open(`tel:${selectedOrder.customer.phone}`)}>
                          <Phone className="mr-2 h-4 w-4" />
                          Call
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => window.open(`https://maps.google.com/?q=${selectedOrder.customer.location.lat},${selectedOrder.customer.location.lng}`)}>
                          <Navigation className="mr-2 h-4 w-4" />
                          Directions
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {selectedOrder.status === "cancelled" && (
                    <div className="bg-destructive/10 p-4 rounded-md border border-destructive/20 mb-4">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                        <div>
                          <h4 className="font-medium text-destructive">Order Cancelled</h4>
                          <p className="text-sm text-muted-foreground">
                            Reason: {selectedOrder.cancellationReason}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Cancelled {selectedOrder.cancelledAt ? formatDistanceToNow(selectedOrder.cancelledAt, { addSuffix: true }) : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {selectedOrder.rating && (
                    <div className="bg-primary/10 p-4 rounded-md border border-primary/20">
                      <h4 className="font-medium mb-1">Customer Rating</h4>
                      <div className="flex items-center gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-5 w-5 ${i < selectedOrder.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      {selectedOrder.review && (
                        <p className="text-sm text-muted-foreground">"{selectedOrder.review}"</p>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Right Column */}
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Order Details
                  </h3>
                  
                  <Card className="mb-4">
                    <CardContent className="p-4">
                      <div className="space-y-3 mb-4">
                        {selectedOrder.items.map((item, index) => (
                          <div key={index} className="flex justify-between">
                            <span>{item.quantity}x {item.name}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="border-t pt-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span>{formatCurrency(selectedOrder.total - selectedOrder.deliveryFee)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Delivery Fee</span>
                          <span>{formatCurrency(selectedOrder.deliveryFee)}</span>
                        </div>
                        <div className="flex justify-between font-bold">
                          <span>Total</span>
                          <span>{formatCurrency(selectedOrder.total)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Delivery Timeline
                  </h3>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-6">
                        <div className="flex">
                          <div className="mr-4 relative flex flex-col items-center">
                            <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                              <CheckCircle className="h-4 w-4 text-white" />
                            </div>
                            <div className="h-14 w-0.5 bg-gray-200 dark:bg-gray-800 mt-1"></div>
                          </div>
                          <div>
                            <div className="font-medium">
                              Order Placed
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {format(selectedOrder.createdAt, "MMM d, yyyy 'at' h:mm a")}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex">
                          <div className="mr-4 relative flex flex-col items-center">
                            <div className={`h-6 w-6 rounded-full ${selectedOrder.acceptedAt ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'} flex items-center justify-center`}>
                              {selectedOrder.acceptedAt ? (
                                <CheckCircle className="h-4 w-4 text-white" />
                              ) : (
                                <Clock className="h-4 w-4 text-white" />
                              )}
                            </div>
                            <div className="h-14 w-0.5 bg-gray-200 dark:bg-gray-800 mt-1"></div>
                          </div>
                          <div>
                            <div className="font-medium">
                              {selectedOrder.acceptedAt ? 'Order Accepted' : 'Waiting for Acceptance'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {selectedOrder.acceptedAt ? format(selectedOrder.acceptedAt, "MMM d, yyyy 'at' h:mm a") : 'Pending'}
                            </div>
                          </div>
                        </div>
                        
                        {!selectedOrder.cancelledAt && (
                          <>
                            <div className="flex">
                              <div className="mr-4 relative flex flex-col items-center">
                                <div className={`h-6 w-6 rounded-full ${selectedOrder.pickedUpAt ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'} flex items-center justify-center`}>
                                  {selectedOrder.pickedUpAt ? (
                                    <CheckCircle className="h-4 w-4 text-white" />
                                  ) : (
                                    <Clock className="h-4 w-4 text-white" />
                                  )}
                                </div>
                                <div className="h-14 w-0.5 bg-gray-200 dark:bg-gray-800 mt-1"></div>
                              </div>
                              <div>
                                <div className="font-medium">
                                  {selectedOrder.pickedUpAt ? 'Picked Up from Restaurant' : 'Pickup Pending'}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {selectedOrder.pickedUpAt ? format(selectedOrder.pickedUpAt, "MMM d, yyyy 'at' h:mm a") : 'Pending'}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex">
                              <div className="mr-4 relative flex flex-col items-center">
                                <div className={`h-6 w-6 rounded-full ${selectedOrder.deliveredAt ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'} flex items-center justify-center`}>
                                  {selectedOrder.deliveredAt ? (
                                    <CheckCircle className="h-4 w-4 text-white" />
                                  ) : (
                                    <Clock className="h-4 w-4 text-white" />
                                  )}
                                </div>
                              </div>
                              <div>
                                <div className="font-medium">
                                  {selectedOrder.deliveredAt ? 'Delivered to Customer' : 'Delivery Pending'}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {selectedOrder.deliveredAt ? format(selectedOrder.deliveredAt, "MMM d, yyyy 'at' h:mm a") : 'Pending'}
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {selectedOrder.cancelledAt && (
                          <div className="flex">
                            <div className="mr-4 relative flex flex-col items-center">
                              <div className="h-6 w-6 rounded-full bg-destructive flex items-center justify-center">
                                <Frown className="h-4 w-4 text-white" />
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-destructive">
                                Order Cancelled
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {format(selectedOrder.cancelledAt, "MMM d, yyyy 'at' h:mm a")}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
                
                {selectedOrder.status === "available" && (
                  <Button onClick={() => acceptOrder(selectedOrder.id)}>
                    Accept Order
                  </Button>
                )}
                
                {selectedOrder.status === "active" && !selectedOrder.pickedUpAt && (
                  <Button onClick={() => markAsPickedUp(selectedOrder.id)}>
                    Mark as Picked Up
                  </Button>
                )}
                
                {selectedOrder.status === "active" && selectedOrder.pickedUpAt && (
                  <Button onClick={() => markAsDelivered(selectedOrder.id)}>
                    Mark as Delivered
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </MainLayout>
  );
};

const Star = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
};

export default DeliveryOrders;
