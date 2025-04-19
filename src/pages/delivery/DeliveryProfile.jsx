
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import {
  User,
  Settings,
  LogOut,
  Upload,
  Truck,
  Phone,
  Mail,
  Save,
  Clock,
  MapPin,
  Wallet,
  Shield,
  BarChart,
  FileText
} from "lucide-react";

// Mock delivery partner data
const deliveryPartnerData = {
  firstName: "John",
  lastName: "Smith",
  email: "john.smith@example.com",
  phone: "+1 (123) 456-7895",
  address: "456 Delivery St, Apt 7B, City, State",
  vehicleType: "motorcycle",
  vehicleInfo: "Red Honda Bike",
  licensePlate: "ABC123",
  licenseNumber: "DL123456789",
  emergencyContact: "+1 (123) 456-7899",
  workingHours: {
    monday: { isWorking: true, start: "09:00", end: "17:00" },
    tuesday: { isWorking: true, start: "09:00", end: "17:00" },
    wednesday: { isWorking: true, start: "09:00", end: "17:00" },
    thursday: { isWorking: true, start: "09:00", end: "17:00" },
    friday: { isWorking: true, start: "09:00", end: "17:00" },
    saturday: { isWorking: false, start: "10:00", end: "15:00" },
    sunday: { isWorking: false, start: "10:00", end: "15:00" }
  },
  isOnline: true,
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  deliveryRadius: 5,
  bankInfo: {
    accountName: "John Smith",
    accountNumber: "1234567890",
    bankName: "National Bank"
  },
  stats: {
    deliveriesCompleted: 345,
    averageRating: 4.8,
    cancellationRate: "2%",
    onTimeRate: "98%"
  }
};

const DeliveryProfile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("personal");
  const [partnerInfo, setPartnerInfo] = useState(deliveryPartnerData);
  const [workingHours, setWorkingHours] = useState(deliveryPartnerData.workingHours);
  const [isOnline, setIsOnline] = useState(deliveryPartnerData.isOnline);
  
  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setPartnerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNestedInfoChange = (category, field, value) => {
    setPartnerInfo(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };
  
  const handleWorkingHoursChange = (day, field, value) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };
  
  const toggleWorkingDay = (day) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        isWorking: !prev[day].isWorking
      }
    }));
  };
  
  const handleProfileUpdate = () => {
    // Update partner info with working hours
    const updatedInfo = {
      ...partnerInfo,
      workingHours,
      isOnline
    };
    
    // In a real app, this would save to the database
    console.log("Saving partner info:", updatedInfo);
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
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
  
  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
    
    toast({
      title: isOnline ? "You are now offline" : "You are now online",
      description: isOnline 
        ? "You won't receive new delivery requests" 
        : "You will start receiving delivery requests",
    });
  };
  
  const getInitials = (firstName, lastName) => {
    if (!firstName || !lastName) return "DP";
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Delivery Partner Profile</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="col-span-1">
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={partnerInfo.avatar} alt={`${partnerInfo.firstName} ${partnerInfo.lastName}`} />
                      <AvatarFallback>{getInitials(partnerInfo.firstName, partnerInfo.lastName)}</AvatarFallback>
                    </Avatar>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="absolute bottom-0 right-0 rounded-full bg-background"
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  <h2 className="text-xl font-bold mb-1">{partnerInfo.firstName} {partnerInfo.lastName}</h2>
                  <p className="text-sm text-muted-foreground mb-2">{currentUser?.email}</p>
                  
                  <div className="mb-4 flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm font-medium">{isOnline ? 'Online' : 'Offline'}</span>
                  </div>
                  
                  <div className="w-full">
                    <Button 
                      variant={isOnline ? "default" : "outline"} 
                      className="w-full mb-2"
                      onClick={toggleOnlineStatus}
                    >
                      {isOnline ? "Go Offline" : "Go Online"}
                    </Button>
                    <Button variant="outline" className="w-full" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-0">
                <div className="flex flex-col">
                  <Button 
                    variant={activeTab === "personal" ? "default" : "ghost"} 
                    className="justify-start rounded-none h-14"
                    onClick={() => setActiveTab("personal")}
                  >
                    <User className="h-5 w-5 mr-2" />
                    Personal Information
                  </Button>
                  <Button 
                    variant={activeTab === "vehicle" ? "default" : "ghost"} 
                    className="justify-start rounded-none h-14"
                    onClick={() => setActiveTab("vehicle")}
                  >
                    <Truck className="h-5 w-5 mr-2" />
                    Vehicle Details
                  </Button>
                  <Button 
                    variant={activeTab === "schedule" ? "default" : "ghost"} 
                    className="justify-start rounded-none h-14"
                    onClick={() => setActiveTab("schedule")}
                  >
                    <Clock className="h-5 w-5 mr-2" />
                    Working Schedule
                  </Button>
                  <Button 
                    variant={activeTab === "earnings" ? "default" : "ghost"} 
                    className="justify-start rounded-none h-14"
                    onClick={() => setActiveTab("earnings")}
                  >
                    <Wallet className="h-5 w-5 mr-2" />
                    Earnings & Banking
                  </Button>
                  <Button 
                    variant={activeTab === "documents" ? "default" : "ghost"} 
                    className="justify-start rounded-none h-14"
                    onClick={() => setActiveTab("documents")}
                  >
                    <FileText className="h-5 w-5 mr-2" />
                    Documents
                  </Button>
                  <Button 
                    variant={activeTab === "settings" ? "default" : "ghost"} 
                    className="justify-start rounded-none h-14"
                    onClick={() => setActiveTab("settings")}
                  >
                    <Settings className="h-5 w-5 mr-2" />
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
                {/* Personal Information */}
                {activeTab === "personal" && (
                  <div>
                    <h2 className="text-xl font-bold mb-6">Personal Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="p-4 bg-muted/50 rounded-md flex items-center">
                        <BarChart className="h-10 w-10 text-primary mr-4" />
                        <div>
                          <h3 className="font-medium">Deliveries Completed</h3>
                          <p className="text-2xl font-bold">{partnerInfo.stats.deliveriesCompleted}</p>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-muted/50 rounded-md flex items-center">
                        <Star className="h-10 w-10 text-yellow-500 mr-4" />
                        <div>
                          <h3 className="font-medium">Average Rating</h3>
                          <p className="text-2xl font-bold">{partnerInfo.stats.averageRating}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input 
                            id="firstName" 
                            name="firstName" 
                            value={partnerInfo.firstName}
                            onChange={handleInfoChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input 
                            id="lastName" 
                            name="lastName" 
                            value={partnerInfo.lastName}
                            onChange={handleInfoChange}
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
                            type="email"
                            className="pl-10"
                            value={partnerInfo.email}
                            onChange={handleInfoChange}
                            disabled
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Contact support to change your email address
                        </p>
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
                              value={partnerInfo.phone}
                              onChange={handleInfoChange}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="emergencyContact">Emergency Contact</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              id="emergencyContact" 
                              name="emergencyContact" 
                              className="pl-10"
                              value={partnerInfo.emergencyContact}
                              onChange={handleInfoChange}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Textarea 
                            id="address" 
                            name="address" 
                            className="pl-10 min-h-[80px]"
                            value={partnerInfo.address}
                            onChange={handleInfoChange}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="deliveryRadius">Delivery Radius (km)</Label>
                        <Input 
                          id="deliveryRadius" 
                          name="deliveryRadius" 
                          type="number"
                          value={partnerInfo.deliveryRadius}
                          onChange={handleInfoChange}
                        />
                      </div>
                      
                      <Button onClick={handleProfileUpdate}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Vehicle Details */}
                {activeTab === "vehicle" && (
                  <div>
                    <h2 className="text-xl font-bold mb-6">Vehicle Details</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="vehicleType">Vehicle Type</Label>
                        <Select
                          value={partnerInfo.vehicleType}
                          onValueChange={(value) => setPartnerInfo(prev => ({ ...prev, vehicleType: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select vehicle type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bicycle">Bicycle</SelectItem>
                            <SelectItem value="motorcycle">Motorcycle</SelectItem>
                            <SelectItem value="car">Car</SelectItem>
                            <SelectItem value="scooter">Scooter</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="vehicleInfo">Vehicle Description</Label>
                        <Input 
                          id="vehicleInfo" 
                          name="vehicleInfo" 
                          placeholder="e.g., Red Honda Motorcycle"
                          value={partnerInfo.vehicleInfo}
                          onChange={handleInfoChange}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="licensePlate">License Plate</Label>
                          <Input 
                            id="licensePlate" 
                            name="licensePlate" 
                            value={partnerInfo.licensePlate}
                            onChange={handleInfoChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="licenseNumber">Driver's License Number</Label>
                          <Input 
                            id="licenseNumber" 
                            name="licenseNumber" 
                            value={partnerInfo.licenseNumber}
                            onChange={handleInfoChange}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label className="block mb-2">Vehicle Photos</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="aspect-[4/3] bg-muted rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
                            <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Front View</span>
                          </div>
                          
                          <div className="aspect-[4/3] bg-muted rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
                            <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Side View</span>
                          </div>
                          
                          <div className="aspect-[4/3] bg-muted rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
                            <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Rear View</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button onClick={handleProfileUpdate}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Vehicle Details
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Working Schedule */}
                {activeTab === "schedule" && (
                  <div>
                    <h2 className="text-xl font-bold mb-6">Working Schedule</h2>
                    
                    <div className="space-y-4">
                      {Object.entries(workingHours).map(([day, hours]) => (
                        <div key={day} className="flex items-center gap-4 pb-4 border-b">
                          <div className="w-1/4">
                            <Label className="capitalize">{day}</Label>
                          </div>
                          
                          <div className="flex items-center gap-4 w-3/4">
                            <Button 
                              variant={hours.isWorking ? "default" : "outline"} 
                              size="sm"
                              className="w-24"
                              onClick={() => toggleWorkingDay(day)}
                            >
                              {hours.isWorking ? "Working" : "Off"}
                            </Button>
                            
                            {hours.isWorking && (
                              <>
                                <div className="flex items-center gap-2">
                                  <Input 
                                    type="time" 
                                    className="w-32"
                                    value={hours.start}
                                    onChange={(e) => handleWorkingHoursChange(day, "start", e.target.value)}
                                  />
                                  <span>to</span>
                                  <Input 
                                    type="time" 
                                    className="w-32"
                                    value={hours.end}
                                    onChange={(e) => handleWorkingHoursChange(day, "end", e.target.value)}
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      <Button onClick={handleProfileUpdate}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Schedule
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Earnings & Banking */}
                {activeTab === "earnings" && (
                  <div>
                    <h2 className="text-xl font-bold mb-6">Earnings & Banking Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 bg-muted/50 rounded-md text-center">
                        <h3 className="text-sm font-medium mb-1 text-muted-foreground">Today's Earnings</h3>
                        <p className="text-2xl font-bold">K250</p>
                      </div>
                      
                      <div className="p-4 bg-muted/50 rounded-md text-center">
                        <h3 className="text-sm font-medium mb-1 text-muted-foreground">This Week</h3>
                        <p className="text-2xl font-bold">K1,550</p>
                      </div>
                      
                      <div className="p-4 bg-muted/50 rounded-md text-center">
                        <h3 className="text-sm font-medium mb-1 text-muted-foreground">This Month</h3>
                        <p className="text-2xl font-bold">K5,870</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg">Banking Details</h3>
                      
                      <div>
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input 
                          id="bankName" 
                          value={partnerInfo.bankInfo.bankName}
                          onChange={(e) => handleNestedInfoChange("bankInfo", "bankName", e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="accountName">Account Holder Name</Label>
                        <Input 
                          id="accountName" 
                          value={partnerInfo.bankInfo.accountName}
                          onChange={(e) => handleNestedInfoChange("bankInfo", "accountName", e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input 
                          id="accountNumber" 
                          value={partnerInfo.bankInfo.accountNumber}
                          onChange={(e) => handleNestedInfoChange("bankInfo", "accountNumber", e.target.value)}
                        />
                      </div>
                      
                      <Button onClick={handleProfileUpdate}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Banking Information
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Documents */}
                {activeTab === "documents" && (
                  <div>
                    <h2 className="text-xl font-bold mb-6">Documents</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-2 flex items-center">
                          <Shield className="h-5 w-5 mr-2 text-primary" />
                          Identity Verification
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="block mb-2">National ID Card</Label>
                            <div className="aspect-[4/3] bg-muted rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
                              <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">Upload Front</span>
                            </div>
                          </div>
                          
                          <div>
                            <Label className="block mb-2">National ID (Back)</Label>
                            <div className="aspect-[4/3] bg-muted rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
                              <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">Upload Back</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2 flex items-center">
                          <Truck className="h-5 w-5 mr-2 text-primary" />
                          Vehicle Documents
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="block mb-2">Driver's License</Label>
                            <div className="aspect-[4/3] bg-muted rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
                              <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">Upload License</span>
                            </div>
                          </div>
                          
                          <div>
                            <Label className="block mb-2">Vehicle Registration</Label>
                            <div className="aspect-[4/3] bg-muted rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
                              <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">Upload Registration</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2 flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-primary" />
                          Other Documents
                        </h3>
                        
                        <div className="space-y-2">
                          <div className="p-4 border rounded-md flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">Insurance Certificate</h4>
                              <p className="text-xs text-muted-foreground">Not uploaded</p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Upload className="h-4 w-4 mr-2" />
                              Upload
                            </Button>
                          </div>
                          
                          <div className="p-4 border rounded-md flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">Background Check Consent</h4>
                              <p className="text-xs text-muted-foreground">Not uploaded</p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Upload className="h-4 w-4 mr-2" />
                              Upload
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <Button onClick={handleProfileUpdate}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Documents
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Account Settings */}
                {activeTab === "settings" && (
                  <div>
                    <h2 className="text-xl font-bold mb-6">Account Settings</h2>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="font-medium">Notification Preferences</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="orderAlerts">New Order Alerts</Label>
                              <p className="text-sm text-muted-foreground">Receive alerts for new orders</p>
                            </div>
                            <Switch id="orderAlerts" defaultChecked />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="smsNotifications">SMS Notifications</Label>
                              <p className="text-sm text-muted-foreground">Receive SMS notifications</p>
                            </div>
                            <Switch id="smsNotifications" defaultChecked />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="emailNotifications">Email Notifications</Label>
                              <p className="text-sm text-muted-foreground">Receive email notifications</p>
                            </div>
                            <Switch id="emailNotifications" defaultChecked />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">App Settings</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="darkMode">Dark Mode</Label>
                              <p className="text-sm text-muted-foreground">Enable dark mode</p>
                            </div>
                            <Switch id="darkMode" />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="locationTracking">Background Location</Label>
                              <p className="text-sm text-muted-foreground">Allow location tracking in background</p>
                            </div>
                            <Switch id="locationTracking" defaultChecked />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">Account Security</h3>
                        
                        <div className="space-y-4">
                          <Button variant="outline">
                            <Settings className="h-4 w-4 mr-2" />
                            Change Password
                          </Button>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t mt-4">
                        <h3 className="font-medium mb-4 text-destructive">Danger Zone</h3>
                        <Button variant="destructive">
                          Deactivate Account
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

const Star = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
};

export default DeliveryProfile;
