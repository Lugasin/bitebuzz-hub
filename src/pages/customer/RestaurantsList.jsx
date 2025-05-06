import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  Filter, 
  ChevronDown 
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mock restaurant data
const restaurants = [
  {
    id: 1,
    name: "Burger Place",
    image: "https://images.unsplash.com/photo-1586816001966-79b736744398?q=80&w=500&auto=format&fit=crop",
    rating: 4.7,
    deliveryTime: "15-25 min",
    minOrder: 10,
    deliveryFee: 2.5,
    tags: ["Burgers", "Fast Food", "American"],
    distance: 1.2,
    address: "123 Main St",
    isOpen: true,
    priceRange: "$$"
  },
  {
    id: 2,
    name: "Pizza Palace",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=500&auto=format&fit=crop",
    rating: 4.5,
    deliveryTime: "20-30 min",
    minOrder: 15,
    deliveryFee: 1.5,
    tags: ["Pizza", "Italian", "Pasta"],
    distance: 0.8,
    address: "456 Oak Ave",
    isOpen: true,
    priceRange: "$$$"
  },
  {
    id: 3,
    name: "Sushi Express",
    image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=500&auto=format&fit=crop",
    rating: 4.9,
    deliveryTime: "25-35 min",
    minOrder: 20,
    deliveryFee: 3.0,
    tags: ["Japanese", "Sushi", "Asian"],
    distance: 1.5,
    address: "789 Pine Blvd",
    isOpen: true,
    priceRange: "$$$$"
  },
  {
    id: 4,
    name: "Taco Time",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=500&auto=format&fit=crop",
    rating: 4.2,
    deliveryTime: "15-25 min",
    minOrder: 8,
    deliveryFee: 1.0,
    tags: ["Mexican", "Tacos", "Quick Bites"],
    distance: 0.5,
    address: "321 Elm St",
    isOpen: false,
    priceRange: "$"
  },
  {
    id: 5,
    name: "Thai Delight",
    image: "https://images.unsplash.com/photo-1580212206672-29a7d64af3f9?q=80&w=500&auto=format&fit=crop",
    rating: 4.6,
    deliveryTime: "30-40 min",
    minOrder: 12,
    deliveryFee: 2.0,
    tags: ["Thai", "Spicy", "Asian"],
    distance: 2.0,
    address: "567 Maple Dr",
    isOpen: true,
    priceRange: "$$"
  },
  {
    id: 6,
    name: "Salad Bar",
    image: "https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?q=80&w=500&auto=format&fit=crop",
    rating: 4.4,
    deliveryTime: "10-20 min",
    minOrder: 15,
    deliveryFee: 1.8,
    tags: ["Healthy", "Salads", "Vegan"],
    distance: 1.1,
    address: "890 Cedar Ln",
    isOpen: true,
    priceRange: "$$"
  }
];

const RestaurantsList = () => {
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurants);
  const [sortBy, setSortBy] = useState('recommended');
  const [filter, setFilter] = useState({
    openOnly: false,
    maxDeliveryFee: 5,
    maxDistance: 5,
    cuisine: 'all'
  });
  
  // Filter and sort restaurants
  useEffect(() => {
    let result = [...restaurants];
    
    // Apply search term filter
    if (searchTerm) {
      result = result.filter(r => 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply additional filters
    if (filter.openOnly) {
      result = result.filter(r => r.isOpen);
    }
    
    if (filter.maxDeliveryFee < 5) {
      result = result.filter(r => r.deliveryFee <= filter.maxDeliveryFee);
    }
    
    if (filter.maxDistance < 5) {
      result = result.filter(r => r.distance <= filter.maxDistance);
    }
    
    if (filter.cuisine !== 'all') {
      result = result.filter(r => r.tags.some(t => t.toLowerCase() === filter.cuisine.toLowerCase()));
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'delivery_time':
        result.sort((a, b) => {
          const aTime = parseInt(a.deliveryTime.split('-')[0]);
          const bTime = parseInt(b.deliveryTime.split('-')[0]);
          return aTime - bTime;
        });
        break;
      case 'distance':
        result.sort((a, b) => a.distance - b.distance);
        break;
      case 'price_low':
        result.sort((a, b) => a.priceRange.length - b.priceRange.length);
        break;
      case 'price_high':
        result.sort((a, b) => b.priceRange.length - a.priceRange.length);
        break;
      default: // recommended
        // Keep original order (which is assumed to be recommended)
        break;
    }
    
    setFilteredRestaurants(result);
  }, [searchTerm, sortBy, filter]);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleFilterChange = (key, value) => {
    setFilter(prev => ({ ...prev, [key]: value }));
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Restaurants</h1>
      <p className="text-muted-foreground mb-6">
        Discover the best food for delivery near you
      </p>
      
      {/* Search and filter section */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search for restaurants or cuisines"
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sort by</SelectLabel>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="delivery_time">Delivery Time</SelectItem>
                <SelectItem value="distance">Distance</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" /> Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Restaurants</SheetTitle>
                <SheetDescription>
                  Customize your restaurant search with these filters
                </SheetDescription>
              </SheetHeader>
              
              <div className="py-6 space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">Restaurant Status</h3>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="open-only" 
                      checked={filter.openOnly}
                      onChange={(e) => handleFilterChange('openOnly', e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="open-only">Open now</label>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-3">Delivery Fee</h3>
                  <div className="flex flex-col space-y-2">
                    <input 
                      type="range" 
                      min="0" 
                      max="5" 
                      step="0.5" 
                      value={filter.maxDeliveryFee}
                      onChange={(e) => handleFilterChange('maxDeliveryFee', parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>$0</span>
                      <span>Up to ${filter.maxDeliveryFee}</span>
                      <span>$5+</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-3">Distance</h3>
                  <div className="flex flex-col space-y-2">
                    <input 
                      type="range" 
                      min="0" 
                      max="5" 
                      step="0.5" 
                      value={filter.maxDistance}
                      onChange={(e) => handleFilterChange('maxDistance', parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0 mi</span>
                      <span>Up to {filter.maxDistance} mi</span>
                      <span>5+ mi</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-3">Cuisine</h3>
                  <Select 
                    value={filter.cuisine} 
                    onValueChange={(value) => handleFilterChange('cuisine', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All cuisines" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All cuisines</SelectItem>
                      <SelectItem value="american">American</SelectItem>
                      <SelectItem value="italian">Italian</SelectItem>
                      <SelectItem value="mexican">Mexican</SelectItem>
                      <SelectItem value="asian">Asian</SelectItem>
                      <SelectItem value="japanese">Japanese</SelectItem>
                      <SelectItem value="thai">Thai</SelectItem>
                      <SelectItem value="healthy">Healthy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={() => setFilter({
                    openOnly: false,
                    maxDeliveryFee: 5,
                    maxDistance: 5,
                    cuisine: 'all'
                  })}
                  variant="outline" 
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Results count */}
      <p className="text-muted-foreground mb-4">
        {filteredRestaurants.length} restaurants found
      </p>
      
      {/* Restaurant grid */}
      {filteredRestaurants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <Link to={`/restaurant/${restaurant.id}`} key={restaurant.id}>
              <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
                <div className="relative">
                  <img 
                    src={restaurant.image} 
                    alt={restaurant.name}
                    className="h-48 w-full object-cover"
                  />
                  {!restaurant.isOpen && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <p className="text-white font-medium text-lg">Currently Closed</p>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{restaurant.name}</CardTitle>
                    <Badge variant={restaurant.rating >= 4.5 ? "success" : "default"}>
                      <Star className="h-3 w-3 mr-1" />
                      {restaurant.rating}
                    </Badge>
                  </div>
                  <CardDescription className="flex flex-wrap gap-2 mt-1">
                    {restaurant.tags.map((tag, idx) => (
                      <span key={idx} className="text-xs">{tag}{idx < restaurant.tags.length - 1 ? ' • ' : ''}</span>
                    ))}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{restaurant.deliveryTime}</span>
                      <span className="mx-1">•</span>
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{restaurant.distance} mi</span>
                      <span className="mx-1">•</span>
                      <span>{restaurant.priceRange}</span>
                    </div>
                    <div>
                      Delivery fee: ${restaurant.deliveryFee.toFixed(2)} • Min: ${restaurant.minOrder}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="default" 
                    className="w-full" 
                    disabled={!restaurant.isOpen}
                  >
                    {restaurant.isOpen ? 'Order Now' : 'Currently Closed'}
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center p-12 border rounded-lg">
          <p className="text-xl font-medium mb-2">No restaurants found</p>
          <p className="text-muted-foreground">Try adjusting your filters or search term</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setSearchTerm('');
              setFilter({
                openOnly: false,
                maxDeliveryFee: 5,
                maxDistance: 5,
                cuisine: 'all'
              });
              setSortBy('recommended');
            }}
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default RestaurantsList;
