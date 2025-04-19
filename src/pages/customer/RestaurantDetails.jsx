
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { 
  Star, 
  Clock, 
  MapPin,
  ChevronLeft,
  Info,
  Heart,
  Share
} from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";
import FoodCard from "@/components/home/FoodCard";

// Restaurant details (mock)
const restaurants = [
  {
    id: "1",
    name: "Chicken King",
    image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    coverImage: "https://images.unsplash.com/photo-1513639595782-31f25c297fdc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    cuisine: "Chicken",
    rating: 4.7,
    deliveryTime: "25-35 min",
    deliveryFee: 30,
    distance: "1.2 miles",
    priceRange: "$$",
    tags: ["Chicken", "Fast Food"],
    description: "Specializing in delicious fried chicken with our secret blend of spices. Enjoy juicy, crispy chicken that's always fresh and hot.",
    address: "123 Main St, City, State",
    phone: "+1 (123) 456-7890",
    openingHours: "Mon-Sun: 10:00 AM - 10:00 PM",
    menuCategories: ["Popular", "Chicken", "Sides", "Beverages", "Desserts"]
  },
  {
    id: "2",
    name: "Pizza Palace",
    image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    coverImage: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    cuisine: "Pizza",
    rating: 4.8,
    deliveryTime: "30-40 min",
    deliveryFee: 35,
    distance: "1.8 miles",
    priceRange: "$$$",
    tags: ["Pizza", "Italian"],
    description: "Authentic Italian pizza made with hand-tossed dough, premium ingredients, and baked in a traditional wood-fired oven.",
    address: "456 Pizza Ave, City, State",
    phone: "+1 (123) 456-7891",
    openingHours: "Mon-Sun: 11:00 AM - 11:00 PM",
    menuCategories: ["Popular", "Pizzas", "Pasta", "Salads", "Drinks"]
  }
];

// Menu items (mock)
const menuItems = [
  // Chicken King menu items
  {
    id: "ck1",
    restaurantId: "1",
    name: "Crispy Chicken Burger",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    restaurant: "Chicken King",
    restaurantName: "Chicken King",
    price: 70,
    rating: 4.8,
    vendorId: "1",
    category: "Popular",
    description: "Juicy chicken breast coated in our signature crispy batter, with fresh lettuce, tomato, and special sauce.",
    sizes: ["Regular", "Large", "Extra Large"],
    addOns: [
      { id: "a1", name: "Extra Cheese", price: 10 },
      { id: "a2", name: "Bacon", price: 15 },
      { id: "a3", name: "Special Sauce", price: 5 }
    ]
  },
  {
    id: "ck2",
    restaurantId: "1",
    name: "Spicy Wings (6 pcs)",
    image: "https://images.unsplash.com/photo-1608039755401-742074f0548d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    restaurant: "Chicken King",
    restaurantName: "Chicken King",
    price: 55,
    rating: 4.6,
    vendorId: "1",
    category: "Chicken",
    description: "Spicy, crispy wings tossed in our signature hot sauce blend.",
    sizes: ["6 pcs", "12 pcs", "18 pcs"],
    addOns: [
      { id: "a4", name: "Blue Cheese Dip", price: 8 },
      { id: "a5", name: "Extra Hot Sauce", price: 5 }
    ]
  },
  {
    id: "ck3",
    restaurantId: "1",
    name: "Combo Meal",
    image: "https://images.unsplash.com/photo-1610614819513-58e34989e367?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    restaurant: "Chicken King",
    restaurantName: "Chicken King",
    price: 95,
    rating: 4.9,
    vendorId: "1",
    category: "Popular",
    description: "Crispy chicken burger with fries and soft drink of your choice.",
    sizes: ["Regular", "Large", "Family"],
    addOns: [
      { id: "a6", name: "Upgrade to Cheese Fries", price: 12 },
      { id: "a7", name: "Extra Burger", price: 45 }
    ]
  },
  
  // Pizza Palace menu items
  {
    id: "pp1",
    restaurantId: "2",
    name: "Pepperoni Pizza",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    restaurant: "Pizza Palace",
    restaurantName: "Pizza Palace",
    price: 95,
    rating: 4.9,
    vendorId: "2",
    category: "Pizzas",
    description: "Classic pepperoni pizza with our signature tomato sauce and mozzarella cheese.",
    sizes: ["Medium", "Large", "Family"],
    addOns: [
      { id: "a8", name: "Extra Cheese", price: 15 },
      { id: "a9", name: "Extra Pepperoni", price: 20 },
      { id: "a10", name: "Stuffed Crust", price: 25 }
    ]
  },
  {
    id: "pp2",
    restaurantId: "2",
    name: "Margherita Pizza",
    image: "https://images.unsplash.com/photo-1604917877934-07d8d248d396?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    restaurant: "Pizza Palace",
    restaurantName: "Pizza Palace",
    price: 85,
    rating: 4.7,
    vendorId: "2",
    category: "Popular",
    description: "Traditional Margherita with tomato sauce, fresh mozzarella, basil, and extra virgin olive oil.",
    sizes: ["Medium", "Large", "Family"],
    addOns: [
      { id: "a11", name: "Buffalo Mozzarella", price: 25 },
      { id: "a12", name: "Fresh Basil", price: 5 }
    ]
  }
];

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Fetch restaurant and menu data
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchedRestaurant = restaurants.find(r => r.id === id);
    setRestaurant(fetchedRestaurant);
    
    // Fetch menu items for this restaurant
    const fetchedMenuItems = menuItems.filter(item => item.restaurantId === id);
    setMenuItems(fetchedMenuItems);
    
    // Set first category as active by default
    if (fetchedRestaurant) {
      setActiveCategory(fetchedRestaurant.menuCategories[0]);
    }
  }, [id]);

  if (!restaurant) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Loading restaurant details...</p>
        </div>
      </MainLayout>
    );
  }

  const filteredMenuItems = activeCategory === "all" 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const toggleFavorite = () => {
    toast({
      title: "Added to favorites",
      description: `${restaurant.name} has been added to your favorites.`,
    });
  };

  const shareRestaurant = () => {
    if (navigator.share) {
      navigator.share({
        title: restaurant.name,
        text: `Check out ${restaurant.name} on E-eats!`,
        url: window.location.href,
      });
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Restaurant link copied to clipboard!",
      });
    }
  };

  return (
    <MainLayout>
      {/* Restaurant Header */}
      <div className="relative h-64 md:h-80">
        <div className="absolute inset-0">
          <img 
            src={restaurant.coverImage || restaurant.image} 
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 absolute bottom-0 left-0 right-0 pb-6">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{restaurant.name}</h1>
              <div className="flex items-center gap-2 text-white/90 text-sm mb-1">
                <span>{restaurant.cuisine}</span>
                <span>•</span>
                <span>{restaurant.tags.join(", ")}</span>
              </div>
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span>{restaurant.rating}</span>
                </div>
                <span>•</span>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{restaurant.deliveryTime}</span>
                </div>
                <span>•</span>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{restaurant.distance}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={toggleFavorite} className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" onClick={shareRestaurant} className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20">
                <Share className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setInfoDialogOpen(true)} className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20">
                <Info className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Restaurant Menu */}
      <div className="container mx-auto px-4 py-8">
        <Link to="/restaurants" className="flex items-center text-primary mb-4">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Restaurants
        </Link>
        
        <Tabs defaultValue={restaurant.menuCategories[0]} className="w-full" onValueChange={setActiveCategory}>
          <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-6">
            {restaurant.menuCategories.map((category) => (
              <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
            ))}
          </TabsList>
          
          {restaurant.menuCategories.map((category) => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMenuItems.map(item => (
                  <FoodCard 
                    key={item.id} 
                    item={item} 
                    onCustomize={handleItemClick}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      {/* Restaurant Info Dialog */}
      <Dialog open={infoDialogOpen} onOpenChange={setInfoDialogOpen}>
        <DialogContent>
          <DialogTitle>{restaurant.name} - Information</DialogTitle>
          <DialogDescription>
            <div className="space-y-4 mt-4">
              <div>
                <h4 className="font-medium">About</h4>
                <p className="text-sm text-muted-foreground">{restaurant.description}</p>
              </div>
              <div>
                <h4 className="font-medium">Address</h4>
                <p className="text-sm text-muted-foreground">{restaurant.address}</p>
              </div>
              <div>
                <h4 className="font-medium">Contact</h4>
                <p className="text-sm text-muted-foreground">{restaurant.phone}</p>
              </div>
              <div>
                <h4 className="font-medium">Opening Hours</h4>
                <p className="text-sm text-muted-foreground">{restaurant.openingHours}</p>
              </div>
            </div>
          </DialogDescription>
          <DialogClose asChild>
            <Button className="w-full mt-4">Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default RestaurantDetails;
