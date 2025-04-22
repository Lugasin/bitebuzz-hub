import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import {
  User,
  CreditCard,
  MapPin,
  Bell,
  Lock,
  LogOut,
  Edit,
  Trash2,
  Settings,
  Save,
  Eye,
  EyeOff,
  Home,
  Building,
  Briefcase,
  Upload
} from "lucide-react";

import EditProfile from "@/pages/customer/EditProfile";
import DeleteProfile from "@/pages/customer/DeleteProfile";

const Profile = () => {
  const { toast } = useToast();
  const { currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("personal");
  const [personalInfo, setPersonalInfo] = useState({
    firstName: currentUser?.displayName?.split(" ")[0] || "",
    lastName: currentUser?.displayName?.split(" ").slice(1).join(" ") || "",
    email: currentUser?.email || "",
    phone: currentUser?.phoneNumber || "",
    bio: "",
    location: "",
    profilePicture: null
  });
  useEffect(() => {
    setPersonalInfo({
        firstName: currentUser?.displayName?.split(" ")[0] || "",
        lastName: currentUser?.displayName?.split(" ").slice(1).join(" ") || "",
        email: currentUser?.email || "",
        phone: currentUser?.phoneNumber || "",
        profilePicture: currentUser?.photoURL,
    })
  });
  
  const [addresses, setAddresses] = useState([
    {
      id: "addr1",
      type: "home",
      name: "Home",
      address: "123 Main St, Apt 4B",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      isDefault: true
    },
    {
      id: "addr2",
      type: "work",
      name: "Office",
      address: "456 Business Ave, Floor 10",
      city: "New York",
      state: "NY",
      zipCode: "10002",
      isDefault: false
    }
  ]);
  
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: "pm1",
      type: "visa",
      name: "Visa ending in 1234",
      expiryDate: "05/25",
      isDefault: true
    },
    {
      id: "pm2",
      type: "mastercard",
      name: "Mastercard ending in 5678",
      expiryDate: "08/24",
      isDefault: false
    }
  ]);
  
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    newsletters: false,
    accountUpdates: true
  });
  
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [passwordFields, setPasswordFields] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  
  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
        setPersonalInfo(prev => ({
            ...prev,
            [name]: value,
        }));

  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordFields(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNotificationChange = (name, value) => {
    setNotifications(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleProfileUpdate = () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };
    const handlePictureUpdate = (e) => {
        const file = e.target.files[0];
        setPersonalInfo(prev => ({
            ...prev,
            profilePicture: URL.createObjectURL(file),
        }));
    };
  
  const handlePasswordUpdate = () => {
    if (passwordFields.new !== passwordFields.confirm) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirm password must match.",
        variant: "destructive"
      });
      return;
    }
    
    if (passwordFields.new.length < 8) {
      toast({
        title: "Password too short",
        description: "New password must be at least 8 characters long.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Password updated",
      description: "Your password has been updated successfully.",
    });
    
    setPasswordFields({
      current: "",
      new: "",
      confirm: ""
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
  
  const getAddressIcon = (type) => {
    switch (type) {
      case "home":
        return <Home className="h-5 w-5" />;
      case "work":
        return <Briefcase className="h-5 w-5" />;
      case "other":
        return <Building className="h-5 w-5" />;
      default:
        return <MapPin className="h-5 w-5" />;
    }
  };
  
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="col-span-1">
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={currentUser?.photoURL} alt={currentUser?.displayName || "User"} />
                      <AvatarFallback>{getInitials(currentUser?.displayName)}</AvatarFallback>
                    </Avatar>                        
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="absolute bottom-0 right-0 rounded-full bg-background"
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>

                  <h2 className="text-xl font-bold mb-1">{currentUser?.displayName || "User"}</h2>
                  <p className="text-sm text-muted-foreground mb-4">{currentUser?.email}</p>
                  
                  <div className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full mb-4">
                    {userRole === "customer" ? "Customer" : userRole === "vendor" ? "Vendor" : userRole === "delivery" ? "Delivery Partner" : "Admin"}
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
                    variant={activeTab === "personal" ? "default" : "ghost"} 
                    className="justify-start rounded-none h-14"
                    onClick={() => setActiveTab("personal")}
                  >
                    <User className="h-5 w-5 mr-2" />
                    Personal Information
                  </Button>
                  <Button 
                    variant={activeTab === "addresses" ? "default" : "ghost"} 
                    className="justify-start rounded-none h-14"
                    onClick={() => setActiveTab("addresses")}
                  >
                    <MapPin className="h-5 w-5 mr-2" />
                    Addresses
                  </Button>
                  <Button 
                    variant={activeTab === "payment" ? "default" : "ghost"} 
                    className="justify-start rounded-none h-14"
                    onClick={() => setActiveTab("payment")}
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment Methods
                  </Button>
                  <Button 
                    variant={activeTab === "notifications" ? "default" : "ghost"} 
                    className="justify-start rounded-none h-14"
                    onClick={() => setActiveTab("notifications")}
                  >
                    <Bell className="h-5 w-5 mr-2" />
                    Notifications
                  </Button>
                  <Button 
                    variant={activeTab === "security" ? "default" : "ghost"} 
                    className="justify-start rounded-none h-14"
                    onClick={() => setActiveTab("security")}
                  >
                    <Lock className="h-5 w-5 mr-2" />
                    Security
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
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input 
                            id="firstName" 
                            name="firstName" 
                            value={personalInfo.firstName}
                            onChange={handlePersonalInfoChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input 
                            id="lastName" 
                            name="lastName" 
                            value={personalInfo.lastName}
                            onChange={handlePersonalInfoChange}
                          />
                        </div>
                      </div>
                        <div>
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                name="location"
                                value={personalInfo.location}
                                onChange={handlePersonalInfoChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="profilePicture">Profile Picture</Label>
                            <input type="file" id="profilePicture" name="profilePicture" onChange={handlePictureUpdate} />

                        </div>

                      
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          value={personalInfo.email}
                          onChange={handlePersonalInfoChange}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          value={personalInfo.phone}
                          onChange={handlePersonalInfoChange}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="bio">About Me</Label>
                        <Textarea 
                          id="bio" 
                          name="bio" 
                          placeholder="Tell us a little about yourself" 
                          rows={4}
                          value={personalInfo.bio}
                          onChange={handlePersonalInfoChange}
                        />
                      </div>
                      
                      <Button onClick={handleProfileUpdate}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Addresses */}
                {activeTab === "addresses" && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold">Saved Addresses</h2>
                      <Button>
                        Add New Address
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <Card key={address.id}>
                          <CardContent className="p-4 flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className="mt-1 bg-primary/10 text-primary p-2 rounded-full">
                                {getAddressIcon(address.type)}
                              </div>
                              <div>
                                <div className="flex items-center">
                                  <h3 className="font-bold">{address.name}</h3>
                                  {address.isDefault && (
                                    <span className="ml-2 bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {address.address}, {address.city}, {address.state} {address.zipCode}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Link to="/customer/edit-profile">
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link to="/customer/delete-profile">
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Payment Methods */}
                {activeTab === "payment" && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold">Payment Methods</h2>
                      <Button>
                        Add New Card
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {paymentMethods.map((payment) => (
                        <Card key={payment.id}>
                          <CardContent className="p-4 flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className="mt-1 bg-primary/10 text-primary p-2 rounded-full">
                                <CreditCard className="h-5 w-5" />
                              </div>
                              <div>
                                <div className="flex items-center">
                                  <h3 className="font-bold">{payment.name}</h3>
                                  {payment.isDefault && (
                                    <span className="ml-2 bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Expires: {payment.expiryDate}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Link to="/customer/edit-profile">
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link to="/customer/delete-profile">
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Notifications */}
                {activeTab === "notifications" && (
                  <div>
                    <h2 className="text-xl font-bold mb-6">Notification Preferences</h2>
                    
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Order Updates</h3>
                          <p className="text-sm text-muted-foreground">
                            Get notified about your order status
                          </p>
                        </div>
                        <Switch 
                          checked={notifications.orderUpdates} 
                          onCheckedChange={(checked) => handleNotificationChange("orderUpdates", checked)} 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Promotions and Offers</h3>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications about special offers
                          </p>
                        </div>
                        <Switch 
                          checked={notifications.promotions} 
                          onCheckedChange={(checked) => handleNotificationChange("promotions", checked)} 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Newsletter</h3>
                          <p className="text-sm text-muted-foreground">
                            Get updates about new features and restaurants
                          </p>
                        </div>
                        <Switch 
                          checked={notifications.newsletters} 
                          onCheckedChange={(checked) => handleNotificationChange("newsletters", checked)} 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Account Updates</h3>
                          <p className="text-sm text-muted-foreground">
                            Important information about your account
                          </p>
                        </div>
                        <Switch 
                          checked={notifications.accountUpdates} 
                          onCheckedChange={(checked) => handleNotificationChange("accountUpdates", checked)} 
                        />
                      </div>
                      
                      <Button onClick={handleProfileUpdate}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Preferences
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Security */}
                {activeTab === "security" && (
                  <div>
                    <h2 className="text-xl font-bold mb-6">Security Settings</h2>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Change Password</h3>
                      
                      <div>
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                          <Input 
                            id="currentPassword" 
                            name="current" 
                            type={showPassword.current ? "text" : "password"} 
                            value={passwordFields.current}
                            onChange={handlePasswordChange}
                          />
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute right-0 top-0 h-full"
                            onClick={() => togglePasswordVisibility("current")}
                          >
                            {showPassword.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                          <Input 
                            id="newPassword" 
                            name="new" 
                            type={showPassword.new ? "text" : "password"} 
                            value={passwordFields.new}
                            onChange={handlePasswordChange}
                          />
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute right-0 top-0 h-full"
                            onClick={() => togglePasswordVisibility("new")}
                          >
                            {showPassword.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <div className="relative">
                          <Input 
                            id="confirmPassword" 
                            name="confirm" 
                            type={showPassword.confirm ? "text" : "password"} 
                            value={passwordFields.confirm}
                            onChange={handlePasswordChange}
                          />
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute right-0 top-0 h-full"
                            onClick={() => togglePasswordVisibility("confirm")}
                          >
                            {showPassword.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      
                      <Button onClick={handlePasswordUpdate}>
                        Update Password
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Account Settings */}
                {activeTab === "settings" && (
                  <div>
                    <h2 className="text-xl font-bold mb-6">Account Settings</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-2">Language</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <Button variant="outline" className="justify-start">
                            English (US)
                          </Button>
                          <Button variant="outline" className="justify-start">
                            Add Language
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Privacy</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="shareData">Share order data for better recommendations</Label>
                            <Switch id="shareData" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="locationTracking">Location tracking</Label>
                            <Switch id="locationTracking" defaultChecked />
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <Button variant="destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Account
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

export default Profile;
