
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";

const CustomizeModal = ({ item, onClose }) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(item?.sizes ? item.sizes[0] : "");
  const [selectedAddOns, setSelectedAddOns] = useState([]);

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
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
    if (!item) return 0;
    
    let total = item.price;
    if (selectedAddOns.length > 0) {
      total += selectedAddOns.reduce((sum, addon) => sum + addon.price, 0);
    }
    
    if (selectedSize === "Large") {
      total += 15;
    } else if (selectedSize === "Extra Large" || selectedSize === "Family") {
      total += 30;
    } else if (selectedSize === "Sharing") {
      total += 20;
    }
    
    return total * quantity;
  };

  const handleAddToCart = () => {
    if (!item) return;
    
    const itemToAdd = {
      id: `${item.id}-${selectedSize}-${selectedAddOns.map(a => a.id).join('-')}`,
      name: item.name,
      price: calculateItemTotal() / quantity,
      quantity: quantity,
      image: item.image,
      vendorId: item.vendorId,
      restaurantName: item.restaurantName,
      size: selectedSize,
      addOns: selectedAddOns
    };
    
    addItem(itemToAdd);
    onClose();
  };

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-background rounded-lg shadow-xl w-full max-w-md p-4 z-10 max-h-[90vh] overflow-y-auto dark:bg-card"
      >
        <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover"
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-bold">{item.name}</h2>
          <p className="text-muted-foreground">{item.restaurantName}</p>
          
          <div className="flex justify-between items-center mt-4">
            <p className="font-medium">Base Price: {formatCurrency(item.price)}</p>
            
            <div className="flex items-center space-x-2">
              <Button 
                size="sm" 
                variant="outline"
                className="h-8 w-8 p-0 rounded-full"
                onClick={decrementQuantity}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-6 text-center font-medium">{quantity}</span>
              <Button 
                size="sm" 
                variant="outline"
                className="h-8 w-8 p-0 rounded-full"
                onClick={incrementQuantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {item.sizes && item.sizes.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Size Options</h4>
            <div className="flex flex-wrap gap-2">
              {item.sizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "default" : "outline"}
                  className="rounded-full"
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                  {size === "Large" && " (+15)"}
                  {(size === "Extra Large" || size === "Family") && " (+30)"}
                  {size === "Sharing" && " (+20)"}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {item.addOns && item.addOns.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Add-ons</h4>
            <div className="space-y-2">
              {item.addOns.map((addon) => (
                <div
                  key={addon.id}
                  className={`flex justify-between items-center p-2 rounded-lg border cursor-pointer transition-colors ${
                    selectedAddOns.some((a) => a.id === addon.id)
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-background/80"
                  }`}
                  onClick={() => toggleAddOn(addon)}
                >
                  <span>{addon.name}</span>
                  <span className="font-semibold text-primary">{formatCurrency(addon.price)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold">Total:</span>
            <span className="font-bold text-xl text-primary">{formatCurrency(calculateItemTotal())}</span>
          </div>
          
          <Button 
            className="w-full"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="h-5 w-5 mr-2" />
            Add to Cart
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default CustomizeModal;
