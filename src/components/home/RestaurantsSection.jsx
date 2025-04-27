import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Clock, MapPin } from "lucide-react";

const RestaurantsSection = ({ restaurants, title, linkText, linkUrl }) => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          <Link to={linkUrl} className="text-primary text-sm font-medium hover:underline">
            {linkText}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {restaurants.map((restaurant, index) => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Link to={`/restaurants/${restaurant.id}`}>
                <Card className="overflow-hidden border-none shadow-md dark:bg-card">
                  <div className="relative h-48">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold py-1 px-2 rounded">
                      {restaurant.rating} ★
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-1">{restaurant.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {restaurant.cuisine}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{restaurant.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{restaurant.deliveryTime} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{restaurant.distance} km</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RestaurantsSection;
