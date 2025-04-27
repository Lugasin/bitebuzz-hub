
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

const HeroCarousel = () => {
  const [currentAd, setCurrentAd] = useState(0);
  
  // Large set of promotional items for carousel
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
    },
    {
      id: "promo4",
      title: "New! Spicy Beef Burger",
      description: "Try it today for only K75",
      image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
      color: "from-red-700 to-orange-400",
      link: "/menu/spicy-beef"
    },
    {
      id: "promo5",
      title: "Breakfast Combo Special",
      description: "20% off between 7AM - 10AM",
      image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
      color: "from-amber-400 to-yellow-600",
      link: "/breakfast"
    },
    {
      id: "promo6",
      title: "Healthy Salad Options",
      description: "New menu items for health-conscious customers",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
      color: "from-green-400 to-emerald-600",
      link: "/healthy"
    },
    {
      id: "promo7",
      title: "Weekend Family Feast",
      description: "Feed 4 for only K250",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
      color: "from-purple-400 to-indigo-600",
      link: "/family-meals"
    },
    {
      id: "promo8",
      title: "Late Night Special",
      description: "10PM-Midnight: All desserts half price",
      image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
      color: "from-indigo-500 to-violet-800",
      link: "/desserts"
    },
    {
      id: "promo9",
      title: "Veggie Lovers Delight",
      description: "New vegetarian options available",
      image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
      color: "from-lime-400 to-green-600",
      link: "/vegetarian"
    },
    {
      id: "promo10",
      title: "Student Discount - 15% OFF",
      description: "Show your student ID at checkout",
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
      color: "from-sky-400 to-blue-600",
      link: "/student-deals"
    },
    {
      id: "promo11",
      title: "Premium Seafood Selection",
      description: "Fresh catch of the day",
      image: "https://images.unsplash.com/photo-1448043552756-e747b7a2b2b8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
      color: "from-cyan-400 to-blue-600",
      link: "/seafood"
    },
    {
      id: "promo12",
      title: "Download Our App",
      description: "Get exclusive app-only offers",
      image: "https://images.unsplash.com/photo-1551972873-b7e8754e8e26?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
      color: "from-slate-600 to-gray-900",
      link: "/download-app"
    }
  ];
  
  const nextAd = () => {
    setCurrentAd((prev) => (prev === promoItems.length - 1 ? 0 : prev + 1));
  };
  
  const prevAd = () => {
    setCurrentAd((prev) => (prev === 0 ? promoItems.length - 1 : prev - 1));
  };
  
  // Auto rotate ads
  useEffect(() => {
    const interval = setInterval(() => {
      nextAd();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section className="relative h-[80vh] flex items-center">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-10"></div>
        <img
          src={promoItems[currentAd].image}
          alt={promoItems[currentAd].title}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out"
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-20">
        <div className="flex items-center justify-between w-full">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white bg-black/20 backdrop-blur-md rounded-full"
            onClick={prevAd}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <motion.div
            key={currentAd}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl text-white text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              {promoItems[currentAd].title}
            </h1>
            <p className="text-xl mb-8 text-white/90">
              {promoItems[currentAd].description}
            </p>
            
            <Button 
              size="lg" 
              className={`bg-gradient-to-r ${promoItems[currentAd].color} hover:opacity-90 transition-opacity`}
              asChild
            >
              <Link to={promoItems[currentAd].link}>
                Order Now
              </Link>
            </Button>
          </motion.div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white bg-black/20 backdrop-blur-md rounded-full"
            onClick={nextAd}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-wrap justify-center max-w-md gap-2">
          {promoItems.map((_, idx) => (
            <button
              key={idx}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === currentAd ? "bg-primary scale-125" : "bg-white/50 hover:bg-white/80"
              }`}
              onClick={() => setCurrentAd(idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
