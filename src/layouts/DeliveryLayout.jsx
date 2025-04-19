
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  Home, 
  ChevronRight, 
  LogOut, 
  User, 
  Settings, 
  Menu, 
  X,
  BarChart2,
  Navigation,
  ClipboardList,
  Bell,
  Wallet,
  MapPin,
  LifeBuoy
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const DeliveryLayout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: error.message || "Something went wrong. Please try again.",
      });
    }
  };

  const navLinks = [
    { path: '/delivery/dashboard', label: 'Dashboard', icon: Home },
    { path: '/delivery/orders', label: 'Orders', icon: ClipboardList },
    { path: '/delivery/analytics', label: 'Earnings & Analytics', icon: BarChart2 },
    { path: '/delivery/map', label: 'Live Map', icon: MapPin },
    { path: '/delivery/earnings', label: 'Wallet', icon: Wallet },
    { path: '/delivery/profile', label: 'Profile', icon: User },
    { path: '/delivery/help', label: 'Support', icon: LifeBuoy },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top navbar */}
      <header className="bg-background border-b sticky top-0 z-30">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <button 
                className="md:hidden p-2" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <Link to="/delivery/dashboard" className="flex items-center gap-2">
                <img 
                  src="/favicon.svg" 
                  alt="E-eats" 
                  className="h-8 w-8" 
                />
                <span className="font-bold text-lg hidden sm:inline-block">Delivery Partner</span>
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              <Button size="icon" variant="ghost" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              
              <div className="hidden md:flex items-center gap-1 text-sm">
                <span className="text-muted-foreground">Signed in as</span>
                <span className="font-medium">{currentUser?.displayName || currentUser?.email}</span>
              </div>
              
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1">
        {/* Side navigation - desktop */}
        <aside className="border-r w-64 hidden md:block sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-4">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    location.pathname === link.path
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <link.icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
        
        {/* Mobile navigation - overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden">
            <div className="fixed top-16 left-0 bottom-0 w-3/4 bg-background border-r p-4 overflow-y-auto">
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                      location.pathname === link.path
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <link.icon className="h-5 w-5" />
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Main content */}
        <main className="flex-1">
          {/* Breadcrumb */}
          <div className="border-b">
            <div className="container mx-auto px-4">
              <div className="py-2 flex items-center text-sm">
                <Link to="/delivery/dashboard" className="text-muted-foreground hover:text-foreground">
                  Dashboard
                </Link>
                {location.pathname !== '/delivery/dashboard' && (
                  <>
                    <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
                    <span className="font-medium">
                      {navLinks.find(link => link.path === location.pathname)?.label || 'Page'}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {children}
        </main>
      </div>
    </div>
  );
};

export default DeliveryLayout;
