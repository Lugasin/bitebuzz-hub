
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ShoppingBag, Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

const FoodCard = ({ item, onCustomize }) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = (e) => {
    e.stopPropagation();
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: quantity,
      image: item.image,
      vendorId: item.vendorId,
      restaurantName: item.restaurantName
    });
    setQuantity(1); // Reset quantity after adding to cart
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="card-hover"
    >
      <Card 
        className="overflow-hidden border-none shadow-md dark:bg-card h-full"
        onClick={() => onCustomize(item)}
      >
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
              <div className="flex items-center space-x-1">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={handleDecrement}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-6 text-center">{quantity}</span>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={handleIncrement}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                size="sm" 
                className="rounded-full"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FoodCard;
