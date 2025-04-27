import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

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
  isAlcoholic?: boolean;
  ageRestricted?: boolean;
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
  verifyAge: () => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [ageVerified, setAgeVerified] = useState(false);

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

  const verifyAge = () => {
    if (ageVerified) return true;
    
    const hasAlcoholicItems = items.some(item => item.isAlcoholic);
    if (!hasAlcoholicItems) return true;

    const age = prompt("Please enter your age to verify you are 21 or older:");
    if (age && parseInt(age) >= 21) {
      setAgeVerified(true);
      toast.success("Age verified successfully");
      return true;
    }
    
    toast.error("You must be 21 or older to purchase alcoholic beverages");
    return false;
  };

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
    if (item.isAlcoholic && !verifyAge()) {
      return;
    }

    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id);
      
      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += item.quantity;
        
        toast.success("Item quantity updated");
        
        return newItems;
      } else {
        toast.success("Item added to cart");
        
        return [...prevItems, item];
      }
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
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
        toast.success("Item removed from cart");
      }
      return prevItems.filter((item) => item.id !== id);
    });
  };

  const clearCart = () => {
    setItems([]);
    toast.success("Cart cleared");
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
    setDeliveryOption,
    verifyAge
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
