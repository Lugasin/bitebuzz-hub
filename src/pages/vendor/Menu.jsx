import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, storage } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  PlusCircle, Pencil, Trash2, Image as ImageIcon, 
  Coffee, Pizza, Utensils, Beef, Cookie, Wine, Sandwich, Beer, Plus, Edit, Trash
} from "lucide-react";
import { zambianBeverages } from "@/utils/zambianCuisine";
import MainLayout from "@/layouts/MainLayout";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";

const FOOD_CATEGORIES = [
  { id: "main", name: "Main Course", icon: Utensils },
  { id: "pizza", name: "Pizza", icon: Pizza },
  { id: "burgers", name: "Burgers", icon: Beef },
  { id: "sandwiches", name: "Sandwiches", icon: Sandwich },
  { id: "beverages", name: "Beverages", icon: Coffee },
  { id: "desserts", name: "Desserts", icon: Cookie },
  { id: "alcohol", name: "Alcohol", icon: Wine },
  { id: "local_beer", name: "Local Beer", icon: Beer },
];

const SIZE_OPTIONS = [
  { id: "small", name: "Small" },
  { id: "medium", name: "Medium" },
  { id: "large", name: "Large" },
  { id: "extra_large", name: "Extra Large" },
];

const ADDONS = [
  { id: "fries", name: "French Fries", price: 2.99 },
  { id: "drink", name: "Soft Drink", price: 1.99 },
  { id: "salad", name: "Side Salad", price: 3.99 },
  { id: "sauce", name: "Extra Sauce", price: 0.99 },
  { id: "cheese", name: "Extra Cheese", price: 1.49 },
  { id: "bacon", name: "Add Bacon", price: 2.49 },
];

const Menu = () => {
  const { currentUser, userRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [showZambianBeverages, setShowZambianBeverages] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    available: true,
    featured: false,
    preparationTime: "15",
    hasSizes: false,
    sizes: [],
    hasAddons: false,
    addons: [],
    image: "",
    isZambian: false
  });
  
  // Load vendor's menu items with real-time updates
  useEffect(() => {
    if (!currentUser) return;
    
    const menuItemsQuery = query(
      collection(db, "menuItems"),
      where("vendorId", "==", currentUser.uid)
    );
    
    // Use onSnapshot for real-time updates
    const unsubscribe = onSnapshot(menuItemsQuery, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      
      setMenuItems(items);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(items.map(item => item.category))];
      setCategories(uniqueCategories);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching menu items:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load menu items."
      });
      setLoading(false);
    });
    
    // Clean up the subscription
    return () => unsubscribe();
  }, [currentUser, toast]);
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSizeToggle = (checked) => {
    setForm(prev => ({ 
      ...prev, 
      hasSizes: checked,
      sizes: checked ? [
        { option: "small", price: prev.price },
        { option: "medium", price: (parseFloat(prev.price) * 1.3).toFixed(2) },
        { option: "large", price: (parseFloat(prev.price) * 1.6).toFixed(2) }
      ] : []
    }));
  };
  
  const handleAddonToggle = (checked) => {
    setForm(prev => ({ 
      ...prev, 
      hasAddons: checked,
      addons: checked ? ADDONS.slice(0, 3).map(addon => ({
        name: addon.name,
        price: addon.price,
        available: true
      })) : []
    }));
  };
  
  const updateSizePrice = (index, price) => {
    setForm(prev => {
      const newSizes = [...prev.sizes];
      newSizes[index].price = price;
      return { ...prev, sizes: newSizes };
    });
  };
  
  const updateAddon = (index, field, value) => {
    setForm(prev => {
      const newAddons = [...prev.addons];
      newAddons[index][field] = value;
      return { ...prev, addons: newAddons };
    });
  };
  
  const addAddon = () => {
    setForm(prev => ({
      ...prev,
      addons: [...prev.addons, { name: "", price: "", available: true }]
    }));
  };
  
  const removeAddon = (index) => {
    setForm(prev => {
      const newAddons = [...prev.addons];
      newAddons.splice(index, 1);
      return { ...prev, addons: newAddons };
    });
  };
  
  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      category: "",
      available: true,
      featured: false,
      preparationTime: "15",
      hasSizes: false,
      sizes: [],
      hasAddons: false,
      addons: [],
      image: "",
      isZambian: false
    });
    setImageFile(null);
    setImagePreview(null);
    setIsEditing(false);
    setCurrentItemId(null);
  };
  
  const handleEdit = (item) => {
    setForm({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      available: item.available,
      featured: item.featured,
      preparationTime: item.preparationTime.toString(),
      hasSizes: item.sizes && item.sizes.length > 0,
      sizes: item.sizes || [],
      hasAddons: item.addons && item.addons.length > 0,
      addons: item.addons || [],
      image: item.image,
      isZambian: item.isZambian
    });
    setImagePreview(item.image);
    setIsEditing(true);
    setCurrentItemId(item.id);
  };
  
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteDoc(doc(db, "menuItems", id));
        
        toast({
          title: "Item deleted",
          description: "Menu item has been removed successfully."
        });
      } catch (error) {
        console.error("Error deleting menu item:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete menu item."
        });
      }
    }
  };

  const addZambianBeverage = async (beverage) => {
    try {
      setLoading(true);
      
      const menuItemData = {
        name: beverage.name,
        description: beverage.description,
        price: beverage.price,
        category: beverage.category === "Alcohol" ? "alcohol" : "beverages",
        available: true,
        featured: false,
        preparationTime: 5,
        image: beverage.image,
        vendorId: currentUser.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isZambian: true
      };
      
      await addDoc(collection(db, "menuItems"), menuItemData);
      
      toast({
        title: "Beverage added",
        description: `${beverage.name} has been added to your menu.`
      });
    } catch (error) {
      console.error("Error adding beverage:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add beverage to menu."
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.name || !form.price || !form.category) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Name, price and category are required."
      });
      return;
    }
    
    setLoading(true);
    
    try {
      let imageUrl = form.image;
      
      // Upload new image if selected
      if (imageFile) {
        const storageRef = ref(storage, `menu/${currentUser.uid}/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }
      
      const menuItemData = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        category: form.category,
        available: form.available,
        featured: form.featured,
        preparationTime: parseInt(form.preparationTime),
        sizes: form.hasSizes ? form.sizes : [],
        addons: form.hasAddons ? form.addons : [],
        image: imageUrl,
        vendorId: currentUser.uid,
        updatedAt: new Date().toISOString(),
        isZambian: form.isZambian
      };
      
      if (isEditing) {
        // Update existing menu item
        await updateDoc(doc(db, "menuItems", currentItemId), menuItemData);
        
        toast({
          title: "Item updated",
          description: "Menu item has been updated successfully."
        });
      } else {
        // Add new menu item
        menuItemData.createdAt = new Date().toISOString();
        
        await addDoc(collection(db, "menuItems"), menuItemData);
        
        toast({
          title: "Item added",
          description: "New menu item has been added successfully."
        });
      }
      
      // Reset form
      resetForm();
      
    } catch (error) {
      console.error("Error saving menu item:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save menu item."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Menu Management</h1>
          <Button onClick={() => navigate("/vendor/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
        
        <Tabs defaultValue="menu">
          <TabsList className="mb-8">
            <TabsTrigger value="menu">Your Menu</TabsTrigger>
            <TabsTrigger value="add">Add/Edit Item</TabsTrigger>
            <TabsTrigger value="zambian">Zambian Beverages</TabsTrigger>
          </TabsList>
          
          <TabsContent value="menu" className="space-y-6">
            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {FOOD_CATEGORIES.map(category => {
                  const items = menuItems.filter(item => item.category === category.id);
                  if (items.length === 0) return null;
                  
                  return (
                    <div key={category.id} className="space-y-4">
                      <div className="flex items-center gap-2">
                        <category.icon className="w-5 h-5 text-primary" />
                        <h2 className="text-xl font-semibold">{category.name}</h2>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.map(item => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -5 }}
                          >
                            <Card className={`overflow-hidden ${!item.available ? 'opacity-60' : ''}`}>
                              <div className="relative h-48">
                                {item.image ? (
                                  <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-secondary flex items-center justify-center">
                                    <ImageIcon className="w-12 h-12 text-muted-foreground" />
                                  </div>
                                )}
                                
                                {item.featured && (
                                  <div className="absolute top-2 left-2 bg-primary px-2 py-1 rounded text-xs font-bold text-primary-foreground">
                                    Featured
                                  </div>
                                )}
                                
                                {!item.available && (
                                  <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                                    <span className="text-lg font-bold text-foreground">Currently Unavailable</span>
                                  </div>
                                )}
                                
                                {item.isZambian && (
                                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold py-1 px-2 rounded">
                                    Zambian
                                  </div>
                                )}
                              </div>
                              
                              <CardHeader>
                                <CardTitle>{item.name}</CardTitle>
                              </CardHeader>
                              
                              <CardContent>
                                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{item.description}</p>
                                
                                {item.sizes && item.sizes.length > 0 ? (
                                  <div className="mb-2">
                                    <span className="text-sm font-medium">Sizes:</span>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                      {item.sizes.map(size => (
                                        <span key={size.option} className="size-option">
                                          {size.option.charAt(0).toUpperCase() + size.option.slice(1)} - K{parseFloat(size.price).toFixed(2)}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  <p className="font-bold">K{parseFloat(item.price).toFixed(2)}</p>
                                )}
                                
                                {item.addons && item.addons.length > 0 && (
                                  <div className="mt-3">
                                    <span className="text-sm font-medium">Add-ons available</span>
                                  </div>
                                )}
                              </CardContent>
                              
                              <CardFooter className="flex justify-between">
                                <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                                  <Pencil className="h-4 w-4 mr-1" /> Edit
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                                </Button>
                              </CardFooter>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                
                {menuItems.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">You haven't added any menu items yet.</p>
                    <Button onClick={() => document.querySelector('[data-value="add"]').click()}>
                      <PlusCircle className="h-4 w-4 mr-2" /> Add Your First Item
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
          
          <TabsContent value="add">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>{isEditing ? "Edit Menu Item" : "Add New Menu Item"}</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Item Name *</Label>
                        <Input 
                          id="name" 
                          value={form.name} 
                          onChange={(e) => setForm({...form, name: e.target.value})}
                          placeholder="e.g. Margherita Pizza"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea 
                          id="description" 
                          value={form.description} 
                          onChange={(e) => setForm({...form, description: e.target.value})}
                          placeholder="Describe your dish..."
                          rows={3}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="price">Base Price *</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2">K</span>
                            <Input 
                              id="price" 
                              type="number" 
                              min="0" 
                              step="0.01" 
                              value={form.price} 
                              onChange={(e) => setForm({...form, price: e.target.value})}
                              className="pl-7"
                              placeholder="0.00"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="preparationTime">Prep Time (min)</Label>
                          <Input 
                            id="preparationTime" 
                            type="number" 
                            min="1" 
                            value={form.preparationTime} 
                            onChange={(e) => setForm({...form, preparationTime: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select 
                          value={form.category} 
                          onValueChange={(value) => setForm({...form, category: value})}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {FOOD_CATEGORIES.map(category => (
                              <SelectItem key={category.id} value={category.id}>
                                <div className="flex items-center gap-2">
                                  <category.icon className="h-4 w-4" />
                                  <span>{category.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="available" 
                            checked={form.available}
                            onCheckedChange={(checked) => setForm({...form, available: checked})}
                          />
                          <Label htmlFor="available">Available</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="featured" 
                            checked={form.featured}
                            onCheckedChange={(checked) => setForm({...form, featured: checked})}
                          />
                          <Label htmlFor="featured">Featured</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="image">Item Image</Label>
                        <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center">
                          {imagePreview ? (
                            <div className="relative w-full">
                              <img 
                                src={imagePreview} 
                                alt="Preview" 
                                className="w-full h-48 object-cover rounded-lg"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => {
                                  setImagePreview(null);
                                  setImageFile(null);
                                  setForm({...form, image: ""});
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          ) : (
                            <>
                              <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground mb-2">
                                Drag and drop or click to upload
                              </p>
                              <Button type="button" variant="outline" size="sm" asChild>
                                <label>
                                  Browse Files
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={handleImageChange}
                                  />
                                </label>
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Switch 
                              id="hasSizes" 
                              checked={form.hasSizes}
                              onCheckedChange={handleSizeToggle}
                            />
                            <Label htmlFor="hasSizes">Offer Different Sizes</Label>
                          </div>
                        </div>
                        
                        {form.hasSizes && (
                          <div className="space-y-3 border rounded-lg p-3">
                            {form.sizes.map((size, index) => (
                              <div key={size.option} className="flex items-center gap-4">
                                <span className="w-24 capitalize">{size.option}</span>
                                <div className="relative flex-1">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2">K</span>
                                  <Input 
                                    type="number" 
                                    min="0" 
                                    step="0.01" 
                                    value={size.price} 
                                    onChange={(e) => updateSizePrice(index, e.target.value)}
                                    className="pl-7"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Switch 
                              id="hasAddons" 
                              checked={form.hasAddons}
                              onCheckedChange={handleAddonToggle}
                            />
                            <Label htmlFor="hasAddons">Offer Add-ons</Label>
                          </div>
                        </div>
                        
                        {form.hasAddons && (
                          <div className="space-y-3 border rounded-lg p-3">
                            {form.addons.map((addon, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Input 
                                  placeholder="Add-on name" 
                                  value={addon.name} 
                                  onChange={(e) => updateAddon(index, "name", e.target.value)}
                                  className="flex-1"
                                />
                                <div className="relative w-24">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2">K</span>
                                  <Input 
                                    type="number" 
                                    min="0" 
                                    step="0.01" 
                                    value={addon.price} 
                                    onChange={(e) => updateAddon(index, "price", e.target.value)}
                                    className="pl-7"
                                  />
                                </div>
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => removeAddon(index)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            ))}
                            
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              onClick={addAddon}
                              className="w-full"
                            >
                              <PlusCircle className="h-4 w-4 mr-2" /> Add More
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <div className="h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2"></div>
                        Saving...
                      </>
                    ) : isEditing ? "Update Item" : "Add Item"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="zambian">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Popular Zambian Beverages</h2>
                <p className="text-muted-foreground">Click on any item to add it to your menu quickly</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {zambianBeverages.map(beverage => (
                  <Card key={beverage.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <img 
                        src={beverage.image} 
                        alt={beverage.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-primary/90 px-2 py-1 rounded text-xs font-bold text-primary-foreground">
                        {beverage.category}
                      </div>
                    </div>
                    
                    <CardHeader>
                      <CardTitle className="flex justify-between">
                        <span>{beverage.name}</span>
                        <span>K{beverage.price.toFixed(2)}</span>
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{beverage.description}</p>
                      {beverage.alcoholContent && (
                        <p className="mt-2 text-sm"><span className="font-medium">Alcohol:</span> {beverage.alcoholContent}</p>
                      )}
                      {beverage.servingSize && (
                        <p className="text-sm"><span className="font-medium">Serving:</span> {beverage.servingSize}</p>
                      )}
                    </CardContent>
                    
                    <CardFooter>
                      <Button 
                        className="w-full" 
                        onClick={() => addZambianBeverage(beverage)}
                        disabled={loading}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" /> Add to My Menu
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Menu;
