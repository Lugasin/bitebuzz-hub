import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";

const PopularItemsSection = ({ items, title, linkText, linkUrl, onItemSelect }) => {
  const { addItem } = useCart();

  const handleAddToCart = (item) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      vendorId: item.vendorId,
      restaurantName: item.restaurantName
    });
  };

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
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="overflow-hidden border-none shadow-md dark:bg-card">
                <div className="relative h-48">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold py-1 px-2 rounded">
                    {item.rating} ★
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-1">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {item.restaurantName}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{formatCurrency(item.price)}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="p-0 h-8 w-8 rounded-full bg-primary/10 hover:bg-primary/20"
                      onClick={() => handleAddToCart(item)}
                    >
                      +
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularItemsSection;
