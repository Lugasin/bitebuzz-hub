
// Zambian cuisine data to localize the app content

export const zambianCuisineCategories = [
  { id: "1", name: "Nshima", description: "Traditional Zambian staple made from maize meal" },
  { id: "2", name: "Ifisashi", description: "Vegetables cooked in peanut sauce" },
  { id: "3", name: "Kapenta", description: "Small dried fish, often served with nshima" },
  { id: "4", name: "Chikanda", description: "Vegetarian dish made from orchid tubers, peanuts and baking soda" },
  { id: "5", name: "Village Chicken", description: "Free-range chicken prepared in traditional style" },
  { id: "6", name: "Mundkoyo", description: "Fermented maize drink" },
  { id: "7", name: "Local Beverages", description: "Traditional and modern Zambian drinks" }
];

export const popularZambianDishes = [
  {
    id: "zm1",
    name: "Nshima with Chicken Stew",
    image: "https://images.unsplash.com/photo-1574484284002-952d92456975?ixlib=rb-4.0.3&auto=format&fit=crop&q=80",
    description: "Traditional nshima served with slow-cooked chicken stew",
    price: 75.00,
    restaurant: "Zambian Flavors",
    restaurantId: "zm-rest-1",
    category: "Main Dish"
  },
  {
    id: "zm2",
    name: "Ifisashi with Rice",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&q=80",
    description: "Vegetables in peanut sauce served with rice",
    price: 55.00,
    restaurant: "Lusaka Eats",
    restaurantId: "zm-rest-2",
    category: "Vegetarian"
  },
  {
    id: "zm3",
    name: "Kapenta with Nshima",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&auto=format&fit=crop&q=80",
    description: "Dried fish served with nshima and vegetables",
    price: 60.00,
    restaurant: "Zambezi Kitchen",
    restaurantId: "zm-rest-3",
    category: "Seafood"
  },
  {
    id: "zm4",
    name: "Chikanda (African Polony)",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&q=80",
    description: "Traditional vegetarian dish made from orchid tubers",
    price: 45.00,
    restaurant: "Traditional Tastes",
    restaurantId: "zm-rest-4",
    category: "Appetizer"
  },
  {
    id: "zm5",
    name: "Village Chicken with Nshima",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-4.0.3&auto=format&fit=crop&q=80",
    description: "Free-range chicken cooked in traditional style with nshima",
    price: 85.00,
    restaurant: "Zambian Flavors",
    restaurantId: "zm-rest-1",
    category: "Main Dish"
  },
  {
    id: "zm6",
    name: "Mundkoyo",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-4.0.3&auto=format&fit=crop&q=80",
    description: "Traditional fermented maize drink",
    price: 25.00,
    restaurant: "Lusaka Eats",
    restaurantId: "zm-rest-2",
    category: "Beverage"
  }
];

// Add Zambian beverages and alcoholic drinks
export const zambianBeverages = [
  {
    id: "bev1",
    name: "Mosi Lager",
    image: "https://images.unsplash.com/photo-1566633806327-68e152aaf26d?ixlib=rb-4.0.3&auto=format&fit=crop&q=80",
    description: "Zambia's most popular local beer",
    price: 20.00,
    category: "Alcohol",
    alcoholContent: "4.8%"
  },
  {
    id: "bev2",
    name: "Rhino Lager",
    image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?ixlib=rb-4.0.3&auto=format&fit=crop&q=80", 
    description: "Strong local beer with distinctive taste",
    price: 22.00,
    category: "Alcohol",
    alcoholContent: "5.5%"
  },
  {
    id: "bev3",
    name: "Castle Lager",
    image: "https://images.unsplash.com/photo-1618885472179-5e474019f2a9?ixlib=rb-4.0.3&auto=format&fit=crop&q=80",
    description: "Popular South African beer widely available in Zambia",
    price: 18.00,
    category: "Alcohol",
    alcoholContent: "4.5%"
  },
  {
    id: "bev4",
    name: "Jameson Irish Whiskey",
    image: "https://images.unsplash.com/photo-1514218953589-2d7d87cf337e?ixlib=rb-4.0.3&auto=format&fit=crop&q=80",
    description: "Smooth triple-distilled Irish whiskey popular in Zambian bars",
    price: 35.00,
    category: "Alcohol",
    alcoholContent: "40%",
    servingSize: "25ml"
  },
  {
    id: "bev5",
    name: "Amarula Cream Liqueur",
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-4.0.3&auto=format&fit=crop&q=80",
    description: "African cream liqueur made from the fruit of the marula tree",
    price: 30.00,
    category: "Alcohol",
    alcoholContent: "17%",
    servingSize: "50ml"
  },
  {
    id: "bev6",
    name: "Chibuku Shake-Shake",
    image: "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?ixlib=rb-4.0.3&auto=format&fit=crop&q=80",
    description: "Traditional sorghum beer in a carton, popular across Zambia",
    price: 12.00,
    category: "Alcohol",
    alcoholContent: "3.5%"
  },
  {
    id: "bev7",
    name: "Mazoe Orange Crush",
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?ixlib=rb-4.0.3&auto=format&fit=crop&q=80",
    description: "Popular orange concentrate diluted with water",
    price: 15.00,
    category: "Non-Alcoholic",
    servingStyle: "With ice"
  },
  {
    id: "bev8",
    name: "Maheu",
    image: "https://images.unsplash.com/photo-1629203432180-71e9b18d855c?ixlib=rb-4.0.3&auto=format&fit=crop&q=80",
    description: "Traditional non-alcoholic millet or maize-based drink",
    price: 10.00,
    category: "Non-Alcoholic"
  }
];

export const zambianRestaurants = [
  {
    id: "zm-rest-1",
    name: "Zambian Flavors",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&q=80",
    rating: 4.8,
    cuisineType: "Traditional Zambian",
    priceRange: "K50-K150",
    deliveryTime: "30-45 min",
    deliveryFee: 15,
    address: "Cairo Road, Lusaka",
    distance: "2.5 km"
  },
  {
    id: "zm-rest-2",
    name: "Lusaka Eats",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&q=80",
    rating: 4.6,
    cuisineType: "Zambian Fusion",
    priceRange: "K45-K130",
    deliveryTime: "25-40 min",
    deliveryFee: 20,
    address: "Manda Hill Mall, Lusaka",
    distance: "3.8 km"
  },
  {
    id: "zm-rest-3",
    name: "Zambezi Kitchen",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&q=80",
    rating: 4.7,
    cuisineType: "Riverside Cuisine",
    priceRange: "K60-K180",
    deliveryTime: "35-50 min",
    deliveryFee: 25,
    address: "Leopards Hill Road, Lusaka",
    distance: "5.2 km"
  },
  {
    id: "zm-rest-4",
    name: "Traditional Tastes",
    image: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?ixlib=rb-4.0.3&auto=format&fit=crop&q=80",
    rating: 4.5,
    cuisineType: "Authentic Zambian",
    priceRange: "K40-K120",
    deliveryTime: "30-45 min",
    deliveryFee: 15,
    address: "Northmead, Lusaka",
    distance: "4.1 km"
  }
];

// Currency formatting for Zambian Kwacha
export const formatZambianCurrency = (amount) => {
  return `K${amount.toFixed(2)}`;
};

// Convert distance to kilometers
export const formatDistance = (distance) => {
  if (typeof distance === 'string' && distance.includes('miles')) {
    // Convert miles to kilometers (1 mile = 1.60934 km)
    const miles = parseFloat(distance);
    const kilometers = miles * 1.60934;
    return `${kilometers.toFixed(1)} km`;
  }
  return distance;
};
