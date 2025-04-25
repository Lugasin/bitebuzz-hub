import React, { useState, useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";
import HeroCarousel from "@/components/home/HeroCarousel";
import { useAuth } from "@/context/AuthContext";
import QuickBuyAds from "@/components/home/QuickBuyAds";
import CategorySlider from "@/components/home/CategorySlider";
import PopularItemsSection from "@/components/home/PopularItemsSection";
import RestaurantsSection from "@/components/home/RestaurantsSection";
import CustomizeModal from "@/components/home/CustomizeModal";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/lib/firebase';
import { Search, Utensils, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

// Featured restaurants data
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

// Popular menu items data
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

// Popular beverages
const popularBeverages = [
  {
    id: "b1",
    name: "Strawberry Smoothie",
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    restaurant: "Beverage Bar",
    restaurantName: "Beverage Bar",
    price: 35,
    rating: 4.5,
    vendorId: "4",
    sizes: ["Small", "Medium", "Large"],
    addOns: [
      { id: "b1", name: "Extra Fruit", price: 8 },
      { id: "b2", name: "Protein Boost", price: 10 }
    ]
  },
  {
    id: "b2",
    name: "Mango Lemonade",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    restaurant: "Fresh Fries",
    restaurantName: "Fresh Fries",
    price: 28,
    rating: 4.7,
    vendorId: "3",
    sizes: ["Small", "Medium", "Large"],
    addOns: [
      { id: "b3", name: "Extra Sweet", price: 3 },
      { id: "b4", name: "Less Ice", price: 0 }
    ]
  },
  {
    id: "b3",
    name: "Chocolate Milkshake",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    restaurant: "Beverage Bar",
    restaurantName: "Beverage Bar",
    price: 45,
    rating: 4.8,
    vendorId: "4",
    sizes: ["Small", "Medium", "Large"],
    addOns: [
      { id: "b5", name: "Whipped Cream", price: 5 },
      { id: "b6", name: "Chocolate Sauce", price: 5 }
    ]
  },
  {
    id: "b4",
    name: "Iced Tea",
    image: "https://images.unsplash.com/photo-1556679343-c1917b0e6c52?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    restaurant: "Fresh Fries",
    restaurantName: "Fresh Fries",
    price: 20,
    rating: 4.4,
    vendorId: "3",
    sizes: ["Small", "Medium", "Large"],
    addOns: [
      { id: "b7", name: "Lemon", price: 3 },
      { id: "b8", name: "Mint Leaves", price: 5 }
    ]
  }
];

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

const Index = () => {
  const { currentUser } = useAuth();
  const [selectedItem, setSelectedItem] = useState(null);
  
  const openItemModal = (item) => {
    setSelectedItem(item);
  };
  
  const sendTestNotification = async () => {
    try {
      const functions = getFunctions(app);
      const sendNotification = httpsCallable(functions, 'sendNotification');
      const response = await sendNotification({
        tokens: [], 
        title: 'test',
        body: 'this is a test notification'
      });
      if (response.data && response.data.success) {
        alert('Notification sent successfully!');
      } else {
        alert('Failed to send notification.');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification.');
    }
  };
  
  useEffect(() => {
    
  }, [currentUser]);
  
  const closeItemModal = () => {
    setSelectedItem(null);
  };

  return (
    <MainLayout>
      {/* Hero section with expanded ads */}
      {currentUser && (
        <div className="flex justify-center py-4">
        <Button
          onClick={sendTestNotification}
          >
          Send Test Notification
        </Button>
        </div>
        )}
      <HeroCarousel />
      
      {/* Quick access ads */}
      <QuickBuyAds />
      
      {/* Food categories */}
      <CategorySlider />
      
      {/* Popular food items section */}
      <PopularItemsSection 
        items={popularItems} 
        title="Popular Right Now"
        linkText="View All"
        linkUrl="/trending"
        onItemSelect={openItemModal}
      />
      
      {/* Featured restaurants section */}
      <RestaurantsSection restaurants={featuredRestaurants} />
      
      {/* Popular beverages section */}
      <PopularItemsSection 
        items={popularBeverages} 
        title="Refreshing Drinks"
        linkText="All Beverages"
        linkUrl="/beverages"
        onItemSelect={openItemModal}
      />
      
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
      
      {/* Become a delivery partner section */}
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
      {selectedItem && <CustomizeModal item={selectedItem} onClose={closeItemModal} />}
    </MainLayout>
  );
};

export default Index;