import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import {
  Search,
  Download,
  Store,
  Edit,
  Eye,
  MapPin,
  Phone,
  Clock,
  Check,
  X, Mail, AlertCircle,
  BarChart,
  
  Settings,
  Loader,
  Trash2,
  Calendar,User,
  FileText,Star,

} from "lucide-react"
import { Restaurant } from "@/lib/models";
import {
  ScrollArea,
} from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
const AdminVendors = () => {
  const { currentUser } = useAuth();
  const [vendors, setVendors] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const fetchVendors = async () => {
    try {
      const allVendors = await Restaurant.getAllRestaurants();
      console.log("Fetched vendors:", allVendors);

      if (!allVendors || !Array.isArray(allVendors)) {
        console.error("Invalid or empty vendors data received:", allVendors);
        toast({
          title: "Error",
          description: "Failed to load vendors data.",
          variant: "destructive",
        });
      } else {
        setVendors(allVendors);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);

      toast({
        title: "Error",
        description: `Failed to fetch vendors: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("Fetching vendors...");
    fetchVendors();
  }, []);
  const [vendorDialogOpen, setVendorDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState("");

  const handleTabChange = (value) => {
    console.log("Tab changed to:", value);
    setActiveTab(value);
  };

  const refreshVendors = () => {
    setIsLoading(true);
    fetchVendors();
  };

  useEffect(() => {
    const logVendorsUpdate = async () => {
        try {
            console.log("Vendors state updated:", vendors);
        } catch (error) {
            console.error("Error logging vendors update:", error);
        }
    };
    logVendorsUpdate();

  }, [vendors]);


  const viewVendorDetails = (vendor) => {
      try{
          Restaurant.getRestaurantById(vendor.id).then((restaurantData) => {
            setSelectedVendor(restaurantData)
          }).catch((error) => {
            console.error("Error in viewVendorDetails:",error)
          });
          
          setVendorDialogOpen(true);
      }catch(error){console.error("Error in viewVendorDetails:", error)}
 };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const confirmAction = (vendor, action) => {
      setSelectedVendor(vendor);
      setActionType(action);
      setConfirmDialogOpen(true);
  };

  const performAction = async () => {
      if (!selectedVendor) {
        return; 
      }
      let message = "";
      try{
          
          switch (actionType) {
              case "suspend":
                  await Restaurant.updateVendor(selectedVendor.id, {status: "suspended"});
                  console.log(`Restaurant ${selectedVendor.name} has been suspended`);
                   message = `Restaurant ${selectedVendor.name} has been suspended`;
                  break;
              case "reactivate":
                  await Restaurant.updateVendor(selectedVendor.id, {status: "active"});
                  console.log(`Restaurant ${selectedVendor.name} has been reactivated`);
                   message = `Restaurant ${selectedVendor.name} has been reactivated`;
                  break;
              case "delete":
                  await Restaurant.deleteVendor(selectedVendor.id);
                  console.log(`Restaurant ${selectedVendor.name} has been deleted`);
                   message = `Restaurant ${selectedVendor.name} has been deleted`;
                  break;
              case "approve":
                  await Restaurant.updateVendor(selectedVendor.id, {status: "active"});
                  console.log(`Restaurant ${selectedVendor.name} has been approved`);
                   message = `Restaurant ${selectedVendor.name} has been approved`;
                  break;
              case "feature":
                  await Restaurant.updateVendor(selectedVendor.id, {featured: true});
                  console.log(`Restaurant ${selectedVendor.name} is now featured`);
                   message = `Restaurant ${selectedVendor.name} is now featured`;
                  break;
              case "unfeature":
                  await Restaurant.updateVendor(selectedVendor.id, {featured: false});
                  console.log(`Restaurant ${selectedVendor.name} has been removed from featured list`);

                  message = `Restaurant ${selectedVendor.name} has been removed from featured list`;
                  
                  break;
              default:
                  message = "Action completed successfully";
          }

          toast({
              title: "Success",
              description: message,
              duration: 5000, 
          });
          refreshVendors();
      } catch (error) {
          console.error("Error performing action:", error);
          toast({
            title: "Error",
            description: `Failed to perform action: ${error.message}`,
            variant: "destructive",
          });
      } finally {
        setConfirmDialogOpen(false);
      }

  };

  const exportVendors = () => {
      toast({
        title: "Export started",
        description: "Vendors are being exported to CSV",
      });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">Active</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800">Pending Approval</Badge>;
      case "suspended":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getInitials = (name) => {
    if (!name) return "R";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const filteredVendors = vendors.filter(vendor => {
    if (activeTab !== "all" && vendor.status !== activeTab) {
      return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
       return (
        vendor.name.toLowerCase().includes(query) ||
        vendor.cuisine.toLowerCase().includes(query) ||
        vendor.owner.name.toLowerCase().includes(query) ||
        vendor.address?.toLowerCase().includes(query)
      );
    }

    return true;
  });


  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">

          <h1 className="text-3xl font-bold">Restaurant Management</h1>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportVendors}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <Store className="h-4 w-4 mr-2" />
              Add Restaurant
            </Button>
          </div>
        </div>
        
        <div className="relative w-full md:w-1/3 mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search restaurants..."
            className="pl-10"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <Tabs defaultValue="all" className="w-full" onValueChange={handleTabChange} value={activeTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="all">All Restaurants</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending Approval</TabsTrigger>
          </TabsList>
          
          <Card>
            <CardContent className="p-0 overflow-auto">
              <Table>
                <TableHeader className="bg-muted">

                  <TableRow>
                    <TableHead>Restaurant</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                  {filteredVendors.length === 0 ? (
                      isLoading ? (<TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex flex-col items-center">
                              <Loader className="h-8 w-8 text-muted-foreground mb-2 animate-spin"/>
                          </div>
                      </TableCell>
                  </TableRow>)
                      :
                    (<TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center">
                          <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-lg font-medium mb-1">No restaurants found</p>
                          <p className="text-sm text-muted-foreground">
                            Try adjusting your filters or search query
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>)
                  ) : isLoading ? null :(
                    filteredVendors.map((vendor) => (
                      <TableRow key={vendor.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={vendor.image} alt={vendor.name} />
                              <AvatarFallback>{getInitials(vendor.name)}</AvatarFallback>
                            </Avatar>                                 
                            <div>
                              <div className="font-medium">{vendor.name}</div>
                              <div className="text-xs text-muted-foreground">{vendor.cuisine}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>

                            <div className="font-medium">{vendor.owner?.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {vendor.owner?.email}

                            </div>
                          </div>
                        </TableCell>
                        <TableCell >
                          <div className="flex items-center">
                            <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
                            <span>{vendor.status === "pending" ? "N/A" : vendor.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>{vendor.status === "pending" ? "N/A" : vendor.totalOrders}</TableCell>
                        <TableCell>{getStatusBadge(vendor.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => viewVendorDetails(vendor)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            {vendor.status === "pending" && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-green-600 border-green-600 hover:bg-green-50"
                                onClick={() => confirmAction(vendor, "approve")}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
              </Table>
            </CardContent>
          </Card>
        </Tabs>
        
        {selectedVendor && (
          <Dialog open={vendorDialogOpen} onOpenChange={setVendorDialogOpen}>
            <DialogContent className="max-w-4xl">
              <DialogTitle className="flex justify-between items-center">
                <span>Restaurant Details</span>
                <div className="flex gap-2">
                  {getStatusBadge(selectedVendor.status)}
                 {selectedVendor.featured && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                      Featured
                    </Badge>
                  )}
                </div>
              </DialogTitle>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <div className="space-y-6">
                    <Card>
                      <CardContent className="p-0">
                        <div className="relative h-40">
                          <img 
                            src={selectedVendor.coverImage || selectedVendor.image} 
                            alt={selectedVendor.name}
                            className="h-full w-full object-cover object-center"
                          />

                          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/70 to-transparent"></div>
                          <div className="absolute bottom-4 left-4 flex items-center gap-3">
                            <Avatar className="h-14 w-14 border-2 border-white">
                              <AvatarImage src={selectedVendor.image} alt={selectedVendor.name} />
                              <AvatarFallback>{getInitials(selectedVendor.name)}</AvatarFallback>
                            </Avatar>
                            <div className="text-white">
                              <h3 className="font-bold">{selectedVendor.name}</h3>
                              <p className="text-xs">{selectedVendor.cuisine}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 space-y-3">
                          <div className="flex items-start gap-2">
                            <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                            <span>{selectedVendor.address}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                            <span>{selectedVendor.openingHours}</span>
                          </div>
                          {selectedVendor.status !== "pending" && (
                            <div className="flex items-start gap-2">
                              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <span className="font-medium">{selectedVendor.rating}/5 Rating</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card >
                      <CardContent className="p-4">
                        <h3 className="text-lg font-medium mb-4 flex items-center">
                          <User className="h-5 w-5 mr-2 text-primary" />
                          Owner Information
                          </h3>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs text-muted-foreground">Name</Label>
                           <p>{selectedVendor.owner.name}</p>

                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Email</Label>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <p>{selectedVendor.owner.email}</p>
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Phone</Label>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <p>{selectedVendor.owner.phone}</p>
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Member Since</Label>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <p>{format(selectedVendor.owner.joinDate, "MMMM d, yyyy")}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {selectedVendor.status === "pending" && (
                      <Card>
                        <CardContent className="p-4" >
                          <h3 className="text-lg font-medium mb-4 flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-primary" />
                            Required Documents
                          </h3>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span>Business License</span>
                              {selectedVendor.documents?.businessLicense ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                                  Provided
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                                  Missing
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Health Certificate</span>
                              {selectedVendor.documents?.healthCertificate ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                                  Provided
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                                  Missing
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Food Handling Permit</span>
                              {selectedVendor.documents?.foodHandlingPermit ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                                  Provided
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                                  Missing
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
                
                <div className="md:col-span-2 space-y-6">
                  {selectedVendor.status === "suspended" && (
                    <Card className="border-red-300 dark:border-red-800">
                      <CardContent className="p-4">
                        <h3 className="text-lg font-medium mb-2 text-red-700 dark:text-red-400 flex items-center" >
                        <AlertCircle className="h-5 w-5 mr-2" />
                          Suspension Information
                        </h3>
                        <p className="mb-4">{selectedVendor.suspensionReason}</p>
                        <Button onClick={() => confirmAction(selectedVendor, "reactivate")}>
                          <Check className="h-4 w-4 mr-2" />
                          Reactivate Restaurant
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                  
                  {selectedVendor.status === "pending" ? (
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="text-lg font-medium mb-4" >Approval Actions</h3>
                        
                        <div className="space-y-4">
                          <p >This restaurant is awaiting approval. Please review their information and documents before approving.</p>
                          
                          <div className="flex justify-end gap-2">
                            <Button variant="destructive" onClick={() => confirmAction(selectedVendor, "delete")}>
                              <X className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                            <Button onClick={() => confirmAction(selectedVendor, "approve")}>
                              <Check className="h-4 w-4 mr-2" />
                              Approve Restaurant
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      <Card>
                        <CardContent className="p-4">
                          <h3 className="text-lg font-medium mb-4 flex items-center" >
                            <BarChart className="h-5 w-5 mr-2 text-primary" />
                            Performance Metrics
                          </h3> 
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-muted/50 p-4 rounded-md">
                              <Label className="text-xs text-muted-foreground">Total Orders</Label>
                              <p className="text-2xl font-bold">{selectedVendor.totalOrders}</p>
                            </div>
                            <div className="bg-muted/50 p-4 rounded-md">
                              <Label className="text-xs text-muted-foreground">Menu Items</Label>
                              <p className="text-2xl font-bold">{selectedVendor.menuItems}</p>
                            </div>
                            <div className="bg-muted/50 p-4 rounded-md">
                              <Label className="text-xs text-muted-foreground">Rating</Label>
                              <div className="flex items-center">
                                <p className="text-2xl font-bold mr-1">{selectedVendor.rating}</p>
                                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span>Revenue</span>
                              <span className="font-medium">{formatCurrency(selectedVendor.totalRevenue)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Platform Fee ({selectedVendor.commissionRate})</span>
                              <span className="font-medium">{formatCurrency(selectedVendor.platformFee)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Approval Date</span>
                              <span className="font-medium">{format(selectedVendor.approvalDate, "MMMM d, yyyy")}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      
                      <Card>
                        <CardContent className="p-4">
                          <h3 className="text-lg font-medium mb-4 flex items-center" >
                            <Settings className="h-5 w-5 mr-2 text-primary" />
                            Restaurant Settings
                          </h3>

                          
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="featured">Featured Restaurant</Label>
                                <p className="text-sm text-muted-foreground">Display prominently in featured sections</p>
                              </div>
                              <Switch 
                                id="featured" 
                                checked={selectedVendor.featured}
                                onCheckedChange={() => {
                                  confirmAction(
                                    selectedVendor, 
                                    selectedVendor.featured ? "unfeature" : "feature"
                                  );
                                }}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="commissionOverride">Override Commission Rate</Label>
                                <p className="text-sm text-muted-foreground">Current: {selectedVendor.commissionRate}</p>
                              </div>
                              <Button variant="outline" size="sm">
                                Change Rate
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                  
                   <div className="flex justify-between gap-2">
                    <Button 
                      variant="destructive" 
                      onClick={() => confirmAction(selectedVendor, "delete")}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Restaurant
                    </Button>
                    
                    {selectedVendor.status === "active" && (
                      <Button 
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => confirmAction(selectedVendor, "suspend")}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Suspend Restaurant
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
        
        <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <DialogContent className="max-w-sm">
            <DialogTitle>
              {actionType === "delete" ? "Delete Restaurant" : 
               actionType === "suspend" ? "Suspend Restaurant" :
               actionType === "reactivate" ? "Reactivate Restaurant" :
               actionType === "approve" ? "Approve Restaurant" :
               actionType === "feature" ? "Feature Restaurant" :
               "Unfeature Restaurant"}
            </DialogTitle>
            <p className="py-4">
              {actionType === "delete" 
                ? `Are you sure you want to delete ${selectedVendor?.name}? This action cannot be undone.`

                : actionType === "suspend"
                ? `Are you sure you want to suspend ${selectedVendor?.name}? This will temporarily remove them from the platform.`
                : actionType === "reactivate"
                ? `Are you sure you want to reactivate ${selectedVendor?.name}? This will restore their visibility on the platform.`
                : actionType === "approve"
                ? `Are you sure you want to approve ${selectedVendor?.name}? This will make them visible on the platform.`
                : actionType === "feature" 
                ? `Are you sure you want to feature ${selectedVendor?.name}? This will display them prominently in featured sections.`
                : `Are you sure you want to remove ${selectedVendor?.name} from featured restaurants?`}
            </p>
            <DialogFooter className="flex space-x-2 justify-end">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button 
                variant={actionType === "delete" || actionType === "suspend" ? "destructive" : "default"}
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
export default AdminVendors;
