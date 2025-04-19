
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import {
  User,
  Settings,
  LogOut,
  Edit,
  Upload,
  MapPin,
  Clock,
  Save,
  Building,
  Phone,
  Mail,
  Image
} from "lucide-react";

// Mock restaurant data
const restaurantData = {
  name: "Chicken King",
  description: "Specializing in delicious fried chicken with our secret blend of spices. Enjoy juicy, crispy chicken that's always fresh and hot.",
  address: "123 Main St, City, State",
  phone: "+1 (123) 456-7890",
  email: "contact@chickenking.com",
  openingHours: {
    monday: { open: "09:00", close: "22:00", isOpen: true },
    tuesday: { open: "09:00", close: "22:00", isOpen: true },
    wednesday: { open: "09:00", close: "22:00", isOpen: true },
    thursday: { open: "09:00", close: "22:00", isOpen: true },
    friday: { open: "09:00", close: "23:00", isOpen: true },
    saturday: { open: "10:00", close: "23:00", isOpen: true },
    sunday: { open: "10:00", close: "21:00", isOpen: true }
  },
  cuisines: ["Chicken", "Fast Food"],
  deliveryFee: 30,
  minimumOrder: 100,
  preparationTime: 25,
  logo: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
  coverImage: "https://images.unsplash.com/photo-1513639595782-31f25c297fdc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80"
};

const VendorProfile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("restaurant");
  const [restaurantInfo, setRestaurantInfo] = useState(restaurantData);
  const [openingHours, setOpeningHours] = useState(restaurantData.openingHours);
  
  const handleRestaurantInfoChange = (e) => {
    const { name, value } = e.target;
    setRestaurantInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleHoursChange = (day, field, value) => {
    setOpeningHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };
  
  const toggleDayOpen = (day) => {
    setOpeningHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        isOpen: !prev[day].isOpen
      }
    }));
  };
  
  const handleProfileUpdate = () => {
    // Update restaurant info with opening hours
    const updatedInfo = {
      ...restaurantInfo,
      openingHours
    };
    
    // In a real app, this would save to the database
    console.log("Saving restaurant info:", updatedInfo);
    
    toast({
      title: "Profile updated",
      description: "Your restaurant information has been updated successfully.",
    });
  };
  
  const handleLogout = () => {
    logout();
    navigate("/");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };
  
  const getInitials = (name) => {
    if (!name) return "R";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Restaurant Profile</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="col-span-1">
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={restaurantInfo.logo} alt={restaurantInfo.name} />
                      <AvatarFallback>{getInitials(restaurantInfo.name)}</AvatarFallback>
                    </Avatar>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="absolute bottom-0 right-0 rounded-full bg-background"
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  <h2 className="text-xl font-bold mb-1">{restaurantInfo.name}</h2>
                  <p className="text-sm text-muted-foreground mb-4">{currentUser?.email}</p>
                  
                  <div className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full mb-4">
                    Restaurant Owner
                  </div>
                  
                  <Button variant="outline" className="w-full" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-0">
                <div className="flex flex-col">
                  <Button 
                    variant={activeTab === "restaurant" ? "default" : "ghost"} 
                    className="justify-start rounded-none h-14"
                    onClick={() => setActiveTab("restaurant")}
                  >
                    <Building className="h-5 w-5 mr-2" />
                    Restaurant Info
                  </Button>
                  <Button 
                    variant={activeTab === "hours" ? "default" : "ghost"} 
                    className="justify-start rounded-none h-14"
                    onClick={() => setActiveTab("hours")}
                  >
                    <Clock className="h-5 w-5 mr-2" />
                    Opening Hours
                  </Button>
                  <Button 
                    variant={activeTab === "location" ? "default" : "ghost"} 
                    className="justify-start rounded-none h-14"
                    onClick={() => setActiveTab("location")}
                  >
                    <MapPin className="h-5 w-5 mr-2" />
                    Location & Delivery
                  </Button>
                  <Button 
                    variant={activeTab === "images" ? "default" : "ghost"} 
                    className="justify-start rounded-none h-14"
                    onClick={() => setActiveTab("images")}
                  >
                    <Image className="h-5 w-5 mr-2" />
                    Images
                  </Button>
                  <Button 
                    variant={activeTab === "account" ? "default" : "ghost"} 
                    className="justify-start rounded-none h-14"
                    onClick={() => setActiveTab("account")}
                  >
                    <User className="h-5 w-5 mr-2" />
                    Account Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="col-span-1 lg:col-span-3">
            <Card>
              <CardContent className="p-6">
                {/* Restaurant Information */}
                {activeTab === "restaurant" && (
                  <div>
                    <h2 className="text-xl font-bold mb-6">Restaurant Information</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Restaurant Name</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          value={restaurantInfo.name}
                          onChange={handleRestaurantInfoChange}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea 
                          id="description" 
                          name="description" 
                          rows={4}
                          value={restaurantInfo.description}
                          onChange={handleRestaurantInfoChange}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              id="phone" 
                              name="phone" 
                              className="pl-10"
                              value={restaurantInfo.phone}
                              onChange={handleRestaurantInfoChange}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              id="email" 
                              name="email" 
                              className="pl-10"
                              value={restaurantInfo.email}
                              onChange={handleRestaurantInfoChange}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="cuisines">Cuisine Types (comma separated)</Label>
                        <Input 
                          id="cuisines" 
                          name="cuisines" 
                          value={Array.isArray(restaurantInfo.cuisines) ? restaurantInfo.cuisines.join(", ") : restaurantInfo.cuisines}
                          onChange={(e) => {
                            const cuisinesArray = e.target.value.split(",").map(item => item.trim());
                            setRestaurantInfo(prev => ({
                              ...prev,
                              cuisines: cuisinesArray
                            }));
                          }}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="deliveryFee">Delivery Fee (K)</Label>
                          <Input 
                            id="deliveryFee" 
                            name="deliveryFee" 
                            type="number"
                            value={restaurantInfo.deliveryFee}
                            onChange={handleRestaurantInfoChange}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="minimumOrder">Minimum Order (K)</Label>
                          <Input 
                            id="minimumOrder" 
                            name="minimumOrder" 
                            type="number"
                            value={restaurantInfo.minimumOrder}
                            onChange={handleRestaurantInfoChange}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="preparationTime">Preparation Time (min)</Label>
                          <Input 
                            id="preparationTime" 
                            name="preparationTime" 
                            type="number"
                            value={restaurantInfo.preparationTime}
                            onChange={handleRestaurantInfoChange}
                          />
                        </div>
                      </div>
                      
                      <Button onClick={handleProfileUpdate}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Opening Hours */}
                {activeTab === "hours" && (
                  <div>
                    <h2 className="text-xl font-bold mb-6">Opening Hours</h2>
                    
                    <div className="space-y-4">
                      {Object.entries(openingHours).map(([day, hours]) => (
                        <div key={day} className="flex items-center gap-4 pb-4 border-b">
                          <div className="w-1/4">
                            <Label className="capitalize">{day}</Label>
                          </div>
                          
                          <div className="flex items-center gap-4 w-3/4">
                            <Button 
                              variant={hours.isOpen ? "default" : "outline"} 
                              size="sm"
                              className="w-24"
                              onClick={() => toggleDayOpen(day)}
                            >
                              {hours.isOpen ? "Open" : "Closed"}
                            </Button>
                            
                            {hours.isOpen && (
                              <>
                                <div className="flex items-center gap-2">
                                  <Input 
                                    type="time" 
                                    className="w-32"
                                    value={hours.open}
                                    onChange={(e) => handleHoursChange(day, "open", e.target.value)}
                                  />
                                  <span>to</span>
                                  <Input 
                                    type="time" 
                                    className="w-32"
                                    value={hours.close}
                                    onChange={(e) => handleHoursChange(day, "close", e.target.value)}
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      <Button onClick={handleProfileUpdate}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Hours
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Location & Delivery */}
                {activeTab === "location" && (
                  <div>
                    <h2 className="text-xl font-bold mb-6">Location & Delivery</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Textarea 
                          id="address" 
                          name="address" 
                          value={restaurantInfo.address}
                          onChange={handleRestaurantInfoChange}
                          rows={2}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input 
                            id="city" 
                            name="city" 
                            placeholder="City"
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State/Province</Label>
                          <Input 
                            id="state" 
                            name="state" 
                            placeholder="State/Province"
                          />
                        </div>
                        <div>
                          <Label htmlFor="postalCode">Postal Code</Label>
                          <Input 
                            id="postalCode" 
                            name="postalCode" 
                            placeholder="Postal Code"
                          />
                        </div>
                      </div>
                      
                      <div className="h-64 bg-muted rounded-md flex items-center justify-center">
                        <p className="text-muted-foreground">Map will be displayed here</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Delivery Area</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          <Button variant="outline" className="justify-start">Chilenje</Button>
                          <Button variant="outline" className="justify-start">Kabulonga</Button>
                          <Button variant="outline" className="justify-start">Northmead</Button>
                          <Button variant="outline" className="justify-start">Add Area +</Button>
                        </div>
                      </div>
                      
                      <Button onClick={handleProfileUpdate}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Location
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Images */}
                {activeTab === "images" && (
                  <div>
                    <h2 className="text-xl font-bold mb-6">Restaurant Images</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <Label className="block mb-2">Logo</Label>
                        <div className="flex items-start gap-4">
                          <div className="h-32 w-32 rounded-md overflow-hidden">
                            <img 
                              src={restaurantInfo.logo} 
                              alt="Restaurant Logo" 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="space-y-2">
                            <Button variant="outline">
                              <Upload className="h-4 w-4 mr-2" />
                              Change Logo
                            </Button>
                            <p className="text-xs text-muted-foreground">
                              Recommended: Square image, 500x500px minimum
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="block mb-2">Cover Image</Label>
                        <div className="flex items-start gap-4">
                          <div className="h-32 w-64 rounded-md overflow-hidden">
                            <img 
                              src={restaurantInfo.coverImage} 
                              alt="Restaurant Cover" 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="space-y-2">
                            <Button variant="outline">
                              <Upload className="h-4 w-4 mr-2" />
                              Change Cover
                            </Button>
                            <p className="text-xs text-muted-foreground">
                              Recommended: 16:9 ratio, 1200x675px minimum
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="block mb-2">Menu & Food Images</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="aspect-square bg-muted rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
                            <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Upload</span>
                          </div>
                          
                          {/* Sample images */}
                          <div className="aspect-square rounded-md overflow-hidden relative group">
                            <img 
                              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80" 
                              alt="Food item" 
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="secondary" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="aspect-square rounded-md overflow-hidden relative group">
                            <img 
                              src="https://images.unsplash.com/photo-1608039755401-742074f0548d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80" 
                              alt="Food item" 
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="secondary" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="aspect-square rounded-md overflow-hidden relative group">
                            <img 
                              src="https://images.unsplash.com/photo-1610614819513-58e34989e367?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80" 
                              alt="Food item" 
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="secondary" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Button onClick={handleProfileUpdate}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Images
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Account Settings */}
                {activeTab === "account" && (
                  <div>
                    <h2 className="text-xl font-bold mb-6">Account Settings</h2>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="ownerFirstName">Owner First Name</Label>
                          <Input 
                            id="ownerFirstName" 
                            name="ownerFirstName" 
                            placeholder="First Name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="ownerLastName">Owner Last Name</Label>
                          <Input 
                            id="ownerLastName" 
                            name="ownerLastName" 
                            placeholder="Last Name"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="ownerEmail">Email</Label>
                        <Input 
                          id="ownerEmail" 
                          name="ownerEmail" 
                          type="email"
                          value={currentUser?.email}
                          disabled
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Contact support to change your email address
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="ownerPhone">Phone Number</Label>
                          <Input 
                            id="ownerPhone" 
                            name="ownerPhone" 
                            placeholder="Phone Number"
                          />
                        </div>
                        <div>
                          <Label htmlFor="alternatePhone">Alternate Phone</Label>
                          <Input 
                            id="alternatePhone" 
                            name="alternatePhone" 
                            placeholder="Alternate Phone"
                          />
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t mt-4">
                        <h3 className="font-medium mb-4">Account Security</h3>
                        <Button variant="outline">
                          <Settings className="h-4 w-4 mr-2" />
                          Change Password
                        </Button>
                      </div>
                      
                      <div className="pt-4 border-t mt-4">
                        <h3 className="font-medium mb-4 text-destructive">Danger Zone</h3>
                        <Button variant="destructive">
                          Deactivate Restaurant
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default VendorProfile;
