import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const CartContext = createContext(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error parsing saved cart:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    // Calculate total whenever cart changes
    const newTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(newTotal);
  }, [cart]);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  
  // Group items by vendor/restaurant
  const getGroupedItems = () => {
    const grouped = {};
    
    cart.forEach(item => {
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

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      toast.success('Item added to cart!');
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => {
      const itemToRemove = prevCart.find(item => item.id === itemId);
      if (itemToRemove) {
        toast.success('Item removed from cart!');
      }
      return prevCart.filter((item) => item.id !== itemId);
    });
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);
  const setDeliveryOption = (option) => setDeliveryMethod(option);

  const value = {
    cart,
    total,
    isOpen,
    totalItems,
    deliveryMethod,
    addToCart,
    removeFromCart,
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
