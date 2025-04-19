
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Customer pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import GuestOrder from "./pages/auth/GuestOrder";
import CustomerDashboard from "./pages/customer/Dashboard";
import RestaurantsList from "./pages/customer/RestaurantsList";
import RestaurantDetails from "./pages/customer/RestaurantDetails";
import Checkout from "./pages/customer/Checkout";
import OrderHistory from "./pages/customer/OrderHistory";
import OrderDetails from "./pages/customer/OrderDetails";
import Profile from "./pages/customer/Profile";

// Advanced features
import MealPlanningPage from "./pages/mealplanning/Index";
import TrackingPage from "./pages/tracking/Index";

// Vendor pages
import VendorDashboard from "./pages/vendor/Dashboard";
import VendorMenu from "./pages/vendor/Menu";
import VendorOrders from "./pages/vendor/Orders";
import VendorProfile from "./pages/vendor/Profile";
import VendorAnalytics from "./pages/vendor/Analytics";

// Delivery pages
import DeliveryDashboard from "./pages/delivery/Dashboard";
import DeliverySignup from "./pages/delivery/signup";
import DeliveryOrders from "./pages/delivery/Orders";
import DeliveryProfile from "./pages/delivery/Profile";
import DeliveryAnalytics from "./pages/delivery/Analytics";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminVendors from "./pages/admin/Vendors";
import AdminOrders from "./pages/admin/Orders";

// Info pages
import About from "./pages/info/About";
import Contact from "./pages/info/Contact";
import FAQ from "./pages/info/FAQ";
import Terms from "./pages/info/Terms";
import Privacy from "./pages/info/Privacy";
import Cookies from "./pages/info/Cookies";
import Careers from "./pages/info/Careers";
import Help from "./pages/info/Help";

// Protected route component
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/guest-order" element={<GuestOrder />} />
                
                {/* Customer Routes */}
                <Route path="/restaurants" element={<RestaurantsList />} />
                <Route path="/restaurant/:id" element={<RestaurantDetails />} />
                <Route path="/checkout" element={
                  <ProtectedRoute allowedRoles={["customer", "guest"]}>
                    <Checkout />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute allowedRoles={["customer", "vendor", "delivery", "admin", "superadmin"]}>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute allowedRoles={["customer"]}>
                    <OrderHistory />
                  </ProtectedRoute>
                } />
                <Route path="/order/:id" element={
                  <ProtectedRoute allowedRoles={["customer", "guest"]}>
                    <OrderDetails />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute allowedRoles={["customer"]}>
                    <CustomerDashboard />
                  </ProtectedRoute>
                } />
                
                {/* Advanced Feature Routes */}
                <Route path="/meal-planning" element={<MealPlanningPage />} />
                <Route path="/track-order/:id" element={<TrackingPage />} />
                <Route path="/track-order" element={<TrackingPage />} />
                
                {/* Vendor Routes */}
                <Route path="/vendor/dashboard" element={
                  <ProtectedRoute allowedRoles={["vendor"]}>
                    <VendorDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/vendor/menu" element={
                  <ProtectedRoute allowedRoles={["vendor"]}>
                    <VendorMenu />
                  </ProtectedRoute>
                } />
                <Route path="/vendor/orders" element={
                  <ProtectedRoute allowedRoles={["vendor"]}>
                    <VendorOrders />
                  </ProtectedRoute>
                } />
                <Route path="/vendor/profile" element={
                  <ProtectedRoute allowedRoles={["vendor"]}>
                    <VendorProfile />
                  </ProtectedRoute>
                } />
                <Route path="/vendor/analytics" element={
                  <ProtectedRoute allowedRoles={["vendor"]}>
                    <VendorAnalytics />
                  </ProtectedRoute>
                } />
                
                {/* Delivery Routes */}
                <Route path="/delivery/dashboard" element={
                  <ProtectedRoute allowedRoles={["delivery"]}>
                    <DeliveryDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/delivery/signup" element={<DeliverySignup />} />
                <Route path="/delivery/orders" element={
                  <ProtectedRoute allowedRoles={["delivery"]}>
                    <DeliveryOrders />
                  </ProtectedRoute>
                } />
                <Route path="/delivery/profile" element={
                  <ProtectedRoute allowedRoles={["delivery"]}>
                    <DeliveryProfile />
                  </ProtectedRoute>
                } />
                <Route path="/delivery/analytics" element={
                  <ProtectedRoute allowedRoles={["delivery"]}>
                    <DeliveryAnalytics />
                  </ProtectedRoute>
                } />
                
                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/users" element={
                  <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                    <AdminUsers />
                  </ProtectedRoute>
                } />
                <Route path="/admin/vendors" element={
                  <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                    <AdminVendors />
                  </ProtectedRoute>
                } />
                <Route path="/admin/orders" element={
                  <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                    <AdminOrders />
                  </ProtectedRoute>
                } />
                
                {/* Info Pages */}
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/help" element={<Help />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/cookies" element={<Cookies />} />
                <Route path="/careers" element={<Careers />} />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
