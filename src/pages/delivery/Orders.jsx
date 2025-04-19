
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const DeliveryOrders = () => {
  // Sample delivery orders data
  const orders = [
    {
      id: "ORD-7429",
      customer: "Jane Smith",
      restaurant: "Burger Palace",
      address: "123 Main St, Anytown, USA",
      items: "2× Classic Burger, 1× Fries (Large), 1× Soda",
      total: "$28.97",
      status: "ready",
      time: "15 min ago"
    },
    {
      id: "ORD-8532",
      customer: "Mike Johnson",
      restaurant: "Pizza Heaven",
      address: "456 Oak Ave, Anytown, USA",
      items: "1× Large Pepperoni, 1× Garlic Knots",
      total: "$24.50",
      status: "preparing",
      time: "25 min ago"
    },
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'placed':
        return <Badge variant="outline" className="status-placed">Order Placed</Badge>;
      case 'preparing':
        return <Badge variant="outline" className="status-preparing">Preparing</Badge>;
      case 'ready':
        return <Badge variant="outline" className="status-ready">Ready for Pickup</Badge>;
      case 'transit':
        return <Badge variant="outline" className="status-transit">In Transit</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="status-delivered">Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="status-cancelled">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <h1 className="text-3xl font-bold mb-6">Delivery Orders</h1>
      
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Ready for pickup</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">In transit</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 from yesterday</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Current Orders</CardTitle>
          <CardDescription>Manage delivery orders and update status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="font-semibold">{order.id}</div>
                    {getStatusBadge(order.status)}
                    <div className="text-sm text-muted-foreground">{order.time}</div>
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
                  {order.status === 'ready' && (
                    <Button variant="default">Accept Delivery</Button>
                  )}
                  
                  {order.status === 'transit' && (
                    <>
                      <Button variant="default">Mark as Delivered</Button>
                      <Button variant="outline">Issue with Delivery</Button>
                    </>
                  )}
                  
                  <Button variant="outline">View Details</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryOrders;
