
import React from 'react';
import MainLayout from "@/layouts/MainLayout";
import MapTracking from "@/components/tracking/MapTracking";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  PhoneCall, 
  MessageSquare, 
  PanelLeft, 
  ShoppingBag, 
  Navigation, 
  MapPin 
} from "lucide-react";

const TrackingPage = () => {
  // In a real app, this would be data from Firestore
  const orderDetails = {
    id: "ORD-2023-0568",
    status: "In Transit",
    restaurant: "Zambian Flavors",
    restaurantAddress: "Cairo Road, Lusaka",
    deliveryAddress: "Plot 123, Great East Road, Lusaka",
    customerName: "Michael Sata",
    driverName: "David Mwila",
    driverPhone: "+260 97 123 4567",
    estimatedDelivery: "12:45 PM",
    items: [
      { name: "Nshima with Chicken Stew", quantity: 1, price: 75 },
      { name: "Village Chicken", quantity: 1, price: 85 },
      { name: "Mundkoyo", quantity: 2, price: 25 }
    ],
    subtotal: 210,
    deliveryFee: 25,
    total: 235
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          <div className="lg:w-3/5">
            <h1 className="text-3xl font-bold mb-4">Track Your Order</h1>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <div className="text-lg">Order <span className="font-medium">{orderDetails.id}</span></div>
                <div className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 px-3 py-1 rounded-full text-sm font-medium">
                  {orderDetails.status}
                </div>
              </div>
              <div className="text-muted-foreground">
                Estimated delivery: {orderDetails.estimatedDelivery}
              </div>
            </div>

            <MapTracking 
              restaurantLocation={{ lat: -15.4007, lng: 28.3194 }}
              deliveryLocation={{ lat: -15.3875, lng: 28.3228 }}
              driverLocation={{ lat: -15.3942, lng: 28.3211 }}
              estimatedTime="15-25 min"
              distance="4.8 km"
            />

            <div className="mt-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="font-medium">{orderDetails.driverName}</div>
                      <div className="text-sm text-muted-foreground">Your delivery partner</div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Message
                      </Button>
                      <Button variant="default" size="sm" className="gap-2">
                        <PhoneCall className="h-4 w-4" />
                        Call
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="lg:w-2/5">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Details</h2>
                
                <div className="mb-4 pb-4 border-b">
                  <div className="flex items-start gap-2 mb-2">
                    <PanelLeft className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">{orderDetails.restaurant}</h3>
                      <p className="text-sm text-muted-foreground">{orderDetails.restaurantAddress}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Delivery Address</h3>
                      <p className="text-sm text-muted-foreground">{orderDetails.deliveryAddress}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4 pb-4 border-b">
                  <h3 className="font-medium mb-2">Order Summary</h3>
                  <div className="space-y-2">
                    {orderDetails.items.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <div>
                          <span className="text-sm font-medium">{item.quantity}x </span>
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <div className="text-sm font-medium">K{item.price.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>K{orderDetails.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery Fee</span>
                    <span>K{orderDetails.deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t mt-2">
                    <span>Total</span>
                    <span>K{orderDetails.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TrackingPage;
