
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Order } from "functions/src/models/order";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Clock, ClipboardList, CheckCircle2, XCircle, Truck, 
  Calendar, User, MapPin, Phone, DollarSign, AlertCircle, 
  ShoppingBag, ChevronRight, Timer
} from "lucide-react";
import MainLayout from "@/layouts/MainLayout";
import { useUser } from "@/context/UserContext.tsx";
import { format } from "date-fns";

// Order status options
const ORDER_STATUS = {
  PLACED: "placed",
  CONFIRMED: "confirmed",
  PREPARING: "preparing",
  READY: "ready",
  IN_TRANSIT: "in_transit",
  DELIVERED: "delivered",
  CANCELLED: "cancelled"
};

// Component for displaying order status badge
const StatusBadge = ({ status }) => {
  const statusConfig = {
    [ORDER_STATUS.PLACED]: { label: "Placed", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
    [ORDER_STATUS.CONFIRMED]: { label: "Confirmed", className: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300" },
    [ORDER_STATUS.PREPARING]: { label: "Preparing", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" },
    [ORDER_STATUS.READY]: { label: "Ready for Pickup", className: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
    [ORDER_STATUS.IN_TRANSIT]: { label: "In Transit", className: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" },
    [ORDER_STATUS.DELIVERED]: { label: "Delivered", className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
    [ORDER_STATUS.CANCELLED]: { label: "Cancelled", className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" }
  };

  const config = statusConfig[status] || statusConfig[ORDER_STATUS.PLACED];
  
  return (
    <Badge className={`${config.className} hover:${config.className}`}>
      {config.label}
    </Badge>
  );
};

const Orders = () => {
  const { currentUser } = useAuth();
  const { user } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("active");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [cancellationDialogOpen, setCancellationDialogOpen] = useState(false);
  const [processingOrder, setProcessingOrder] = useState(false);
  
  const fetchOrders = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      console.log("Fetching orders for vendor:", user.id);
      const fetchedOrders = await Order.getOrdersByVendor(user.id);
      console.log("Fetched orders:", fetchedOrders);
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load orders.",
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id, toast]);

  useEffect(() => {
    if (!user?.id) return;
    fetchOrders();
  }, [fetchOrders, user?.id]);


  const updateOrderStatus = async (orderId, newStatus, reason = "") => {
    if (!orderId || !newStatus) return;
  
    setProcessingOrder(true);
  
    try {
      console.log(`Updating order ${orderId} to status: ${newStatus}`);
      const updatedOrder = await Order.updateOrderStatus(orderId, newStatus, reason);
  
      toast({
        title: "Order updated",
        description: `Order status changed to ${newStatus}.`,
      });
    } catch (error) {
        console.error("Error updating order status:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to connect to orders data."
        });
        setLoading(false);
      }
    finally {
        setProcessingOrder(false);
    }
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => ({
          ...prev,
          status: newStatus,
          statusUpdatedAt: new Date().toISOString(),
          ...(reason ? { cancellationReason: reason } : {}),
        }));
      }
    };
  
  
  
  // Filter orders based on selected tab
  const getFilteredOrders = () => {
    switch (selectedTab) {
      case "active":      
        return orders.filter(order => 
          [ORDER_STATUS.PLACED, ORDER_STATUS.CONFIRMED, ORDER_STATUS.PREPARING, ORDER_STATUS.READY].includes(order.status)
        );
      case "completed":
        return orders.filter(order => 
          [ORDER_STATUS.DELIVERED].includes(order.status)
        );
      case "cancelled":
        return orders.filter(order => 
          [ORDER_STATUS.CANCELLED].includes(order.status)
        );
      default:
        return orders;
    }
  };
  
  const filteredOrders = getFilteredOrders();
  
  // Open order details dialog
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
  };
  
  // Get next status based on current status
  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case ORDER_STATUS.PLACED:
        return ORDER_STATUS.CONFIRMED;
      case ORDER_STATUS.CONFIRMED:
        return ORDER_STATUS.PREPARING;
      case ORDER_STATUS.PREPARING:
        return ORDER_STATUS.READY;
      default:
        return null;
    }
  };
  
  // Format date string
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm a");
    } catch (error) {
      return "Invalid date";
    }
  };
  
  // Calculate estimated delivery time
  const getEstimatedDelivery = (order) => {
    if (!order.createdAt) return "Unknown";
    
    try {
      const createdDate = new Date(order.createdAt);
      
      // Add preparation and delivery time (minutes)
      const prepTime = order.estimatedPrepTime || 20;
      const deliveryTime = order.estimatedDeliveryTime || 30;
      
      const totalMinutes = prepTime + deliveryTime;
      createdDate.setMinutes(createdDate.getMinutes() + totalMinutes);
      
      return format(createdDate, "h:mm a");
    } catch (error) {
      return "Unknown";
    }
  };
  
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Order Management</h1>
          <Button onClick={() => navigate("/vendor/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
        
        <Tabs 
          defaultValue="active" 
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="active">
              Active Orders
              {orders.filter(order => 
                [ORDER_STATUS.PLACED, ORDER_STATUS.CONFIRMED, ORDER_STATUS.PREPARING, ORDER_STATUS.READY].includes(order.status)
              ).length > 0 && (
                <Badge className="ml-2 bg-primary">
                  {orders.filter(order => 
                    [ORDER_STATUS.PLACED, ORDER_STATUS.CONFIRMED, ORDER_STATUS.PREPARING, ORDER_STATUS.READY].includes(order.status)
                  ).length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          <TabsContent value={selectedTab} className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : filteredOrders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOrders.map(order => (
                  <Card key={order.id} className="overflow-hidden card-hover">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center">
                            <ShoppingBag className="h-5 w-5 mr-2 text-primary" />
                            Order #{order.orderNumber || order.id.slice(-6)}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <StatusBadge status={order.status} />
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pb-2">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            Customer:
                          </span>
                          <span className="font-medium">
                            {order.customerName || "Guest Customer"}
                          </span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            Total:
                          </span>
                          <span className="font-medium">
                            ${parseFloat(order.totalAmount).toFixed(2)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground flex items-center">
                            <ClipboardList className="h-4 w-4 mr-1" />
                            Items:
                          </span>
                          <span className="font-medium">
                            {order.items?.length || 0} items
                          </span>
                        </div>
                        
                        {order.status === ORDER_STATUS.PREPARING && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground flex items-center">
                              <Timer className="h-4 w-4 mr-1" />
                              Est. Ready:
                            </span>
                            <span className="font-medium">
                              {getEstimatedDelivery(order)}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="pt-1">
                      {order.status === ORDER_STATUS.PLACED && (
                        <div className="grid grid-cols-2 gap-2 w-full">
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, ORDER_STATUS.CONFIRMED)}
                            disabled={processingOrder}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Confirm
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedOrder(order);
                              setCancellationDialogOpen(true);
                            }}
                            disabled={processingOrder}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      )}
                      
                      {(order.status === ORDER_STATUS.CONFIRMED || order.status === ORDER_STATUS.PREPARING) && (
                        <div className="grid grid-cols-2 gap-2 w-full">
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, getNextStatus(order.status))}
                            disabled={processingOrder}
                          >
                            {order.status === ORDER_STATUS.CONFIRMED ? (
                              <>
                                <Clock className="h-4 w-4 mr-1" />
                                Start Cooking
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Mark Ready
                              </>
                            )}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => viewOrderDetails(order)}
                          >
                            View Details
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      )}
                      
                      {order.status === ORDER_STATUS.READY && (
                        <Button 
                          variant="outline" 
                          className="w-full"
                          size="sm"
                          onClick={() => viewOrderDetails(order)}
                        >
                          View Details
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      )}
                      
                      {(order.status === ORDER_STATUS.DELIVERED || order.status === ORDER_STATUS.CANCELLED) && (
                        <Button 
                          variant="outline" 
                          className="w-full"
                          size="sm"
                          onClick={() => viewOrderDetails(order)}
                        >
                          View Details
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-muted/20 p-4 rounded-full mb-4">
                  <ClipboardList className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No {selectedTab} orders</h3>
                <p className="text-muted-foreground max-w-md">
                  {selectedTab === "active" 
                    ? "You don't have any active orders at the moment. New orders will appear here."
                    : selectedTab === "completed"
                      ? "You haven't completed any orders yet."
                      : "You don't have any cancelled orders."}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Order Details Dialog */}
      <Dialog open={orderDetailsOpen} onOpenChange={setOrderDetailsOpen}>
        <DialogContent className="max-w-3xl">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <ShoppingBag className="h-5 w-5 mr-2 text-primary" />
                  Order #{selectedOrder.orderNumber || selectedOrder.id.slice(-6)}
                </DialogTitle>
                <div className="flex items-center justify-between">
                  <DialogDescription>
                    Placed on {formatDate(selectedOrder.createdAt)}
                  </DialogDescription>
                  <StatusBadge status={selectedOrder.status} />
                </div>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4 md:col-span-2">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Order Items</h3>
                    <div className="bg-secondary/50 rounded-lg p-4">
                      {selectedOrder.items?.map((item, index) => (
                        <div 
                          key={index} 
                          className="flex justify-between items-center py-2 border-b last:border-b-0"
                        >
                          <div className="flex items-center">
                            {item.image ? (
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-12 h-12 object-cover rounded mr-3"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-secondary flex items-center justify-center rounded mr-3">
                                <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{item.name}</p>
                              {item.size && (
                                <p className="text-sm text-muted-foreground capitalize">
                                  Size: {item.size}
                                </p>
                              )}
                              {item.selectedAddons && item.selectedAddons.length > 0 && (
                                <p className="text-sm text-muted-foreground">
                                  Add-ons: {item.selectedAddons.map(addon => addon.name).join(", ")}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${parseFloat(item.price).toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                      
                      <div className="mt-4 pt-2 border-t">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal</span>
                          <span>${parseFloat(selectedOrder.subtotal || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span>Delivery Fee</span>
                          <span>${parseFloat(selectedOrder.deliveryFee || 0).toFixed(2)}</span>
                        </div>
                        {selectedOrder.discount > 0 && (
                          <div className="flex justify-between text-sm mt-1 text-green-600">
                            <span>Discount</span>
                            <span>-${parseFloat(selectedOrder.discount || 0).toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                          <span>Total</span>
                          <span>${parseFloat(selectedOrder.totalAmount || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {selectedOrder.status === ORDER_STATUS.CANCELLED && selectedOrder.cancellationReason && (
                    <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg flex items-start space-x-2">
                      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-800 dark:text-red-400">
                          Cancellation Reason
                        </h4>
                        <p className="text-red-700 dark:text-red-300">
                          {selectedOrder.cancellationReason}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {selectedOrder.specialInstructions && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-lg">
                      <h4 className="font-medium text-yellow-800 dark:text-yellow-400">
                        Special Instructions
                      </h4>
                      <p className="text-yellow-700 dark:text-yellow-300">
                        {selectedOrder.specialInstructions}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Customer Information</h3>
                    <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
                      <div className="flex items-center text-sm">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {selectedOrder.customerName || "Guest Customer"}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {selectedOrder.customerPhone || "No phone provided"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Delivery Information</h3>
                    <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
                      <div className="flex items-start text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                        <span>
                          {selectedOrder.deliveryAddress || "No address provided"}
                        </span>
                      </div>
                      {selectedOrder.status === ORDER_STATUS.IN_TRANSIT && selectedOrder.deliveryPersonName && (
                        <div className="flex items-center text-sm">
                          <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            Delivery by: {selectedOrder.deliveryPersonName}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          Estimated delivery: {getEstimatedDelivery(selectedOrder)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Order Status</h3>
                    <div className="bg-secondary/50 rounded-lg p-4">
                      {selectedOrder.status !== ORDER_STATUS.DELIVERED && 
                       selectedOrder.status !== ORDER_STATUS.CANCELLED && 
                       selectedOrder.status !== ORDER_STATUS.IN_TRANSIT && (
                        <Select 
                          defaultValue={selectedOrder.status}
                          onValueChange={(value) => updateOrderStatus(selectedOrder.id, value)}
                          disabled={processingOrder}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Update status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={ORDER_STATUS.CONFIRMED}>Confirm Order</SelectItem>
                            <SelectItem value={ORDER_STATUS.PREPARING}>Start Preparing</SelectItem>
                            <SelectItem value={ORDER_STATUS.READY}>Ready for Pickup</SelectItem>
                            <SelectItem value={ORDER_STATUS.CANCELLED}>Cancel Order</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center">
                          <div className={`h-4 w-4 rounded-full flex items-center justify-center mr-2 ${
                            selectedOrder.status !== ORDER_STATUS.CANCELLED ? "bg-primary" : "bg-muted"
                          }`}>
                            <CheckCircle2 className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-sm">Order placed</span>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {formatDate(selectedOrder.createdAt)}
                          </span>
                        </div>
                        
                        {(selectedOrder.status === ORDER_STATUS.CONFIRMED || 
                          selectedOrder.status === ORDER_STATUS.PREPARING ||
                          selectedOrder.status === ORDER_STATUS.READY ||
                          selectedOrder.status === ORDER_STATUS.IN_TRANSIT ||
                          selectedOrder.status === ORDER_STATUS.DELIVERED) && (
                          <div className="flex items-center">
                            <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center mr-2">
                              <CheckCircle2 className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-sm">Order confirmed</span>
                          </div>
                        )}
                        
                        {(selectedOrder.status === ORDER_STATUS.PREPARING ||
                          selectedOrder.status === ORDER_STATUS.READY ||
                          selectedOrder.status === ORDER_STATUS.IN_TRANSIT ||
                          selectedOrder.status === ORDER_STATUS.DELIVERED) && (
                          <div className="flex items-center">
                            <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center mr-2">
                              <CheckCircle2 className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-sm">Preparing order</span>
                          </div>
                        )}
                        
                        {(selectedOrder.status === ORDER_STATUS.READY ||
                          selectedOrder.status === ORDER_STATUS.IN_TRANSIT ||
                          selectedOrder.status === ORDER_STATUS.DELIVERED) && (
                          <div className="flex items-center">
                            <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center mr-2">
                              <CheckCircle2 className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-sm">Ready for pickup</span>
                          </div>
                        )}
                        
                        {(selectedOrder.status === ORDER_STATUS.IN_TRANSIT ||
                          selectedOrder.status === ORDER_STATUS.DELIVERED) && (
                          <div className="flex items-center">
                            <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center mr-2">
                              <CheckCircle2 className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-sm">Out for delivery</span>
                          </div>
                        )}
                        
                        {selectedOrder.status === ORDER_STATUS.DELIVERED && (
                          <div className="flex items-center">
                            <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center mr-2">
                              <CheckCircle2 className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-sm">Delivered</span>
                          </div>
                        )}
                        
                        {selectedOrder.status === ORDER_STATUS.CANCELLED && (
                          <div className="flex items-center">
                            <div className="h-4 w-4 rounded-full bg-destructive flex items-center justify-center mr-2">
                              <XCircle className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-sm">Order cancelled</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setOrderDetailsOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Cancellation Reason Dialog */}
      <Dialog open={cancellationDialogOpen} onOpenChange={setCancellationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              Please provide a reason for cancelling this order. This will be visible to the customer.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="cancellationReason">Cancellation Reason</Label>
              <Textarea 
                id="cancellationReason" 
                placeholder="Eg: Out of stock, Restaurant closing early, etc."
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setCancellationDialogOpen(false)}
              disabled={processingOrder}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (selectedOrder) {
                updateOrderStatus(selectedOrder.id, ORDER_STATUS.CANCELLED, cancellationReason);
                }
              }}
              disabled={processingOrder || !cancellationReason.trim()}
            >
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Orders;
