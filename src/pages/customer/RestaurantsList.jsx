
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Star, 
  Clock, 
  MapPin,
  Filter,
  SlidersHorizontal
} from "lucide-react";
import { motion } from "framer-motion";

// Mock data for restaurants
const restaurants = [
  {
    id: "1",
    name: "Chicken King",
    image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    cuisine: "Chicken",
    rating: 4.7,
    deliveryTime: "25-35 min",
    deliveryFee: 30,
    distance: "1.2 miles",
    priceRange: "$$",
    tags: ["Chicken", "Fast Food"]
  },
  {
    id: "2",
    name: "Pizza Palace",
    image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    cuisine: "Pizza",
    rating: 4.8,
    deliveryTime: "30-40 min",
    deliveryFee: 35,
    distance: "1.8 miles",
    priceRange: "$$$",
    tags: ["Pizza", "Italian"]
  },
  {
    id: "3",
    name: "Fresh Fries",
    image: "https://images.unsplash.com/photo-1685109649408-c5c56ae4428d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    cuisine: "Fast Food",
    rating: 4.6,
    deliveryTime: "25-40 min",
    deliveryFee: 25,
    distance: "0.9 miles",
    priceRange: "$",
    tags: ["Fast Food", "American"]
  },
  {
    id: "4",
    name: "Beverage Bar",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    cuisine: "Beverages",
    rating: 4.5,
    deliveryTime: "20-30 min",
    deliveryFee: 20,
    distance: "1.5 miles",
    priceRange: "$$",
    tags: ["Beverages", "Coffee", "Desserts"]
  },
  {
    id: "5",
    name: "Burger Joint",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    cuisine: "Burgers",
    rating: 4.3,
    deliveryTime: "20-35 min",
    deliveryFee: 28,
    distance: "1.7 miles",
    priceRange: "$$",
    tags: ["Burgers", "Fast Food"]
  },
  {
    id: "6",
    name: "Veggie Delight",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    cuisine: "Vegetarian",
    rating: 4.9,
    deliveryTime: "35-45 min",
    deliveryFee: 40,
    distance: "2.2 miles",
    priceRange: "$$$",
    tags: ["Vegetarian", "Healthy", "Vegan"]
  }
];

const RestaurantsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurants);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    filterRestaurants(activeFilter, searchQuery);
  }, [searchQuery, activeFilter]);

  const filterRestaurants = (filter, query) => {
    let results = restaurants;
    
    // Apply category filter
    if (filter !== "all") {
      results = results.filter(restaurant => 
        restaurant.cuisine.toLowerCase() === filter || 
        restaurant.tags.some(tag => tag.toLowerCase() === filter)
      );
    }
    
    // Apply search query
    if (query) {
      const searchLower = query.toLowerCase();
      results = results.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchLower) ||
        restaurant.cuisine.toLowerCase().includes(searchLower) ||
        restaurant.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    setFilteredRestaurants(results);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    filterRestaurants(activeFilter, searchQuery);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Restaurants</h1>
        
        {/* Search and filter */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="relative flex mb-4">
            <Input
              type="search"
              placeholder="Search for restaurants..."
              className="pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" variant="ghost" className="absolute right-0 top-0 h-full">
              <Search className="h-5 w-5" />
            </Button>
          </form>
          
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveFilter}>
            <TabsList className="grid grid-cols-4 md:grid-cols-7 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="chicken">Chicken</TabsTrigger>
              <TabsTrigger value="pizza">Pizza</TabsTrigger>
              <TabsTrigger value="fast food">Fast Food</TabsTrigger>
              <TabsTrigger value="beverages">Beverages</TabsTrigger>
              <TabsTrigger value="vegetarian">Vegetarian</TabsTrigger>
              <TabsTrigger value="burgers">Burgers</TabsTrigger>
            </TabsList>
            
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">
                {filteredRestaurants.length} restaurants found
              </p>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
            
            <TabsContent value="all" className="mt-0">
              <RestaurantGrid restaurants={filteredRestaurants} />
            </TabsContent>
            
            <TabsContent value="chicken" className="mt-0">
              <RestaurantGrid restaurants={filteredRestaurants} />
            </TabsContent>
            
            <TabsContent value="pizza" className="mt-0">
              <RestaurantGrid restaurants={filteredRestaurants} />
            </TabsContent>
            
            <TabsContent value="fast food" className="mt-0">
              <RestaurantGrid restaurants={filteredRestaurants} />
            </TabsContent>
            
            <TabsContent value="beverages" className="mt-0">
              <RestaurantGrid restaurants={filteredRestaurants} />
            </TabsContent>
            
            <TabsContent value="vegetarian" className="mt-0">
              <RestaurantGrid restaurants={filteredRestaurants} />
            </TabsContent>
            
            <TabsContent value="burgers" className="mt-0">
              <RestaurantGrid restaurants={filteredRestaurants} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

// Restaurant Grid Component
const RestaurantGrid = ({ restaurants }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {restaurants.map((restaurant) => (
        <motion.div 
          key={restaurant.id}
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="card-hover"
        >
          <Link to={`/restaurant/${restaurant.id}`}>
            <Card className="overflow-hidden border-none shadow-md dark:bg-card h-full">
              <div className="relative h-48">
                <img 
                  src={restaurant.image} 
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-white dark:bg-black/70 px-2 py-1 rounded text-xs font-medium">
                  {restaurant.cuisine}
                </div>
                <div className="absolute bottom-2 right-2 bg-white dark:bg-black/70 px-2 py-1 rounded text-xs font-medium">
                  {restaurant.priceRange}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg">{restaurant.name}</h3>
                
                <div className="flex items-center gap-1 mb-2 text-sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{restaurant.rating}</span>
                  <span className="text-muted-foreground">• {restaurant.deliveryTime}</span>
                </div>
                
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {restaurant.distance}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {restaurant.deliveryTime}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default RestaurantsList;
