
import React, { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Download, 
  UserPlus, 
  Mail, 
  Phone, 
  Calendar, 
  Edit, 
  Trash2, 
  MoreVertical,
  User,
  ShieldCheck,
  ChefHat,
  Truck,
  FilterX,
  EyeOff,
  CheckCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formatDistance } from "date-fns";

// Mock users data
const users = [
  {
    id: "u1",
    name: "Jane Cooper",
    email: "jane.cooper@example.com",
    phone: "+1 (123) 456-7891",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    role: "customer",
    status: "active",
    joinDate: new Date(2022, 5, 15),
    orders: 24,
    totalSpent: 1240
  },
  {
    id: "u2",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    phone: "+1 (123) 456-7892",
    avatar: "https://randomuser.me/api/portraits/men/42.jpg",
    role: "customer",
    status: "active",
    joinDate: new Date(2022, 7, 21),
    orders: 18,
    totalSpent: 950
  },
  {
    id: "u3",
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    phone: "+1 (123) 456-7894",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    role: "customer",
    status: "inactive",
    joinDate: new Date(2022, 2, 8),
    orders: 3,
    totalSpent: 145
  },
  {
    id: "u4",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    phone: "+1 (123) 456-7898",
    avatar: "https://randomuser.me/api/portraits/men/62.jpg",
    role: "customer",
    status: "blocked",
    joinDate: new Date(2022, 11, 5),
    orders: 1,
    totalSpent: 45,
    blockReason: "Suspicious activity"
  },
  {
    id: "u5",
    name: "Pizza Palace",
    email: "contact@pizzapalace.com",
    phone: "+1 (123) 456-7893",
    avatar: null,
    role: "vendor",
    status: "active",
    joinDate: new Date(2021, 10, 12),
    restaurantName: "Pizza Palace",
    totalOrders: 453,
    rating: 4.8
  },
  {
    id: "u6",
    name: "Chicken King",
    email: "contact@chickenking.com",
    phone: "+1 (123) 456-7890",
    avatar: null,
    role: "vendor",
    status: "active",
    joinDate: new Date(2021, 8, 24),
    restaurantName: "Chicken King",
    totalOrders: 721,
    rating: 4.7
  },
  {
    id: "u7",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (123) 456-7895",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    role: "delivery",
    status: "active",
    joinDate: new Date(2022, 4, 18),
    totalDeliveries: 345,
    rating: 4.9
  },
  {
    id: "u8",
    name: "Emily White",
    email: "emily.white@example.com",
    phone: "+1 (123) 456-7896",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
    role: "delivery",
    status: "active",
    joinDate: new Date(2022, 6, 30),
    totalDeliveries: 189,
    rating: 4.7
  },
  {
    id: "u9",
    name: "David Clark",
    email: "david.clark@example.com",
    phone: "+1 (123) 456-7899",
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    role: "delivery",
    status: "inactive",
    joinDate: new Date(2022, 3, 11),
    totalDeliveries: 78,
    rating: 4.5
  },
  {
    id: "u10",
    name: "Admin User",
    email: "admin@eeats.com",
    phone: "+1 (123) 456-7900",
    avatar: null,
    role: "admin",
    status: "active",
    joinDate: new Date(2021, 0, 1),
    permissions: ["users", "orders", "restaurants", "settings"]
  }
];

const AdminUsers = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(""); // 'block', 'delete', etc.
  
  const handleTabChange = (value) => {
    setActiveTab(value);
  };
  
  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setUserDialogOpen(true);
  };
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const confirmAction = (user, action) => {
    setSelectedUser(user);
    setActionType(action);
    setConfirmDialogOpen(true);
  };
  
  const performAction = () => {
    let message = "";
    
    switch (actionType) {
      case "block":
        message = `User ${selectedUser.name} has been blocked`;
        break;
      case "unblock":
        message = `User ${selectedUser.name} has been unblocked`;
        break;
      case "delete":
        message = `User ${selectedUser.name} has been deleted`;
        break;
      case "activate":
        message = `User ${selectedUser.name} has been activated`;
        break;
      case "deactivate":
        message = `User ${selectedUser.name} has been deactivated`;
        break;
      default:
        message = "Action completed successfully";
    }
    
    toast({
      title: "Success",
      description: message,
    });
    
    setConfirmDialogOpen(false);
  };
  
  const exportUsers = () => {
    toast({
      title: "Export started",
      description: "Users are being exported to CSV",
    });
  };
  
  const getRoleBadge = (role) => {
    switch (role) {
      case "customer":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">Customer</Badge>;
      case "vendor":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800">Vendor</Badge>;
      case "delivery":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">Delivery</Badge>;
      case "admin":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">Admin</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">Active</Badge>;
      case "inactive":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800">Inactive</Badge>;
      case "blocked":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">Blocked</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getRoleIcon = (role) => {
    switch (role) {
      case "customer":
        return <User className="h-5 w-5 text-blue-600" />;
      case "vendor":
        return <ChefHat className="h-5 w-5 text-purple-600" />;
      case "delivery":
        return <Truck className="h-5 w-5 text-green-600" />;
      case "admin":
        return <ShieldCheck className="h-5 w-5 text-red-600" />;
      default:
        return <User className="h-5 w-5" />;
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
  
  // Filter users based on search query and role tab
  const filteredUsers = users.filter(user => {
    // Filter by role (tab)
    if (activeTab !== "all" && user.role !== activeTab) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.restaurantName && user.restaurantName.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Users Management</h1>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportUsers}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>
        
        <div className="relative w-full md:w-1/3 mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-10"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <Tabs defaultValue="all" className="w-full" onValueChange={handleTabChange} value={activeTab}>
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="all">All Users</TabsTrigger>
            <TabsTrigger value="customer">Customers</TabsTrigger>
            <TabsTrigger value="vendor">Vendors</TabsTrigger>
            <TabsTrigger value="delivery">Delivery</TabsTrigger>
            <TabsTrigger value="admin">Admins</TabsTrigger>
          </TabsList>
          
          <Card>
            <CardContent className="p-0 overflow-auto">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center">
                          <FilterX className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-lg font-medium mb-1">No users found</p>
                          <p className="text-sm text-muted-foreground">
                            Try adjusting your filters or search query
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              {user.restaurantName && (
                                <div className="text-xs text-muted-foreground">
                                  {user.restaurantName}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell>{formatDistance(user.joinDate, new Date(), { addSuffix: true })}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => viewUserDetails(user)}>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => viewUserDetails(user)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            {user.role !== "admin" && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => confirmAction(user, user.status === "blocked" ? "unblock" : "block")}
                              >
                                {user.status === "blocked" ? <CheckCircle className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Tabs>
        
        {/* User Details Dialog */}
        {selectedUser && (
          <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
            <DialogContent className="max-w-3xl">
              <DialogTitle className="flex items-center gap-2">
                {getRoleIcon(selectedUser.role)}
                <span>User Details</span>
              </DialogTitle>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* User Profile Column */}
                <div className="md:col-span-1">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <Avatar className="h-24 w-24 mb-4">
                          <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                          <AvatarFallback>{getInitials(selectedUser.name)}</AvatarFallback>
                        </Avatar>
                        <h3 className="text-xl font-bold mb-1">{selectedUser.name}</h3>
                        <div className="mb-3">
                          {getRoleBadge(selectedUser.role)}
                          {selectedUser.restaurantName && (
                            <div className="mt-1 text-sm">
                              {selectedUser.restaurantName}
                            </div>
                          )}
                        </div>
                        <div className="w-full space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{selectedUser.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{selectedUser.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Joined {formatDistance(selectedUser.joinDate, new Date(), { addSuffix: true })}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Details Column */}
                <div className="md:col-span-2">
                  <Card className="mb-4">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-medium mb-4">Account Details</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Account Status</Label>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(selectedUser.status)}
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setUserDialogOpen(false);
                                confirmAction(
                                  selectedUser, 
                                  selectedUser.status === "active" ? "deactivate" : "activate"
                                );
                              }}
                            >
                              {selectedUser.status === "active" ? "Deactivate" : "Activate"}
                            </Button>
                          </div>
                        </div>
                        
                        {selectedUser.status === "blocked" && (
                          <div className="bg-red-50 p-4 rounded-md dark:bg-red-950/20">
                            <h4 className="font-medium text-red-700 dark:text-red-400">Block Reason</h4>
                            <p className="text-sm text-red-600 dark:text-red-300">{selectedUser.blockReason || "No reason provided"}</p>
                          </div>
                        )}
                        
                        {selectedUser.role === "customer" && (
                          <>
                            <div className="flex items-center justify-between">
                              <Label>Total Orders</Label>
                              <span className="font-medium">{selectedUser.orders}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <Label>Total Spent</Label>
                              <span className="font-medium">K{selectedUser.totalSpent.toFixed(2)}</span>
                            </div>
                          </>
                        )}
                        
                        {selectedUser.role === "vendor" && (
                          <>
                            <div className="flex items-center justify-between">
                              <Label>Total Orders</Label>
                              <span className="font-medium">{selectedUser.totalOrders}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <Label>Rating</Label>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                <span className="ml-1 font-medium">{selectedUser.rating}</span>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {selectedUser.role === "delivery" && (
                          <>
                            <div className="flex items-center justify-between">
                              <Label>Total Deliveries</Label>
                              <span className="font-medium">{selectedUser.totalDeliveries}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <Label>Rating</Label>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                <span className="ml-1 font-medium">{selectedUser.rating}</span>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {selectedUser.role === "admin" && (
                          <div className="flex items-center justify-between">
                            <Label>Permissions</Label>
                            <div className="flex flex-wrap gap-1">
                              {selectedUser.permissions.map(permission => (
                                <Badge key={permission} variant="outline">{permission}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="emailNotifications">Email Notifications</Label>
                          <Switch id="emailNotifications" defaultChecked />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="flex justify-between gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setUserDialogOpen(false);
                        confirmAction(selectedUser, "delete");
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete User
                    </Button>
                    
                    <Button 
                      variant={selectedUser.status === "blocked" ? "default" : "destructive"}
                      onClick={() => {
                        setUserDialogOpen(false);
                        confirmAction(
                          selectedUser, 
                          selectedUser.status === "blocked" ? "unblock" : "block"
                        );
                      }}
                    >
                      {selectedUser.status === "blocked" ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Unblock User
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-4 w-4 mr-2" />
                          Block User
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
        
        {/* Confirmation Dialog */}
        <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <DialogContent className="max-w-sm">
            <DialogTitle>
              {actionType === "delete" ? "Delete User" : 
               actionType === "block" ? "Block User" :
               actionType === "unblock" ? "Unblock User" :
               actionType === "activate" ? "Activate User" :
               "Deactivate User"}
            </DialogTitle>
            <p className="py-4">
              {actionType === "delete" 
                ? `Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.` 
                : actionType === "block"
                ? `Are you sure you want to block ${selectedUser?.name}? They will no longer be able to access the platform.`
                : actionType === "unblock"
                ? `Are you sure you want to unblock ${selectedUser?.name}? They will regain access to the platform.`
                : actionType === "activate"
                ? `Are you sure you want to activate ${selectedUser?.name}'s account?`
                : `Are you sure you want to deactivate ${selectedUser?.name}'s account?`}
            </p>
            <DialogFooter className="flex space-x-2 justify-end">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button 
                variant={actionType === "delete" || actionType === "block" || actionType === "deactivate" ? "destructive" : "default"}
                onClick={performAction}
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

const Star = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
};

export default AdminUsers;
