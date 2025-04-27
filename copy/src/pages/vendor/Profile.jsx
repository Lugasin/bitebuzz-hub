
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { BurgerIcon } from "@/components/ui/icons";

const VendorProfile = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <BurgerIcon className="h-6 w-6 mr-2 text-orange-500" />
        <h1 className="text-2xl font-bold">E-eats Vendor Profile</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-4">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarImage src={currentUser?.photoURL || ""} alt="Profile" />
                <AvatarFallback className="text-lg">{currentUser?.displayName?.[0] || "V"}</AvatarFallback>
              </Avatar>
              <CardTitle>{currentUser?.displayName || "Vendor Name"}</CardTitle>
              <CardDescription>{currentUser?.email || "vendor@example.com"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Account Type</span>
                <span className="font-medium bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs">Vendor</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Member Since</span>
                <span className="font-medium">June 2023</span>
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
              <CardTitle>Restaurant Information</CardTitle>
              <CardDescription>Update your restaurant details and public information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="restaurantName">Restaurant Name</Label>
                  <Input id="restaurantName" defaultValue="Burger Palace" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cuisine">Cuisine Type</Label>
                  <Input id="cuisine" defaultValue="Fast Food, Burgers" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Restaurant Description</Label>
                <Input id="description" defaultValue="Serving the juiciest burgers in town since 2010" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Contact Phone</Label>
                  <Input id="phone" defaultValue="+1 234 567 8901" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Contact Email</Label>
                  <Input id="email" defaultValue={currentUser?.email || "burgerpalace@example.com"} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Restaurant Address</Label>
                <Input id="address" defaultValue="123 Food Street, Foodville, CA 90210" />
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <Label htmlFor="deliveryRadius">Delivery Radius (miles)</Label>
                <Input id="deliveryRadius" type="number" defaultValue="5" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deliveryFee">Delivery Fee ($)</Label>
                <Input id="deliveryFee" type="number" defaultValue="2.99" step="0.01" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minOrder">Minimum Order Amount ($)</Label>
                <Input id="minOrder" type="number" defaultValue="10.00" step="0.01" />
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

export default VendorProfile;
