
import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex justify-between items-center">
            <a href="/" className="font-bold text-2xl">FoodApp</a>
            <div className="flex items-center gap-4">
              <a href="/restaurants" className="hover:text-primary">Restaurants</a>
              <a href="/login" className="hover:text-primary">Login</a>
            </div>
          </nav>
        </div>
      </header>
      
      <main className="flex-1">
        {children || <Outlet />}
      </main>
      
      <footer className="border-t">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-muted-foreground">
            &copy; {new Date().getFullYear()} FoodApp. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
