import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  ChevronRight, 
  Star, 
  Clock, 
  MapPin,
  Utensils,
  Pizza,
  Coffee,
  Beef,
  Salad,
  Sandwich,
  Cookie,
  ShoppingBag,
  ChevronLeft,
  X
} from "lucide-react";
import MainLayout from "@/layouts/MainLayout";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";

// Featured restaurants data (mock)
const featuredRestaurants = [
  {
    id: "1",
    name: "Chicken King",
    image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    cuisine: "Chicken",
    rating: 4.7,
    deliveryTime: "25-35 min",
    deliveryFee: 30,
    distance: "1.2 miles"
  },
  {
    id: "2",
    name: "Pizza Palace",
    image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    cuisine: "Pizza",
    rating: 4.8,
    deliveryTime: "30-40 min",
    deliveryFee: 35,
    distance: "1.8 miles"
  },
  {
    id: "3",
    name: "Fresh Fries",
    image: "https://images.unsplash.com/photo-1685109649408-c5c56ae4428d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    cuisine: "Fast Food",
    rating: 4.6,
    deliveryTime: "25-40 min",
    deliveryFee: 25,
    distance: "0.9 miles"
  },
  {
    id: "4",
    name: "Beverage Bar",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    cuisine: "Beverages",
    rating: 4.5,
    deliveryTime: "20-30 min",
    deliveryFee: 20,
    distance: "1.5 miles"
  }
];

// Popular menu items (mock)
const popularItems = [
  {
    id: "p1",
    name: "Crispy Chicken Burger",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    restaurant: "Chicken King",
    restaurantName: "Chicken King",
    price: 70,
    rating: 4.8,
    vendorId: "1",
    sizes: ["Regular", "Large", "Extra Large"],
    addOns: [
      { id: "a1", name: "Extra Cheese", price: 10 },
      { id: "a2", name: "Bacon", price: 15 },
      { id: "a3", name: "Special Sauce", price: 5 }
    ]
  },
  {
    id: "p2",
    name: "Pepperoni Pizza",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    restaurant: "Pizza Palace",
    restaurantName: "Pizza Palace",
    price: 95,
    rating: 4.9,
    vendorId: "2",
    sizes: ["Medium", "Large", "Family"],
    addOns: [
      { id: "a4", name: "Extra Cheese", price: 15 },
      { id: "a5", name: "Extra Pepperoni", price: 20 },
      { id: "a6", name: "Stuffed Crust", price: 25 }
    ]
  },
  {
    id: "p3",
    name: "Loaded Fries",
    image: "https://images.unsplash.com/photo-1639024471283-03518883336d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    restaurant: "Fresh Fries",
    restaurantName: "Fresh Fries",
    price: 50,
    rating: 4.7,
    vendorId: "3",
    sizes: ["Regular", "Large", "Sharing"],
    addOns: [
      { id: "a7", name: "Cheese Sauce", price: 8 },
      { id: "a8", name: "Bacon Bits", price: 12 },
      { id: "a9", name: "Jalapeños", price: 5 }
    ]
  },
  {
    id: "p4",
    name: "Iced Coffee",
    image: "https://images.unsplash.com/photo-1578314675691-9d6ebf342c9c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    restaurant: "Beverage Bar",
    restaurantName: "Beverage Bar",
    price: 25,
    rating: 4.6,
    vendorId: "4",
    sizes: ["Small", "Medium", "Large"],
    addOns: [
      { id: "a10", name: "Extra Shot", price: 5 },
      { id: "a11", name: "Caramel Syrup", price: 5 },
      { id: "a12", name: "Whipped Cream", price: 5 }
    ]
  }
];

// Promotional items for carousel
const promoItems = [
  {
    id: "promo1",
    title: "50% OFF All Chicken Meals",
    description: "Use code CHICKEN50 at checkout",
    image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    color: "from-orange-500 to-red-500",
    link: "/cuisine/chicken"
  },
  {
    id: "promo2",
    title: "Buy 1 Get 1 Free on Pizza",
    description: "Every Tuesday and Wednesday",
    image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    color: "from-red-500 to-yellow-500",
    link: "/cuisine/pizza"
  },
  {
    id: "promo3",
    title: "Free Delivery on Orders Over K100",
    description: "Limited time offer",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    color: "from-blue-500 to-purple-500",
    link: "/restaurants"
  }
];

// Cuisine categories
const cuisineCategories = [
  { name: "Chicken", icon: Beef, color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300" },
  { name: "Pizza", icon: Pizza, color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300" },
  { name: "Fries", icon: Utensils, color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-300" },
  { name: "Beverages", icon: Coffee, color: "bg-brown-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
  { name: "Salad", icon: Salad, color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300" },
  { name: "Dessert", icon: Cookie, color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-300" },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { addItem } = useCart();
  const [currentPromo, setCurrentPromo] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  
  // Handle promo carousel
  const nextPromo = () => {
    setCurrentPromo((prev) => (prev === promoItems.length - 1 ? 0 : prev + 1));
  };
  
  const prevPromo = () => {
    setCurrentPromo((prev) => (prev === 0 ? promoItems.length - 1 : prev - 1));
  };
  
  // Auto rotate promos
  useEffect(() => {
    const interval = setInterval(() => {
      nextPromo();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };
  
  const openItemModal = (item) => {
    setSelectedItem(item);
    setSelectedSize(item.sizes ? item.sizes[0] : "");
    setSelectedAddOns([]);
  };
  
  const closeItemModal = () => {
    setSelectedItem(null);
    setSelectedSize("");
    setSelectedAddOns([]);
  };
  
  const toggleAddOn = (addon) => {
    setSelectedAddOns((prev) => {
      const exists = prev.some((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };
  
  const calculateItemTotal = () => {
    if (!selectedItem) return 0;
    
    let total = selectedItem.price;
    // Add selected add-ons prices
    if (selectedAddOns.length > 0) {
      total += selectedAddOns.reduce((sum, addon) => sum + addon.price, 0);
    }
    
    // Apply size price adjustments if needed
    // This is a simplified example, in a real app you'd have size-specific prices
    if (selectedSize === "Large") {
      total += 15;
    } else if (selectedSize === "Extra Large" || selectedSize === "Family") {
      total += 30;
    } else if (selectedSize === "Sharing") {
      total += 20;
    }
    
    return total;
  };
  
  const addToCart = (item) => {
    // For direct "Add" button click without opening modal
    if (item !== selectedItem) {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image,
        vendorId: item.vendorId,
        restaurantName: item.restaurantName
      });
      return;
    }
    
    // For adding from modal with customizations
    const itemToAdd = {
      id: `${selectedItem.id}-${selectedSize}-${selectedAddOns.map(a => a.id).join('-')}`,
      name: selectedItem.name,
      price: calculateItemTotal(),
      quantity: 1,
      image: selectedItem.image,
      vendorId: selectedItem.vendorId,
      restaurantName: selectedItem.restaurantName,
      size: selectedSize,
      addOns: selectedAddOns
    };
    
    addItem(itemToAdd);
    closeItemModal();
  };

  // Animation variants
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
    <MainLayout>
      {/* Hero section with carousel */}
      <section className="relative h-[80vh] flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-10"></div>
          <img
            src={promoItems[currentPromo].image}
            alt={promoItems[currentPromo].title}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-20">
          <div className="flex items-center justify-between w-full">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white bg-black/20 backdrop-blur-md rounded-full"
              onClick={prevPromo}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            <motion.div
              key={currentPromo}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.7 }}
              className="max-w-2xl text-white text-center"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                {promoItems[currentPromo].title}
              </h1>
              <p className="text-xl mb-8 text-white/90">
                {promoItems[currentPromo].description}
              </p>
              
              <Button 
                size="lg" 
                className={`bg-gradient-to-r ${promoItems[currentPromo].color} hover:opacity-90 transition-opacity`}
                asChild
              >
                <Link to={promoItems[currentPromo].link}>
                  Order Now
                </Link>
              </Button>
            </motion.div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white bg-black/20 backdrop-blur-md rounded-full"
              onClick={nextPromo}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {promoItems.map((_, idx) => (
              <button
                key={idx}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === currentPromo ? "bg-primary scale-125" : "bg-white/50 hover:bg-white/80"
                }`}
                onClick={() => setCurrentPromo(idx)}
              />
            ))}
          </div>
          
          <form onSubmit={handleSearch} className="flex w-full max-w-md mx-auto bg-white/10 backdrop-blur-md p-1 rounded-full border border-white/20 mt-8">
            <Input
              type="search"
              placeholder="Search for food or restaurants..."
              className="border-0 bg-transparent text-white placeholder:text-white/70 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" className="rounded-full">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </form>
        </div>
      </section>
      
      {/* Categories section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Popular Categories</h2>
            <Link to="/categories" className="text-primary flex items-center gap-1 text-sm">
              View All
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-3 md:grid-cols-6 gap-4"
          >
            {cuisineCategories.map((category) => (
              <motion.div 
                key={category.name}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="card-hover"
              >
                <Link to={`/cuisine/${category.name.toLowerCase()}`}>
                  <Card className="overflow-hidden border-none shadow-md dark:bg-card">
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-3">
                      <div className={`p-3 rounded-full ${category.color}`}>
                        <category.icon className="h-6 w-6" />
                      </div>
                      <span className="font-medium">{category.name}</span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Featured restaurants section */}
      <section className="py-12 bg-secondary/50 dark:bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Featured Restaurants</h2>
            <Link to="/restaurants" className="text-primary flex items-center gap-1 text-sm">
              View All
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featuredRestaurants.map((restaurant) => (
              <motion.div 
                key={restaurant.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="card-hover"
              >
                <Link to={`/restaurant/${restaurant.id}`}>
                  <Card className="overflow-hidden border-none shadow-md dark:bg-card">
                    <div className="relative h-48">
                      <img 
                        src={restaurant.image} 
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 bg-white dark:bg-black/70 px-2 py-1 rounded text-xs font-medium">
                        {restaurant.cuisine}
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
        </div>
      </section>
      
      {/* Popular menu items section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Popular Right Now</h2>
            <Link to="/trending" className="text-primary flex items-center gap-1 text-sm">
              View All
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {popularItems.map((item) => (
              <motion.div 
                key={item.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="card-hover"
              >
                <Card className="overflow-hidden border-none shadow-md dark:bg-card">
                  <div className="relative h-48">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-white dark:bg-black/70 p-1 rounded-full">
                      <div className="flex items-center gap-1 px-2 text-xs font-medium">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {item.rating}
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg truncate">{item.name}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{item.restaurant}</p>
                    
                    <div className="flex justify-between items-center">
                      <span className="font-bold">{formatCurrency(item.price)}</span>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="rounded-full"
                          onClick={() => openItemModal(item)}
                        >
                          Customize
                        </Button>
                        <Button 
                          size="sm" 
                          className="rounded-full"
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart(item);
                          }}
                        >
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* How it works section */}
      <section className="py-12 bg-secondary/50 dark:bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get your favorite meals delivered in just a few simple steps
            </p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div 
              variants={itemVariants}
              className="text-center"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Browse Restaurants</h3>
              <p className="text-muted-foreground">
                Explore a variety of restaurants and cuisines in your area.
              </p>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="text-center"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Choose Your Meal</h3>
              <p className="text-muted-foreground">
                Select from a wide range of delicious meals and add them to your cart.
              </p>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="text-center"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Track your order in real-time and enjoy quick delivery to your doorstep.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-primary text-primary-foreground rounded-2xl overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
                <h2 className="text-3xl font-bold mb-4">Become a Delivery Partner</h2>
                <p className="mb-8 text-primary-foreground/90">
                  Join our team of delivery partners and earn money on your own schedule. Fast payments, flexible hours, and great incentives.
                </p>
                <div>
                  <Button variant="secondary" size="lg" asChild>
                    <Link to="/delivery/signup">
                      Apply Now
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2 relative min-h-[300px]">
                <img 
                  src="https://images.unsplash.com/photo-1599598177991-ec67b5c31580?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80" 
                  alt="Delivery Partner" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured in section */}
      <section className="py-12 bg-secondary/30 dark:bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-xl font-medium text-muted-foreground">Featured In</h2>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-12">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/TechCrunch_logo.svg/440px-TechCrunch_logo.svg.png" alt="TechCrunch" className="h-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-300" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Forbes_logo.svg/440px-Forbes_logo.svg.png" alt="Forbes" className="h-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-300" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Wired_UK_logo.svg/440px-Wired_UK_logo.svg.png" alt="Wired" className="h-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-300" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Medium_logo_Monogram.svg/440px-Medium_logo_Monogram.svg.png" alt="Medium" className="h-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-300" />
          </div>
        </div>
      </section>
      
      {/* Item customization modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeItemModal}></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-background rounded-lg shadow-xl w-full max-w-md p-4 z-10 max-h-[90vh] overflow-y-auto dark:bg-card"
          >
            <div className="relative h-48 mb-4">
              <img 
                src={selectedItem.image} 
                alt={selectedItem.name} 
                className="w-full h-full object-cover rounded-lg"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full"
                onClick={closeItemModal}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <h2 className="text-xl font-bold mb-1">{selectedItem.name}</h2>
            <p className="text-muted-foreground mb-4">{selectedItem.restaurant}</p>
            
            {selectedItem.sizes && selectedItem.sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium mb-2">Size:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                      className="rounded-full"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {selectedItem.addOns && selectedItem.addOns.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium mb-2">Add-ons:</h3>
                <div className="space-y-2">
                  {selectedItem.addOns.map((addon) => (
                    <div key={addon.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={addon.id}
                          checked={selectedAddOns.some((a) => a.id === addon.id)}
                          onChange={() => toggleAddOn(addon)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor={addon.id}>{addon.name}</label>
                      </div>
                      <span className="text-sm font-medium">+{formatCurrency(addon.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="border-t pt-4 flex items-center justify-between">
              <div className="text-lg font-bold">{formatCurrency(calculateItemTotal())}</div>
              <Button onClick={() => addToCart(selectedItem)}>
                Add to Cart
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </MainLayout>
  );
};

export default Index;
