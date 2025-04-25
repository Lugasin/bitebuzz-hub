
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, Clock, DollarSign, MapPin, TrendingUp, User, Calendar } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { DeliveryDriver } from '@/models/deliveryDriver';

const DeliveryDashboard = () => {
  // Sample data for the delivery dashboard
  const activeOrders = [
    {
      id: "ORD-9217",
      customer: "Lisa Garcia",
      restaurant: "Taco Town",
      address: "789 Pine St, Anytown, USA",
      items: "3× Street Tacos, 1× Nachos, 2× Horchata",
      total: "$32.75",
      status: "transit",
      time: "5 min ago"
    }
  ];
  
  const availableOrders = [
    {
      id: "ORD-7429",
      restaurant: "Burger Palace",
      address: "123 Main St, Anytown, USA",
      distance: "1.2 miles",
      items: 4,
      total: "$28.97",
      estimate: "15-20 min"
    },
    {
      id: "ORD-8532",
      restaurant: "Pizza Heaven",
      address: "456 Oak Ave, Anytown, USA",
      distance: "0.8 miles",
      items: 2,
      total: "$24.50",
      estimate: "10-15 min"
    }
  ];
  
  const recentDeliveries = [
    {
      id: "ORD-7210",
      customer: "Robert Chen",
      restaurant: "Sushi Express",
      total: "$42.30",
      date: "Today, 2:15 PM",
      tip: "$8.00"
    },
    {
      id: "ORD-7205",
      customer: "Maria Lopez",
      restaurant: "Pasta House",
      total: "$35.45",
      date: "Today, 12:30 PM",
      tip: "$7.00"
    },
    {
      id: "ORD-7198",
      customer: "James Wilson",
      restaurant: "Curry Corner",
      total: "$29.99",
      date: "Today, 11:45 AM",
      tip: "$6.50"
    }
  ];
  
  const earningsData = {
    today: "$125.75",
    week: "$875.50",
    month: "$3,240.25"
  };
  
    const { currentUser } = useAuth();
    const [deliveryDriver, setDeliveryDriver] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDeliveryDriver = async () => {
            try {
                setLoading(true);
                const deliveryDriverData = await DeliveryDriver.getDeliveryDriverByFirebaseUid(currentUser.uid);
                setDeliveryDriver(deliveryDriverData);
                console.log('Delivery driver data fetched successfully:', deliveryDriverData);
            } catch (error) {
                setError(error.message);
                console.error('Error fetching delivery driver data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDeliveryDriver();
    }, [currentUser]);

  return (
    
    <div className="container mx-auto px-4 py-8 pt-20">
      <h1 className="text-3xl font-bold mb-6">Delivery Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{earningsData.today}</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrders.length}</div>
            <p className="text-xs text-muted-foreground">In transit</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableOrders.length}</div>
            <p className="text-xs text-muted-foreground">Ready for pickup</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentDeliveries.length}</div>
            <p className="text-xs text-muted-foreground">Orders delivered</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-8">
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">Active Order</TabsTrigger>
              <TabsTrigger value="available">Available Orders</TabsTrigger>
              <TabsTrigger value="recent">Recent Deliveries</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active">
              <Card>
                <CardHeader>
                  <CardTitle>Your Current Delivery</CardTitle>
                  <CardDescription>Orders you are currently delivering</CardDescription>
                </CardHeader>
                <CardContent>
                  {activeOrders.length > 0 ? (
                    <div className="space-y-4">
                      {activeOrders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                            <div className="flex items-center gap-3">
                              <div className="font-semibold">{order.id}</div>
                              <Badge variant="outline" className="status-transit">In Transit</Badge>
                            </div>
                            <div className="text-lg font-bold">{order.total}</div>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4 mb-3">
                            <div>
                              <div className="text-sm font-medium mb-1">Customer</div>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback>{order.customer[0]}</AvatarFallback>
                                </Avatar>
                                <span>{order.customer}</span>
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium mb-1">Restaurant</div>
                              <div>{order.restaurant}</div>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <div className="text-sm font-medium mb-1">Delivery Address</div>
                            <div className="text-sm">{order.address}</div>
                          </div>
                          
                          <div className="mb-4">
                            <div className="text-sm font-medium mb-1">Order Items</div>
                            <div className="text-sm">{order.items}</div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            <Button variant="default">Mark as Delivered</Button>
                            <Button variant="outline">Navigate</Button>
                            <Button variant="outline">Contact Customer</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <Truck className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-medium text-lg mb-2">No Active Deliveries</h3>
                      <p className="text-muted-foreground mb-4">You don't have any active deliveries at the moment.</p>
                      <Button variant="outline">View Available Orders</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="available">
              <Card>
                <CardHeader>
                  <CardTitle>Available Orders</CardTitle>
                  <CardDescription>Orders ready for pickup</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {availableOrders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="font-semibold">{order.id}</div>
                            <Badge variant="outline" className="status-ready">Ready for Pickup</Badge>
                          </div>
                          <div className="text-lg font-bold">{order.total}</div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <div className="text-sm font-medium mb-1">Restaurant</div>
                            <div>{order.restaurant}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-1">Pickup Address</div>
                            <div className="text-sm">{order.address}</div>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <div className="text-sm font-medium mb-1">Distance</div>
                            <div className="flex items-center gap-1 text-sm">
                              <MapPin className="h-3 w-3" />
                              {order.distance}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-1">Items</div>
                            <div className="text-sm">{order.items} items</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-1">Est. Time</div>
                            <div className="flex items-center gap-1 text-sm">
                              <Clock className="h-3 w-3" />
                              {order.estimate}
                            </div>
                          </div>
                        </div>
                        
                        <Button variant="default" className="w-full">Accept Order</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="recent">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Deliveries</CardTitle>
                  <CardDescription>Orders you've delivered recently</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentDeliveries.map((delivery) => (
                      <div key={delivery.id} className="border rounded-lg p-4">
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="font-semibold">{delivery.id}</div>
                            <Badge variant="outline" className="status-delivered">Delivered</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{delivery.date}</span>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 mb-2">
                          <div>
                            <div className="text-sm font-medium mb-1">Customer</div>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>{delivery.customer}</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-1">Restaurant</div>
                            <div>{delivery.restaurant}</div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-sm font-medium mb-1">Order Total</div>
                            <div className="font-semibold">{delivery.total}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-1">Tip Received</div>
                            <div className="font-semibold text-green-600">{delivery.tip}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="md:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Earnings Overview</CardTitle>
              <CardDescription>Your delivery earnings summary</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Today</h3>
                <div className="text-2xl font-bold">{earningsData.today}</div>
                <p className="text-xs text-muted-foreground">From 3 completed deliveries</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">This Week</h3>
                <div className="text-2xl font-bold">{earningsData.week}</div>
                <p className="text-xs text-muted-foreground">From 15 completed deliveries</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">This Month</h3>
                <div className="text-2xl font-bold">{earningsData.month}</div>
                <p className="text-xs text-muted-foreground">From 42 completed deliveries</p>
              </div>
              
              <Separator />
              
              <Button variant="outline" className="w-full">View Earnings History</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
