import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, Clock, DollarSign, MapPin, TrendingUp, User, Calendar, Loader2 } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { DeliveryDriver } from '@/models/deliveryDriver';
import { toast } from 'sonner';

const DeliveryDashboard = () => {
  const { currentUser } = useAuth();
  const [deliveryDriver, setDeliveryDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeOrders, setActiveOrders] = useState([]);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [recentDeliveries, setRecentDeliveries] = useState([]);
  const [earningsData, setEarningsData] = useState({
    today: "$0.00",
    week: "$0.00",
    month: "$0.00"
  });

  useEffect(() => {
    const fetchDeliveryDriver = async () => {
      try {
        setLoading(true);
        const driverData = await DeliveryDriver.getDeliveryDriverByFirebaseUid(currentUser.uid);
        setDeliveryDriver(driverData);
        
        // Fetch all data in parallel
        const [active, available, recent, earnings] = await Promise.all([
          driverData.getActiveDeliveries(),
          driverData.getAvailableOrders(),
          driverData.getRecentDeliveries(),
          driverData.getEarnings()
        ]);
        
        setActiveOrders(active);
        setAvailableOrders(available);
        setRecentDeliveries(recent);
        setEarningsData(earnings);
      } catch (error) {
        setError(error.message);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchDeliveryDriver();
    }
  }, [currentUser]);

  const handleAcceptOrder = async (orderId) => {
    try {
      await deliveryDriver.acceptOrder(orderId);
      const [active, available] = await Promise.all([
        deliveryDriver.getActiveDeliveries(),
        deliveryDriver.getAvailableOrders()
      ]);
      setActiveOrders(active);
      setAvailableOrders(available);
      toast.success('Order accepted successfully');
    } catch (error) {
      toast.error('Failed to accept order');
    }
  };

  const handleCompleteDelivery = async (orderId) => {
    try {
      await deliveryDriver.completeDelivery(orderId);
      const [active, recent, earnings] = await Promise.all([
        deliveryDriver.getActiveDeliveries(),
        deliveryDriver.getRecentDeliveries(),
        deliveryDriver.getEarnings()
      ]);
      setActiveOrders(active);
      setRecentDeliveries(recent);
      setEarningsData(earnings);
      toast.success('Delivery completed successfully');
    } catch (error) {
      toast.error('Failed to complete delivery');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

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
                            <Button 
                              variant="default"
                              onClick={() => handleCompleteDelivery(order.id)}
                            >
                              Mark as Delivered
                            </Button>
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
                        
                        <Button 
                          variant="default" 
                          className="w-full"
                          onClick={() => handleAcceptOrder(order.id)}
                        >
                          Accept Order
                        </Button>
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
                <p className="text-xs text-muted-foreground">From {recentDeliveries.length} completed deliveries</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">This Week</h3>
                <div className="text-2xl font-bold">{earningsData.week}</div>
                <p className="text-xs text-muted-foreground">From {earningsData.weekDeliveries || 0} completed deliveries</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">This Month</h3>
                <div className="text-2xl font-bold">{earningsData.month}</div>
                <p className="text-xs text-muted-foreground">From {earningsData.monthDeliveries || 0} completed deliveries</p>
              </div>
              
              <Button variant="outline" className="w-full">View Earnings History</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
