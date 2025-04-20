
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Plus, 
  Minus, 
  ShoppingBag,
  Truck,
  Store,
  CornerDownRight
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

const CartDrawer = () => {
  const { 
    items, 
    isOpen, 
    subtotal, 
    closeCart, 
    updateQuantity, 
    removeItem, 
    clearCart,
    getGroupedItems,
    deliveryMethod,
    setDeliveryOption
  } = useCart();
  const { isAuthenticated } = useAuth();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in or sign up to proceed to checkout.",
        variant: "info",
      });      
    }
    
  };


   // Get grouped items by restaurant
  const groupedItems = getGroupedItems();
  const multipleRestaurants = Object.keys(groupedItems).length > 1;

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
        className="fixed top-0 right-0 h-full w-full max-w-md bg-background shadow-lg z-50 flex flex-col dark:bg-card"
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
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Delivery Method Selection */}
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="font-medium mb-3">Choose delivery method:</h3>
                <RadioGroup
                  defaultValue={deliveryMethod} 
                  onValueChange={setDeliveryOption}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery" className="flex items-center gap-1" >
                      <Truck className="h-4 w-4" />
                      <span>Delivery</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup" className="flex items-center gap-1">
                      <Store className="h-4 w-4" />
                      <span>Self Pickup</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Display items grouped by restaurant */}
              <AnimatePresence>
                {Object.keys(groupedItems).map((vendorId) => (
                  <motion.div
                    key={vendorId}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm flex items-center gap-1">
                        <Store className="h-4 w-4" />
                        {groupedItems[vendorId].restaurantName}
                      </h3>
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency(groupedItems[vendorId].subtotal, 'K')}
                      </span>
                    </div>
                    
                    {groupedItems[vendorId].items.map((item) => (
                      <CartItem 
                        key={item.id} 
                        item={item} 
                        updateQuantity={updateQuantity}
                        removeItem={removeItem}
                      />
                    ))}
                    
                    {multipleRestaurants && <div className="border-t my-2"></div>}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            <div className="p-4 border-t">
              <div className="flex justify-between py-2 text-sm">
                <span>Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal, 'K')}</span>
              </div>
              
              <div className="flex justify-between py-2 text-sm">
                <span>{deliveryMethod === 'pickup' ? 'Pickup Fee' : 'Delivery Fee'}</span>
                <span className="font-medium">
                  {deliveryMethod === 'pickup' ? 'Free' : formatCurrency(multipleRestaurants ? 60 : 30, 'K')}
                </span>
              </div>
              
              <div className="flex justify-between py-2 font-medium">
                <span>Total</span>
                <span>
                  {formatCurrency(
                    subtotal + (deliveryMethod === 'pickup' ? 0 : (multipleRestaurants ? 60 : 30)), 
                    'K'
                  )}
                </span>
              </div>
              
              <div className="mt-4 space-y-2">
                {isAuthenticated ? (
                  <Link to="/customer/checkout">
                    <Button className="w-full">Proceed to Checkout</Button>
                  </Link>
                ) : (
                  <Link to="/login?redirect=customer/checkout">
                     <Button
                    className="w-full"
                    onClick={handleCheckout}>Proceed to Checkout</Button>
                  </Link>
                )}
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
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-center gap-3 p-2 border rounded-lg bg-card group hover:shadow-md transition-shadow"
    >
      <img 
        src={item.image} 
        alt={item.name} 
        className="w-20 h-20 object-cover rounded-md"
      />
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm truncate">{item.name}</h3>
        <p className="text-primary font-medium">{formatCurrency(item.price, 'K')}</p>
        
        {item.size && (
          <p className="text-xs text-muted-foreground">Size: {item.size}</p>
        )}
        
        {item.addOns && item.addOns.length > 0 && (
          <div className="text-xs text-muted-foreground mt-1">
            <span>Add-ons:</span>
            {item.addOns.map((addon, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <CornerDownRight className="h-3 w-3" />
                <span>{addon.name}</span>
                <span className="text-primary">(+{formatCurrency(addon.price, 'K')})</span>
              </div>
            ))}
          </div>
        )}
        
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
            className="h-8 w-8 ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
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
