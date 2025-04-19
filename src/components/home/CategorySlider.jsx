
import React, { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Beef, Pizza, Utensils, Coffee, Salad, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

// Cuisine categories
const cuisineCategories = [
  { name: "Chicken", icon: Beef, color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300" },
  { name: "Pizza", icon: Pizza, color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300" },
  { name: "Fries", icon: Utensils, color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-300" },
  { name: "Beverages", icon: Coffee, color: "bg-brown-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
  { name: "Salad", icon: Salad, color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300" },
  { name: "Dessert", icon: Cookie, color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-300" },
  { name: "Burger", icon: Beef, color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300" },
  { name: "Seafood", icon: Utensils, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300" },
];

const CategorySlider = () => {
  const sliderRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  const handleScroll = () => {
    if (sliderRef.current) {
      const position = sliderRef.current.scrollLeft;
      const maxScrollValue = sliderRef.current.scrollWidth - sliderRef.current.clientWidth;
      setScrollPosition(position);
      setMaxScroll(maxScrollValue);
    }
  };

  React.useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      handleScroll();
      window.addEventListener('resize', handleScroll);
      slider.addEventListener('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('resize', handleScroll);
      if (slider) {
        slider.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 200;
      if (direction === 'left') {
        sliderRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
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
    <div className="relative py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Popular Categories</h2>
          <Link to="/categories" className="text-primary flex items-center gap-1 text-sm">
            View All
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Navigation buttons */}
        <div className="absolute top-1/2 left-4 z-10 -translate-y-1/2 md:flex hidden">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full bg-white/80 backdrop-blur-sm shadow-md"
            onClick={() => scroll('left')}
            disabled={scrollPosition <= 0}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="absolute top-1/2 right-4 z-10 -translate-y-1/2 md:flex hidden">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full bg-white/80 backdrop-blur-sm shadow-md"
            onClick={() => scroll('right')}
            disabled={scrollPosition >= maxScroll}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Category slider */}
        <motion.div
          ref={sliderRef}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex overflow-x-auto hide-scrollbar gap-4 pb-4 snap-x scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {cuisineCategories.map((category) => (
            <motion.div 
              key={category.name}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="card-hover flex-shrink-0 snap-start w-32"
            >
              <Link to={`/cuisine/${category.name.toLowerCase()}`}>
                <Card className="overflow-hidden border-none shadow-md dark:bg-card">
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-3">
                    <div className={`p-3 rounded-full ${category.color}`}>
                      <category.icon className="h-6 w-6" />
                    </div>
                    <span className="font-medium text-sm">{category.name}</span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default CategorySlider;
