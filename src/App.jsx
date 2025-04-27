import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext.tsx";
import { CartProvider } from "@/context/CartContext";
import { UserProvider } from "@/context/UserContext.tsx";
import { ThemeProvider } from "@/context/ThemeContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound"
import NotAuthorized from "./pages/NotAuthorized";

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
import EditProfile from "./pages/customer/EditProfile";
import DeleteProfile from "./pages/customer/DeleteProfile";

// Catalog pages
import BeveragesPage from "./pages/catalog/BeveragesPage";
import FoodsPage from "./pages/catalog/FoodsPage";

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
import DeliveryProfile from "./pages/delivery/DeliveryProfile";
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
import VendorLayout from "./layouts/VendorLayout";
import DeliveryLayout from "./layouts/DeliveryLayout";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <AuthProvider>
          <UserProvider>
            <CartProvider>  
              <Toaster />
              <BrowserRouter>
                <Routes>
                  {/* Public Routes with MainLayout */}
                  <Route element={<MainLayout />}>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/guest-order" element={<GuestOrder />} />
                    <Route path="/restaurants" element={<RestaurantsList />} />
                    <Route path="/restaurant/:id" element={<RestaurantDetails />} />
                    <Route path="/beverages" element={<BeveragesPage />} />
                    <Route path="/foods" element={<FoodsPage />} />
                    <Route path="/meal-planning" element={<MealPlanningPage />} />
                    <Route path="/track-order/:id" element={<TrackingPage />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/cookies" element={<Cookies />} />
                    <Route path="/careers" element={<Careers />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="/not-authorized" element={<NotAuthorized />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>

                  {/* Customer Routes */}
                  <Route path="/customer" element={<ProtectedRoute roles={["customer"]}><MainLayout /></ProtectedRoute>}>
                    <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                    <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
                    <Route path="order/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
                    <Route path="dashboard" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
                    <Route path="edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
                    <Route path="delete-profile" element={<ProtectedRoute><DeleteProfile /></ProtectedRoute>} />
                  </Route>
                  
                  {/* Vendor Routes */}
                  <Route path="/vendor" element={<ProtectedRoute roles={["vendor"]}><VendorLayout /></ProtectedRoute>}>
                    <Route path="dashboard" element={<ProtectedRoute><VendorDashboard /></ProtectedRoute>} />
                    <Route path="menu" element={<ProtectedRoute><VendorMenu /></ProtectedRoute>} />
                    <Route path="orders" element={<ProtectedRoute><VendorOrders /></ProtectedRoute>} />
                    <Route path="profile" element={<ProtectedRoute><VendorProfile /></ProtectedRoute>} />
                    <Route path="analytics" element={<VendorAnalytics />} />
                  </Route>

                  {/* Delivery Routes */}
                  <Route path="/delivery" element={<ProtectedRoute roles={["delivery"]}><DeliveryLayout /></ProtectedRoute>}>
                    <Route path="dashboard" element={<DeliveryDashboard />} />
                    <Route path="signup" element={<DeliverySignup />} />
                    <Route path="orders" element={<DeliveryOrders />} />
                    <Route path="profile" element={<DeliveryProfile />} />
                    <Route path="analytics" element={<DeliveryAnalytics />} />
                  </Route>

                  {/* Admin Routes */}
                  <Route path="/admin" element={<ProtectedRoute roles={["admin", "superadmin"]}><MainLayout /></ProtectedRoute>}>
                    <Route path="dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                    <Route path="users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
                    <Route path="vendors" element={<ProtectedRoute><AdminVendors /></ProtectedRoute>} />
                    <Route path="orders" element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </CartProvider>
          </UserProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
