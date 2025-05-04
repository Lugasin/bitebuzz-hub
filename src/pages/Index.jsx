
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to FoodApp</h1>
      <p className="text-xl mb-8 max-w-2xl mx-auto">
        Order food from your favorite restaurants with just a few clicks.
      </p>
      <Button asChild size="lg">
        <Link to="/restaurants">Browse Restaurants</Link>
      </Button>
    </div>
  );
};

export default Index;
