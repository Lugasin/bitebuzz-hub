
import React, { useState, useEffect, useCallback } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { MapPin, Navigation, Phone, Package, CheckCircle, Clock, Truck, AlertCircle, Frown, ChevronRight, User, Store, Star, CircleDollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "@/hooks/useMediaQuery";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { Order } from "@/models/order";

const DeliveryOrders = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("available");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [orders, setOrders] = useState([]);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setOrderDialogOpen(true);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (currentUser ) {
          const deliveryDriverId = currentUser.uid; 
          const fetchedOrders = await Order.getOrderByDeliveryDriver(deliveryDriverId);
          console.log("Fetched orders:", fetchedOrders);
          setOrders(fetchedOrders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast({
          title: "Error",
          description: "Failed to fetch orders.",
          variant: "destructive",
        });
      }
    };
    fetchOrders();
  }, [currentUser]);

  const acceptOrder = useCallback(async (orderId) => {
    try {
      await Order.updateOrder(orderId, { status: "active", acceptedAt: new Date(), deliveryDriver: currentUser.uid });
      toast({
        title: "Order accepted",
        description: `You have accepted order #${orderId}`,
      });
      setOrders((prevOrders) => prevOrders.map((order) => (order.id === orderId ? { ...order, status: "active", acceptedAt: new Date() } : order)));
      setActiveTab("active");
    } catch (error) {
      console.error("Error accepting order:", error);
      toast({ title: "Error", description: `Failed to accept order #${orderId}.`, variant: "destructive" });
    }
  }, [currentUser]);

  const markAsPickedUp = useCallback(async (orderId) => {
    try {
      await Order.updateOrder(orderId, { pickedUpAt: new Date() });
      toast({ title: "Order picked up", description: `You have marked order #${orderId} as picked up` });
      setOrders((prevOrders) => prevOrders.map((order) => (order.id === orderId ? { ...order, pickedUpAt: new Date() } : order)));
    } catch (error) {
      console.error("Error marking order as picked up:", error);
      toast({ title: "Error", description: `Failed to mark order #${orderId} as picked up.`, variant: "destructive" });
    }
  }, []);

  const markAsDelivered = useCallback(
    async (orderId) => {
      try {
        await Order.updateOrder(orderId, { status: "completed", deliveredAt: new Date() });
        toast({
          title: "Order delivered",
          description: `You have delivered order #${orderId}`,
        });

        // Simulate order status update

      setActiveTab("completed");
      setOrders((prevOrders) => prevOrders.map((order) => (order.id === orderId ? { ...order, status: "completed", deliveredAt: new Date() } : order)));
    } catch (error) {
      console.error("Error marking order as delivered:", error);
      toast({ title: "Error", description: `Failed to mark order #${orderId} as delivered.`, variant: "destructive" });
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
      description: isAvailable ? "You won't receive new delivery requests" : "You will start receiving delivery requests",
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

  const filteredOrders = orders.filter((order) => order.status === activeTab);

  if (!currentUser) {
    return (
      <MainLayout>
        <p>You must be logged in to view orders.</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold">Delivery Orders</h1>

          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isAvailable ? "bg-green-500" : "bg-red-500"}`}></div>
            <Label htmlFor="available" className="mr-2">
              Available for Deliveries
            </Label>
            <Switch id="available" checked={isAvailable} onCheckedChange={toggleAvailability}

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
                    ? "You don't have any active deliveries right now." : activeTab === "completed" ? "You haven't completed any deliveries yet." : "You don't have any cancelled orders."}
                </p>
                {!isAvailable && activeTab === "available" && (
                  <Button className={cn(buttonVariants({ variant: "default" }))} onClick={toggleAvailability}>
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
                        <div className="md:w-1/4 h-24 md:h-auto overflow-hidden">
                          <img
                            src={order.restaurant.image}
                            alt={order.restaurant.name}
                            className="w-full h-full object-cover" />

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
                          )}{/* Display Button to the user */}
                          
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
                    Restaurant Information {/* Restaurant Information */}
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
                        </Button>{/* Call to the restaurant */}
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => window.open(`https://maps.google.com/?q=${selectedOrder.restaurant.location.lat},${selectedOrder.restaurant.location.lng}`)}>
                          <Navigation className="mr-2 h-4 w-4" />
                          Directions
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Customer Information {/* Customer Information */}
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
                    Order Details{/* Order Details */}
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
                  </h3>{/* Delivery Timeline */}
                  
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
                        )}{/* Check is canceled */}
                        
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
                    </CardContent> {/* End card */}
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
          </Dialog> {/* End dialog */}
        )}{/* Check is selectedOrder */}
      </div>
    </MainLayout>
  );
};

export default DeliveryOrders;
