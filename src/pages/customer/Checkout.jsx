
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import {
  CreditCard,
  Banknote,
  Wallet,
  ShieldCheck,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle2,
  Trash2
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const Checkout = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { items, totalAmount, clearCart, removeItem } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [address, setAddress] = useState({
    streetAddress: "",
    city: "",
    postalCode: "",
    instructions: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate fees and totals
  const subtotal = totalAmount;
  const deliveryFee = 30;
  const serviceFee = 10;
  const total = subtotal + deliveryFee + serviceFee;
  
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateForm = () => {
    if (!address.streetAddress || !address.city || !address.postalCode) {
      toast({
        title: "Missing information",
        description: "Please fill in all the required address fields.",
        variant: "destructive"
      });
      return false;
    }
    
    if (!items.length) {
      toast({
        title: "Empty cart",
        description: "Your cart is empty. Please add items to proceed.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsProcessing(true);
    
    // Simulate API call for payment processing
    setTimeout(() => {
      // Success scenario
      toast({
        title: "Order placed successfully!",
        description: "Your food is being prepared and will be delivered soon.",
      });
      
      // Generate a random order ID
      const orderId = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      // Clear cart
      clearCart();
      
      // Redirect to order confirmation page
      navigate(`/order/${orderId}`);
      
      setIsProcessing(false);
    }, 2000);
  };

  const handleRemoveItem = (id) => {
    removeItem(id);
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart.",
    });
  };

  if (items.length === 0 && !isProcessing) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <AlertCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Button onClick={() => navigate("/restaurants")}>
            Browse Restaurants
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Address and Payment */}
          <div className="lg:col-span-2">
            <form onSubmit={handleCheckout}>
              {/* Delivery Address */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    Delivery Address
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="streetAddress">Street Address*</Label>
                      <Input 
                        id="streetAddress" 
                        name="streetAddress" 
                        placeholder="123 Main St, Apt 4B" 
                        required
                        value={address.streetAddress}
                        onChange={handleAddressChange}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City*</Label>
                        <Input 
                          id="city" 
                          name="city" 
                          placeholder="New York" 
                          required
                          value={address.city}
                          onChange={handleAddressChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Postal Code*</Label>
                        <Input 
                          id="postalCode" 
                          name="postalCode" 
                          placeholder="10001" 
                          required
                          value={address.postalCode}
                          onChange={handleAddressChange}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="instructions">Delivery Instructions (Optional)</Label>
                      <Textarea 
                        id="instructions" 
                        name="instructions" 
                        placeholder="E.g., Ring doorbell, call when outside, etc."
                        rows={3}
                        value={address.instructions}
                        onChange={handleAddressChange}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Payment Method */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <Wallet className="mr-2 h-5 w-5" />
                    Payment Method
                  </h2>
                  
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                    <div className="flex items-center space-x-2 border p-4 rounded-md cursor-pointer hover:bg-accent">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center cursor-pointer">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Credit/Debit Card
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 border p-4 rounded-md cursor-pointer hover:bg-accent">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="flex items-center cursor-pointer">
                        <Banknote className="mr-2 h-4 w-4" />
                        Cash on Delivery
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 border p-4 rounded-md cursor-pointer hover:bg-accent">
                      <RadioGroupItem value="wallet" id="wallet" />
                      <Label htmlFor="wallet" className="flex items-center cursor-pointer">
                        <Wallet className="mr-2 h-4 w-4" />
                        E-eats Wallet
                      </Label>
                    </div>
                  </RadioGroup>
                  
                  {paymentMethod === "card" && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input id="expiryDate" placeholder="MM/YY" />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Delivery Time */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <Clock className="mr-2 h-5 w-5" />
                    Delivery Time
                  </h2>
                  
                  <RadioGroup defaultValue="standard" className="space-y-4">
                    <div className="flex items-center space-x-2 border p-4 rounded-md cursor-pointer hover:bg-accent">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard" className="flex-1 cursor-pointer">
                        <div className="flex justify-between">
                          <span className="font-medium">Standard Delivery</span>
                          <span>30-45 min</span>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 border p-4 rounded-md cursor-pointer hover:bg-accent">
                      <RadioGroupItem value="scheduled" id="scheduled" />
                      <Label htmlFor="scheduled" className="flex-1 cursor-pointer">
                        <div className="flex justify-between">
                          <span className="font-medium">Schedule for Later</span>
                          <span>Select Time</span>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </form>
          </div>
          
          {/* Right column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                
                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="h-16 w-16 rounded overflow-hidden flex-shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} x {formatCurrency(item.price)}
                          </p>
                          {item.size && (
                            <p className="text-xs text-muted-foreground">Size: {item.size}</p>
                          )}
                          {item.addOns && item.addOns.length > 0 && (
                            <p className="text-xs text-muted-foreground">
                              Add-ons: {item.addOns.map(a => a.name).join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className="font-medium">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-muted-foreground"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                {/* Cost Breakdown */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span>{formatCurrency(deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service Fee</span>
                    <span>{formatCurrency(serviceFee)}</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                {/* Total */}
                <div className="flex justify-between font-bold text-lg mb-6">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                
                <div className="flex items-center mb-4 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 mr-2 text-primary" />
                  <span>Secure payment processed by E-eats</span>
                </div>
                
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isProcessing || items.length === 0}
                >
                  {isProcessing ? "Processing..." : "Place Order"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Checkout;
