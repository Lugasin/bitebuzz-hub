
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  Package,
  MapPin,
  Clock,
  CreditCard,
  Star,
  Phone,
  MessageSquare,
  Copy,
  CheckCircle,
  Truck,
  Receipt,
  CalendarClock
} from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

// Mock orders data
const orders = [
  {
    id: "ORD12345",
    date: new Date(2023, 6, 15, 19, 30),
    restaurant: {
      id: "1",
      name: "Chicken King",
      image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
      phone: "+1 (123) 456-7890"
    },
    items: [
      { name: "Crispy Chicken Burger", quantity: 2, price: 70, addOns: ["Extra Cheese", "Special Sauce"] },
      { name: "Fries", quantity: 1, price: 30, size: "Large" }
    ],
    subtotal: 170,
    deliveryFee: 30,
    serviceFee: 10,
    total: 210,
    status: "delivered",
    deliveryAddress: "123 Main St, Apt 4B, City, State, 10001",
    paymentMethod: "Credit Card",
    driver: {
      name: "John Smith",
      phone: "+1 (123) 456-7895",
      vehicleInfo: "Red Honda Civic",
      photo: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    statusUpdates: [
      { status: "ordered", time: new Date(2023, 6, 15, 19, 0), description: "Order placed" },
      { status: "confirmed", time: new Date(2023, 6, 15, 19, 5), description: "Order confirmed by restaurant" },
      { status: "preparing", time: new Date(2023, 6, 15, 19, 10), description: "Restaurant is preparing your food" },
      { status: "ready", time: new Date(2023, 6, 15, 19, 25), description: "Food is ready for pickup" },
      { status: "delivering", time: new Date(2023, 6, 15, 19, 30), description: "Driver is on the way to deliver your order" },
      { status: "delivered", time: new Date(2023, 6, 15, 19, 45), description: "Order delivered" }
    ]
  },
  {
    id: "ORD12347",
    date: new Date(),
    restaurant: {
      id: "3",
      name: "Fresh Fries",
      image: "https://images.unsplash.com/photo-1685109649408-c5c56ae4428d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
      phone: "+1 (123) 456-7891"
    },
    items: [
      { name: "Loaded Fries", quantity: 1, price: 50, size: "Large" },
      { name: "Soft Drink", quantity: 2, price: 15 }
    ],
    subtotal: 80,
    deliveryFee: 30,
    serviceFee: 10,
    total: 120,
    status: "processing",
    deliveryAddress: "123 Main St, Apt 4B, City, State, 10001",
    paymentMethod: "E-eats Wallet",
    statusUpdates: [
      { status: "ordered", time: new Date(new Date().setMinutes(new Date().getMinutes() - 10)), description: "Order placed" },
      { status: "confirmed", time: new Date(new Date().setMinutes(new Date().getMinutes() - 5)), description: "Order confirmed by restaurant" },
      { status: "preparing", time: new Date(), description: "Restaurant is preparing your food" }
    ]
  }
];

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call to fetch order details
    const fetchOrder = () => {
      const foundOrder = orders.find(o => o.id === id);
      setOrder(foundOrder);
      setLoading(false);
    };
    
    // Simulate network delay
    setTimeout(fetchOrder, 500);
  }, [id]);
  
  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.id);
    toast({
      title: "Order ID copied",
      description: "Order ID has been copied to clipboard",
    });
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case "ordered":
        return "text-blue-500";
      case "confirmed":
        return "text-blue-500";
      case "preparing":
        return "text-yellow-500";
      case "ready":
        return "text-orange-500";
      case "delivering":
        return "text-orange-500";
      case "delivered":
        return "text-green-500";
      case "cancelled":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };
  
  const getStatusBadge = (status) => {
    let variant = "outline";
    let label = status.charAt(0).toUpperCase() + status.slice(1);
    
    switch (status) {
      case "processing":
      case "ordered":
      case "confirmed":
        variant = "secondary";
        break;
      case "preparing":
        variant = "secondary";
        break;
      case "ready":
      case "delivering":
        variant = "warning";
        break;
      case "delivered":
        variant = "success";
        break;
      case "cancelled":
        variant = "destructive";
        break;
      default:
        variant = "outline";
    }
    
    return <Badge variant={variant}>{label}</Badge>;
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 flex justify-center">
          <div className="animate-spin">
            <Package className="h-8 w-8 text-primary" />
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (!order) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="text-muted-foreground mb-6">
            Sorry, we couldn't find the order you're looking for.
          </p>
          <Button asChild>
            <Link to="/orders">View All Orders</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Link to="/orders" className="flex items-center text-primary mb-4">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Orders
        </Link>
        
        <div className="flex flex-wrap items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Order Details</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopyOrderId}>
              <Copy className="h-4 w-4 mr-2" />
              {order.id}
            </Button>
            {getStatusBadge(order.status)}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Order details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Status</h2>
                
                <div className="space-y-6">
                  {order.statusUpdates.map((update, index) => (
                    <div key={index} className="flex">
                      <div className="mr-4 relative flex flex-col items-center">
                        <div className={`h-6 w-6 rounded-full ${getStatusColor(update.status)} bg-current flex items-center justify-center`}>
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                        {index < order.statusUpdates.length - 1 && (
                          <div className="h-14 w-0.5 bg-gray-200 dark:bg-gray-800 mt-1"></div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">
                          {update.description}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {format(update.time, "MMM d, yyyy 'at' h:mm a")}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {order.status !== "cancelled" && order.status !== "delivered" && (
                    <div className="flex items-center justify-center mt-4">
                      <CalendarClock className="h-5 w-5 text-muted-foreground mr-2" />
                      <span className="text-sm text-muted-foreground">
                        Estimated delivery: {format(new Date(order.date.getTime() + 45 * 60000), "h:mm a")}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Order Items */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Order Items</h2>
                  <Link to={`/restaurant/${order.restaurant.id}`} className="text-sm text-primary">
                    View Restaurant
                  </Link>
                </div>
                
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden">
                    <img 
                      src={order.restaurant.image} 
                      alt={order.restaurant.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{order.restaurant.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {format(order.date, "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-4 mb-6">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <div>
                        <div className="font-medium">{item.quantity}x {item.name}</div>
                        {item.size && (
                          <div className="text-xs text-muted-foreground">
                            Size: {item.size}
                          </div>
                        )}
                        {item.addOns && item.addOns.length > 0 && (
                          <div className="text-xs text-muted-foreground">
                            Add-ons: {item.addOns.join(', ')}
                          </div>
                        )}
                      </div>
                      <div className="font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                {/* Cost Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span>{formatCurrency(order.deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service Fee</span>
                    <span>{formatCurrency(order.serviceFee)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Delivery Driver */}
            {order.driver && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Delivery Driver</h2>
                  
                  <div className="flex items-center">
                    <div className="h-16 w-16 rounded-full overflow-hidden mr-4">
                      <img 
                        src={order.driver.photo} 
                        alt={order.driver.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{order.driver.name}</h3>
                      <p className="text-sm text-muted-foreground">{order.driver.vehicleInfo}</p>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button size="sm" className="rounded-full">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                      <Button size="sm" variant="outline" className="rounded-full">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Right column - Summary */}
          <div className="space-y-6">
            {/* Delivery Information */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Delivery Information</h2>
                
                <div className="space-y-4">
                  <div className="flex">
                    <MapPin className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Delivery Address</h3>
                      <p className="text-sm text-muted-foreground">
                        {order.deliveryAddress}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <Clock className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Order Time</h3>
                      <p className="text-sm text-muted-foreground">
                        {format(order.date, "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <CreditCard className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Payment Method</h3>
                      <p className="text-sm text-muted-foreground">
                        {order.paymentMethod}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Actions */}
            <Card>
              <CardContent className="p-6 space-y-3">
                {order.status === "delivered" && (
                  <Button className="w-full" asChild>
                    <Link to={`/review/${order.id}`}>
                      <Star className="h-4 w-4 mr-2" />
                      Rate Your Order
                    </Link>
                  </Button>
                )}
                
                <Button variant="outline" className="w-full" asChild>
                  <Link to={`/restaurant/${order.restaurant.id}`}>
                    <Truck className="h-4 w-4 mr-2" />
                    Order Again
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Receipt className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
                
                {order.status !== "delivered" && order.status !== "cancelled" && (
                  <Button variant="outline" className="w-full text-destructive hover:text-destructive">
                    Cancel Order
                  </Button>
                )}
              </CardContent>
            </Card>
            
            {/* Customer Support */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-medium mb-2">Need help?</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  If you have any issues with your order, please contact our support team.
                </p>
                <Button variant="outline" className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderDetails;
