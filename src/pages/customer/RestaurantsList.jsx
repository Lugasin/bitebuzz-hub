
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const RestaurantsList = () => {
  // Mock data - in a real app this would come from an API
  const restaurants = [
    {
      id: 1, 
      name: "Pizza Palace",
      description: "Delicious pizza and Italian cuisine",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      cuisine: "Italian",
      rating: 4.5,
      categories: ["Pizza", "Pasta", "Salads"]
    },
    {
      id: 2,
      name: "Burger Joint",
      description: "Best burgers in town",
      image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",
      cuisine: "American",
      rating: 4.2,
      categories: ["Burgers", "Fries", "Shakes"]
    },
    {
      id: 3,
      name: "Sushi Bar",
      description: "Fresh and authentic Japanese cuisine",
      image: "https://images.unsplash.com/photo-1617196034183-421b4917c92d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      cuisine: "Japanese",
      rating: 4.8,
      categories: ["Sushi", "Ramen", "Tempura"]
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Restaurants</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <Card key={restaurant.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <img 
              src={restaurant.image} 
              alt={restaurant.name} 
              className="w-full h-48 object-cover"
            />
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-bold">{restaurant.name}</h2>
                <Badge variant="success">{restaurant.rating}</Badge>
              </div>
              <p className="text-muted-foreground mb-2">{restaurant.description}</p>
              
              <div className="mb-3">
                <Badge variant="outline" className="mr-2">{restaurant.cuisine}</Badge>
                {restaurant.categories.map((category, index) => (
                  <Badge key={index} variant="secondary" className="mr-2 mb-2">{category}</Badge>
                ))}
              </div>
              
              <Button>View Menu</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RestaurantsList;
