
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/layouts/MainLayout';
import NotFound from '@/pages/NotFound';
import NotAuthorized from '@/pages/NotAuthorized';

// Layout components
const VendorLayout = lazy(() => import('@/layouts/VendorLayout'));
const DeliveryLayout = lazy(() => import('@/layouts/DeliveryLayout'));

// Public pages
const Index = lazy(() => import('@/pages/Index'));
const Login = lazy(() => import('@/pages/auth/Login'));
const Register = lazy(() => import('@/pages/auth/Register'));
const GuestOrder = lazy(() => import('@/pages/auth/GuestOrder'));
const RestaurantsList = lazy(() => import('@/pages/customer/RestaurantsList'));
const RestaurantDetails = lazy(() => import('@/pages/customer/RestaurantDetails'));
const About = lazy(() => import('@/pages/info/About'));
const Contact = lazy(() => import('@/pages/info/Contact'));
const FAQ = lazy(() => import('@/pages/info/FAQ'));
const Terms = lazy(() => import('@/pages/info/Terms'));
const Privacy = lazy(() => import('@/pages/info/Privacy'));
const Help = lazy(() => import('@/pages/info/Help'));
const TrackingPage = lazy(() => import('@/pages/tracking/Index'));

// Customer pages
const CustomerDashboard = lazy(() => import('@/pages/customer/Dashboard'));
const Checkout = lazy(() => import('@/pages/customer/Checkout'));
const OrderHistory = lazy(() => import('@/pages/customer/OrderHistory'));
const OrderDetails = lazy(() => import('@/pages/customer/OrderDetails'));
const Profile = lazy(() => import('@/pages/customer/Profile'));
const MealPlanningPage = lazy(() => import('@/pages/mealplanning/Index'));

// Vendor pages
const VendorDashboard = lazy(() => import('@/pages/vendor/Dashboard'));
const VendorMenu = lazy(() => import('@/pages/vendor/Menu'));
const VendorOrders = lazy(() => import('@/pages/vendor/Orders'));
const VendorProfile = lazy(() => import('@/pages/vendor/Profile'));
const VendorAnalytics = lazy(() => import('@/pages/vendor/Analytics'));

// Delivery pages
const DeliveryDashboard = lazy(() => import('@/pages/delivery/Dashboard'));
const DeliverySignup = lazy(() => import('@/pages/delivery/signup'));
const DeliveryOrders = lazy(() => import('@/pages/delivery/Orders'));
const DeliveryProfile = lazy(() => import('@/pages/delivery/Profile'));
const DeliveryAnalytics = lazy(() => import('@/pages/delivery/Analytics'));

// Admin pages
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const AdminUsers = lazy(() => import('@/pages/admin/Users'));
const AdminVendors = lazy(() => import('@/pages/admin/Vendors'));
const AdminOrders = lazy(() => import('@/pages/admin/Orders'));

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Private Route with role-based access control
const PrivateRoute = ({ children, requiredRoles = [] }: { children: React.ReactNode, requiredRoles: string[] }) => {
  const { currentUser, userRole, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
    return <Navigate to="/not-authorized" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route element={<MainLayout />}>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/guest-order" element={<GuestOrder />} />
          <Route path="/restaurants" element={<RestaurantsList />} />
          <Route path="/restaurant/:id" element={<RestaurantDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/help" element={<Help />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/track-order/:id" element={<TrackingPage />} />
          <Route path="/track-order" element={<TrackingPage />} />
          <Route path="/not-authorized" element={<NotAuthorized />} />
          
          {/* Customer Routes */}
          <Route path="/customer">
            <Route path="dashboard" element={
              <PrivateRoute requiredRoles={["customer"]}>
                <CustomerDashboard />
              </PrivateRoute>
            } />
            <Route path="checkout" element={
              <PrivateRoute requiredRoles={["customer", "guest"]}>
                <Checkout />
              </PrivateRoute>
            } />
            <Route path="orders" element={
              <PrivateRoute requiredRoles={["customer"]}>
                <OrderHistory />
              </PrivateRoute>
            } />
            <Route path="orders/:id" element={
              <PrivateRoute requiredRoles={["customer", "guest"]}>
                <OrderDetails />
              </PrivateRoute>
            } />
            <Route path="profile" element={
              <PrivateRoute requiredRoles={["customer"]}>
                <Profile />
              </PrivateRoute>
            } />
            <Route path="meal-planning" element={
              <PrivateRoute requiredRoles={["customer"]}>
                <MealPlanningPage />
              </PrivateRoute>
            } />
          </Route>
          
          {/* Vendor Routes */}
          <Route path="/vendor" element={
            <PrivateRoute requiredRoles={["vendor"]}>
              <VendorLayout />
            </PrivateRoute>
          }>
            <Route path="dashboard" element={<VendorDashboard />} />
            <Route path="menu" element={<VendorMenu />} />
            <Route path="orders" element={<VendorOrders />} />
            <Route path="profile" element={<VendorProfile />} />
            <Route path="analytics" element={<VendorAnalytics />} />
          </Route>
          
          {/* Delivery Routes */}
          <Route path="/delivery" element={
            <PrivateRoute requiredRoles={["delivery"]}>
              <DeliveryLayout />
            </PrivateRoute>
          }>
            <Route path="dashboard" element={<DeliveryDashboard />} />
            <Route path="orders" element={<DeliveryOrders />} />
            <Route path="profile" element={<DeliveryProfile />} />
            <Route path="analytics" element={<DeliveryAnalytics />} />
          </Route>
          <Route path="/delivery/signup" element={<DeliverySignup />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <PrivateRoute requiredRoles={["admin", "superadmin"]}>
              <div className="admin-layout">
                <div className="admin-content">
                  <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                      <Route path="/dashboard" element={<AdminDashboard />} />
                      <Route path="/users" element={<AdminUsers />} />
                      <Route path="/vendors" element={<AdminVendors />} />
                      <Route path="/orders" element={<AdminOrders />} />
                    </Routes>
                  </Suspense>
                </div>
              </div>
            </PrivateRoute>
          }>
          </Route>
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
