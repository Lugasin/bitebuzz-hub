
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin, Clock, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

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

const RestaurantsSection = ({ restaurants }) => {
  return (
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
          {restaurants.map((restaurant) => (
            <motion.div 
              key={restaurant.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="card-hover"
            >
              <Link to={`/restaurant/${restaurant.id}`}>
                <Card className="overflow-hidden border-none shadow-md dark:bg-card group">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={restaurant.image} 
                      alt={restaurant.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
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
  );
};

export default RestaurantsSection;
