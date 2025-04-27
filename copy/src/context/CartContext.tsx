
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  vendorId: string;
  restaurantName?: string;
  size?: string;
  addOns?: Array<{ id: string; name: string; price: number }>;
}

interface GroupedItems {
  [key: string]: {
    items: CartItem[];
    restaurantName: string;
    subtotal: number;
  }
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  subtotal: number;
  deliveryMethod: 'delivery' | 'pickup';
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getGroupedItems: () => GroupedItems;
  setDeliveryOption: (option: 'delivery' | 'pickup') => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const { toast } = useToast();

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error parsing saved cart:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Group items by vendor/restaurant
  const getGroupedItems = (): GroupedItems => {
    const grouped: GroupedItems = {};
    
    items.forEach(item => {
      const vendorId = item.vendorId;
      
      if (!grouped[vendorId]) {
        grouped[vendorId] = {
          items: [],
          restaurantName: item.restaurantName || "Restaurant",
          subtotal: 0
        };
      }
      
      grouped[vendorId].items.push(item);
      grouped[vendorId].subtotal += item.price * item.quantity;
    });
    
    return grouped;
  };

  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id);
      
      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += item.quantity;
        
        toast({
          variant: "default",
          title: "Updated cart",
          description: `${item.name} quantity updated to ${newItems[existingItemIndex].quantity}`,
          duration: 3000
        });
        
        return newItems;
      } else {
        toast({
          variant: "default",
          title: "Added to cart",
          description: `${item.name} added to your cart.`,
          duration: 3000
        });
        
        return [...prevItems, item];
      }
    });
    
    // Don't auto-open cart when adding items
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => {
      const itemToRemove = prevItems.find(item => item.id === id);
      if (itemToRemove) {
        toast({
          title: "Removed from cart",
          description: `${itemToRemove.name} removed from your cart.`,
          duration: 3000
        });
      }
      return prevItems.filter((item) => item.id !== id);
    });
  };

  const clearCart = () => {
    setItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
      duration: 3000
    });
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);
  const setDeliveryOption = (option: 'delivery' | 'pickup') => setDeliveryMethod(option);

  const value: CartContextType = {
    items,
    isOpen,
    totalItems,
    subtotal,
    deliveryMethod,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
    getGroupedItems,
    setDeliveryOption
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
