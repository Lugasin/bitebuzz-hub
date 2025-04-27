
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Truck } from "lucide-react";

const DeliveryProfile = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <div className="flex items-center mb-6">
        <Truck className="h-6 w-6 mr-2 text-orange-500" />
        <h1 className="text-2xl font-bold">E-eats Delivery Profile</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-4">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarImage src={currentUser?.photoURL || ""} alt="Profile" />
                <AvatarFallback className="text-lg">{currentUser?.displayName?.[0] || "D"}</AvatarFallback>
              </Avatar>
              <CardTitle>{currentUser?.displayName || "Delivery Partner"}</CardTitle>
              <CardDescription>{currentUser?.email || "delivery@example.com"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Account Type</span>
                <span className="font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Delivery</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Member Since</span>
                <span className="font-medium">January 2023</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Status</span>
                <span className="font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Active</span>
              </div>
              <Button variant="outline" className="w-full">Edit Profile Photo</Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Partner Information</CardTitle>
              <CardDescription>Update your personal details and delivery preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Rider" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+1 234 567 8901" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue={currentUser?.email || "delivery@example.com"} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Home Address</Label>
                <Input id="address" defaultValue="123 Delivery Street, Anytown, CA 90210" />
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Input id="vehicleType" defaultValue="Motorcycle" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vehicleModel">Vehicle Model</Label>
                <Input id="vehicleModel" defaultValue="Honda CBR 150R" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="licensePlate">License Plate</Label>
                <Input id="licensePlate" defaultValue="DEL-1234" />
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Delivery Preferences</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="available">Available for Deliveries</Label>
                    <p className="text-sm text-muted-foreground">Turn off when you're not working</p>
                  </div>
                  <Switch id="available" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts for new orders</p>
                  </div>
                  <Switch id="notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sounds">Sound Alerts</Label>
                    <p className="text-sm text-muted-foreground">Play sounds for new orders</p>
                  </div>
                  <Switch id="sounds" defaultChecked />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DeliveryProfile;
