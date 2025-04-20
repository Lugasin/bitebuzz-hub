
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from '@/context/AuthContext';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { isLoading, isAuthenticated, userRole } = useAuth();



  // Show loading indicator while checking auth status
  if (isLoading) {
    return(
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(userRole)) {
    return <Navigate to="/not-authorized" replace />;
  }
  
  return children;
};
export default ProtectedRoute;
