import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ModeToggle from "@/components/theme/ModeToggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  ShoppingCart, 
  User, 
  LogOut, 
  Settings, 
  Bell, 
  Map, 
  Home,
  ChefHat,
  Truck,
  ShieldCheck,
  Receipt,
  CreditCard,
  Heart,
  HelpCircle,
  TicketPercent
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const Header = () => {
  const { currentUser, userRole, logout } = useAuth();
  const { totalItems, toggleCart } = useCart();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchVisible, setSearchVisible] = useState(false);

  // Track scroll position to add background to header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to search page with query
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const getDashboardLink = () => {
    switch (userRole) {
      case "vendor":
        return "/vendor/dashboard";
      case "delivery":
        return "/delivery/dashboard";
      case "admin":
      case "superadmin":
        return "/admin/dashboard";
      default:
        return "/profile";
    }
  };

    const getInitials = (name) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-3 transition-all duration-200",
        scrolled 
          ? "bg-background/80 backdrop-blur-lg shadow-sm dark:bg-background/90" 
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 whitespace-nowrap">
              Eeats
            </h1>
          </Link>

          {/* Main navigation - desktop only */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink className={cn(
                    "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    location.pathname === "/" 
                      ? "text-primary" 
                      : "text-muted-foreground hover:text-foreground"
                  )}>
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/restaurants">
                  <NavigationMenuLink className={cn(
                    "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    location.pathname.startsWith("/restaurants") 
                      ? "text-primary" 
                      : "text-muted-foreground hover:text-foreground"
                  )}>
                    Restaurants
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  location.pathname.includes("/cuisine") 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}>
                  Cuisines
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 w-[400px] grid-cols-2">
                    {[
                      { name: "Chicken", path: "/cuisine/chicken" },
                      { name: "Pizza", path: "/cuisine/pizza" },
                      { name: "Fries", path: "/cuisine/fries" },
                      { name: "Beverages", path: "/cuisine/beverages" },
                      { name: "Italian", path: "/cuisine/italian" },
                      { name: "Local", path: "/cuisine/local" },
                      { name: "American", path: "/cuisine/american" },
                      { name: "Fast Food", path: "/cuisine/fast-food" },
                    ].map((cuisine) => (
                      <li key={cuisine.name}>
                        <Link
                          to={cuisine.path}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            {cuisine.name}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/about">
                  <NavigationMenuLink className={cn(
                    "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    location.pathname === "/about" 
                      ? "text-primary" 
                      : "text-muted-foreground hover:text-foreground"
                  )}>
                    About
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/contact">
                    Contact Us
                  </Link>
                </Button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-2">
          {/* Search bar */}
          <div className="relative hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="search"
                placeholder="Search for food, restaurants..."
                className="w-[250px] pl-10 h-9 rounded-full bg-secondary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </form>
          </div>

          {/* Mobile search icon */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSearchVisible(!searchVisible)}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Theme Toggle */}
          <ModeToggle />

          {/* Cart button */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={toggleCart}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Button>

          {/* User menu */}
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={currentUser.photoURL || undefined} 
                      alt={currentUser.displayName || "User"} 
                    />
                    <AvatarFallback>{currentUser.displayName ? getInitials(currentUser.displayName) : "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">{currentUser.displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {currentUser.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/orders" className="cursor-pointer flex items-center gap-2">
                    <Receipt className="h-4 w-4" />
                    <span>My Orders</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/favorites" className="cursor-pointer flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    <span>Favorites</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/payment-methods" className="cursor-pointer flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Payment Methods</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/promos" className="cursor-pointer flex items-center gap-2">
                    <TicketPercent className="h-4 w-4" />
                    <span>Promo Codes</span>
                  </Link>
                </DropdownMenuItem>
                
                {/* Role-specific menu items */}
                {userRole === "vendor" && (
                  <DropdownMenuItem asChild>
                    <Link to="/vendor/dashboard" className="cursor-pointer flex items-center gap-2">
                      <ChefHat className="h-4 w-4" />
                      <span>Vendor Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                
                {userRole === "delivery" && (
                  <DropdownMenuItem asChild>
                    <Link to="/delivery/dashboard" className="cursor-pointer flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      <span>Delivery Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                
                {(userRole === "admin" || userRole === "superadmin") && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin/dashboard" className="cursor-pointer flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuItem asChild>
                  <Link to="/help" className="cursor-pointer flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    <span>Help & Support</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer flex items-center gap-2 text-destructive focus:text-destructive"
                  onClick={() => logout()}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile search - expandable */}
      {searchVisible && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="md:hidden px-4 py-2 bg-background border-t"
        >
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="search"
              placeholder="Search for food, restaurants..."
              className="w-full pl-10 h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </form>
        </motion.div>
      )}
    </header>
  );
};
  
export default Header;
