
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import type { CartItem as CartItemType } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const CartDrawer = () => {
  const { items, isOpen, subtotal, closeCart, updateQuantity, removeItem, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  // If cart is not open, don't render anything
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
        onClick={closeCart}
      />
      
      {/* Cart drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed top-0 right-0 h-full w-full max-w-md bg-background shadow-lg z-50 flex flex-col"
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Your Order
          </h2>
          <Button variant="ghost" size="icon" onClick={closeCart}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {items.length > 0 ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <CartItem 
                    key={item.id} 
                    item={item} 
                    updateQuantity={updateQuantity}
                    removeItem={removeItem}
                  />
                ))}
              </AnimatePresence>
            </div>
            
            <div className="p-4 border-t">
              <div className="flex justify-between py-2 text-sm">
                <span>Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              
              <div className="flex justify-between py-2 text-sm">
                <span>Delivery Fee</span>
                <span className="font-medium">{formatCurrency(2.99)}</span>
              </div>
              
              <div className="flex justify-between py-2 font-medium">
                <span>Total</span>
                <span>{formatCurrency(subtotal + 2.99)}</span>
              </div>
              
              <div className="mt-4 space-y-2">
                <Button 
                  className="w-full" 
                  asChild
                >
                  <Link to={isAuthenticated ? "/checkout" : "/login?redirect=checkout"}>
                    Proceed to Checkout
                  </Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="rounded-full bg-primary/10 p-6 mb-4">
              <ShoppingBag className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-1">Your cart is empty</h3>
            <p className="text-muted-foreground text-center mb-6">
              Add delicious meals to your cart and order now!
            </p>
            <Button onClick={closeCart}>Continue Shopping</Button>
          </div>
        )}
      </motion.div>
    </>
  );
};

// Individual cart item component
const CartItem = ({ 
  item, 
  updateQuantity, 
  removeItem 
}: { 
  item: CartItemType; 
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-center gap-3 p-2 border rounded-lg bg-card"
    >
      <img 
        src={item.image} 
        alt={item.name} 
        className="w-20 h-20 object-cover rounded-md"
      />
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm truncate">{item.name}</h3>
        <p className="text-primary font-medium">{formatCurrency(item.price)}</p>
        
        <div className="flex items-center mt-2">
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 rounded-full"
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <Minus className="h-3 w-3" />
          </Button>
          
          <span className="w-10 text-center font-medium">{item.quantity}</span>
          
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 rounded-full"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
          
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 ml-auto text-muted-foreground"
            onClick={() => removeItem(item.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CartDrawer;
