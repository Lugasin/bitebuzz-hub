import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlarmClock,
  LoaderCircle
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

// Mock order history data
const orders = [
  {
    id: "ORD12345",
    date: new Date(2023, 6, 15, 19, 30),
    restaurant: {
      id: "1",
      name: "Chicken King",
      image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    },
    items: [
      { name: "Crispy Chicken Burger", quantity: 2, price: 70 },
      { name: "Fries", quantity: 1, price: 30 }
    ],
    total: 170,
    status: "delivered",
    deliveryAddress: "123 Main St, Apt 4B, City",
    paymentMethod: "Credit Card"
  },
  {
    id: "ORD12346",
    date: new Date(2023, 6, 10, 13, 15),
    restaurant: {
      id: "2",
      name: "Pizza Palace",
      image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    },
    items: [
      { name: "Pepperoni Pizza", quantity: 1, price: 95 },
      { name: "Garlic Bread", quantity: 1, price: 25 }
    ],
    total: 120,
    status: "delivered",
    deliveryAddress: "123 Main St, Apt 4B, City",
    paymentMethod: "Cash on Delivery"
  },
  {
    id: "ORD12347",
    date: new Date(),
    restaurant: {
      id: "3",
      name: "Fresh Fries",
      image: "https://images.unsplash.com/photo-1685109649408-c5c56ae4428d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    },
    items: [
      { name: "Loaded Fries", quantity: 1, price: 50 },
      { name: "Soft Drink", quantity: 2, price: 15 }
    ],
    total: 80,
    status: "processing",
    deliveryAddress: "123 Main St, Apt 4B, City",
    paymentMethod: "E-eats Wallet"
  },
  {
    id: "ORD12348",
    date: new Date(2023, 6, 5, 20, 45),
    restaurant: {
      id: "1",
      name: "Chicken King",
      image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    },
    items: [
      { name: "Family Combo", quantity: 1, price: 220 }
    ],
    total: 220,
    status: "cancelled",
    deliveryAddress: "123 Main St, Apt 4B, City",
    paymentMethod: "Credit Card"
  }
];

const OrderHistory = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [filteredOrders, setFilteredOrders] = useState(orders);

  // Filter orders based on active tab
  useEffect(() => {
    if (activeTab === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === activeTab));
    }
  }, [activeTab]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "processing":
        return <LoaderCircle className="h-5 w-5 text-blue-500" />;
      case "preparing":
        return <AlarmClock className="h-5 w-5 text-yellow-500" />;
      case "delivering":
        return <Package className="h-5 w-5 text-orange-500" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    let variant = "outline";
    let label = status.charAt(0).toUpperCase() + status.slice(1);
    
    switch (status) {
      case "processing":
        variant = "secondary";
        break;
      case "preparing":
        variant = "secondary";
        break;
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

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Order History</h1>
        
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="delivering">Delivering</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">No orders found</h2>
                <p className="text-muted-foreground mb-6">
                  You don't have any {activeTab !== "all" ? activeTab : ""} orders yet.
                </p>
                <Button asChild>
                  <Link to="/restaurants">Order Now</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/4 h-32 md:h-auto">
                          <img 
                            src={order.restaurant.image} 
                            alt={order.restaurant.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 flex-1 flex flex-col md:flex-row justify-between">
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-bold text-lg">{order.restaurant.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {format(order.date, "MMM d, yyyy 'at' h:mm a")}
                                </p>
                              </div>
                              <div>{getStatusBadge(order.status)}</div>
                            </div>
                            
                            <div className="text-sm mb-4">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between">
                                  <span>{item.quantity}x {item.name}</span>
                                  <span>{formatCurrency(item.price * item.quantity)}</span>
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Order #{order.id}</span>
                              <span className="font-medium">Total: {formatCurrency(order.total)}</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 md:mt-0 md:ml-6 flex flex-row md:flex-col justify-between items-center md:items-end space-y-0 md:space-y-2">
                            <div className="flex items-center">
                              {getStatusIcon(order.status)}
                              <span className="ml-2 text-sm hidden md:inline">
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </div>
                            
                            <Button asChild variant="outline" size="sm">
                              <Link to={`/order/${order.id}`}>
                                Details
                                <ChevronRight className="ml-1 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default OrderHistory;