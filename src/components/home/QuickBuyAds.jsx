
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";

// Quick buy cheap meals data
const cheapMeals = [
  {
    id: "c1",
    name: "Beef Burger",
    price: 45,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    vendorId: "1",
    restaurantName: "Chicken King",
    tag: "SALE"
  },
  {
    id: "c2",
    name: "Chicken Wrap",
    price: 35,
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    vendorId: "1",
    restaurantName: "Chicken King",
    tag: "HOT"
  },
  {
    id: "c3",
    name: "French Fries",
    price: 20,
    image: "https://images.unsplash.com/photo-1639024471283-03518883336d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    vendorId: "3",
    restaurantName: "Fresh Fries",
    tag: "BEST"
  },
  {
    id: "c4",
    name: "Iced Tea",
    price: 15,
    image: "https://images.unsplash.com/photo-1556679343-c1c8c8febee0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    vendorId: "4",
    restaurantName: "Beverage Bar",
    tag: "NEW"
  }
];

const QuickBuyAds = () => {
  const { addItem } = useCart();

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

  const handleAddToCart = (meal) => {
    addItem({
      id: meal.id,
      name: meal.name,
      price: meal.price,
      quantity: 1,
      image: meal.image,
      vendorId: meal.vendorId,
      restaurantName: meal.restaurantName
    });
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Quick Deals</h2>
          <span className="text-primary text-sm font-medium">Get it fast & cheap!</span>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {cheapMeals.map((meal) => (
            <motion.div
              key={meal.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="card-hover"
            >
              <Card className="overflow-hidden border-none shadow-md dark:bg-card">
                <div className="relative h-32">
                  <img
                    src={meal.image}
                    alt={meal.name}
                    className="w-full h-full object-cover"
                  />
                  {meal.tag && (
                    <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold py-1 px-2 rounded">
                      {meal.tag}
                    </div>
                  )}
                </div>
                <CardContent className="p-3 text-center">
                  <h3 className="font-medium truncate text-sm">{meal.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-sm">{formatCurrency(meal.price)}</span>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="p-0 h-8 w-8 rounded-full bg-primary/10 hover:bg-primary/20"
                      onClick={() => handleAddToCart(meal)}
                    >
                      +
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default QuickBuyAds;
