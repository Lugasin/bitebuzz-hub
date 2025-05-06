
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Clock, 
  Star, 
  Flame
} from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  rating: number;
  preparationTime: number;
  restaurantName?: string;
  restaurantRating?: number;
  dietaryInfo: {
    isVegetarian: boolean;
    isVegan: boolean;
    isGlutenFree: boolean;
    isSpicy: boolean;
  };
}

interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export const ZAMBIAN_CATEGORIES: Category[] = [
  {
    id: 'traditional',
    name: 'Traditional Zambian',
    description: 'Classic Zambian dishes',
    imageUrl: '/images/traditional.jpg'
  },
  {
    id: 'fusion',
    name: 'Fusion',
    description: 'Modern takes on classic dishes',
    imageUrl: '/images/fusion.jpg'
  },
  {
    id: 'street-food',
    name: 'Street Food',
    description: 'Popular street eats',
    imageUrl: '/images/street-food.jpg'
  },
  {
    id: 'vegetarian',
    name: 'Vegetarian',
    description: 'Plant-based Zambian cuisine',
    imageUrl: '/images/vegetarian.jpg'
  }
];

interface LandingPageProps {
  featuredItems: MenuItem[];
  topRestaurants: MenuItem[];
}

const LandingPage: React.FC<LandingPageProps> = ({ featuredItems, topRestaurants }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/menu?category=${categoryId}`);
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <div className="relative h-[600px] mb-12">
        <div className="carousel h-full">
          {featuredItems.map(item => (
            <div key={item.id} className="relative h-[600px]">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-black/80 to-transparent text-white">
                <h1 className="text-4xl font-bold">{item.name}</h1>
                <p className="text-lg my-4">{item.description}</p>
                <Button onClick={() => navigate(`/restaurant/${item.id}`)}>
                  Order Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-12 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold mb-6">Explore Zambian Cuisine</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {ZAMBIAN_CATEGORIES.map(category => (
            <Card 
              key={category.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{category.name}</h3>
                <p className="text-gray-500">{category.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Featured Items */}
      <div className="py-12 px-6">
        <h2 className="text-3xl font-bold mb-6">
          <Flame className="inline-block mr-2 h-6 w-6 text-orange-500" /> Popular Items
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredItems.map(item => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="ml-1">{item.rating}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                  <p className="font-bold mt-2">K{item.price.toFixed(2)}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.preparationTime} min
                    </Badge>
                    {item.dietaryInfo.isVegetarian && (
                      <Badge variant="success">Vegetarian</Badge>
                    )}
                    {item.dietaryInfo.isVegan && (
                      <Badge variant="success">Vegan</Badge>
                    )}
                    {item.dietaryInfo.isGlutenFree && (
                      <Badge variant="info">Gluten Free</Badge>
                    )}
                    {item.dietaryInfo.isSpicy && (
                      <Badge variant="warning">Spicy</Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Top Restaurants */}
      <div className="py-12 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold mb-6">
          <Star className="inline-block mr-2 h-6 w-6 text-yellow-500" /> Top Restaurants
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {topRestaurants.map(restaurant => (
            <Card key={restaurant.id} className="hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden">
                <img
                  src={restaurant.imageUrl}
                  alt={restaurant.restaurantName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div>
                  <h3 className="font-semibold">{restaurant.restaurantName}</h3>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="ml-1">{restaurant.restaurantRating}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 line-clamp-2">{restaurant.description}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Average delivery time: {restaurant.preparationTime} min
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-12 px-6 text-center">
        <Card className="max-w-2xl mx-auto p-12">
          <h2 className="text-3xl font-bold">Ready to Order?</h2>
          <p className="my-4">Discover the best of Zambian cuisine at your fingertips</p>
          <Button size="lg" onClick={() => navigate('/menu')}>
            Browse Menu
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default LandingPage;
