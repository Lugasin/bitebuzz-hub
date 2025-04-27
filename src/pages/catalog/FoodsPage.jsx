import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const categories = [
  "All",
  "Traditional",
  "Fast Food",
  "Vegetarian",
  "Seafood",
  "Desserts",
  "Zambian Products"
];

const FoodsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const itemsRef = collection(db, "menuItems");
        const q = query(itemsRef, where("category", "in", ["Traditional", "Fast Food", "Vegetarian", "Seafood", "Desserts"]));
        const querySnapshot = await getDocs(q);
        
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        
        setFoods(items);
      } catch (error) {
        console.error("Error fetching foods:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         food.restaurantName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || 
                          (selectedCategory === "Zambian Products" ? food.isZambian : food.category === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (food) => {
    addItem({
      id: food.id,
      name: food.name,
      price: food.price,
      quantity: 1,
      image: food.image,
      restaurantId: food.restaurantId,
      restaurantName: food.restaurantName
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Foods Catalog</h1>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search foods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full md:w-64"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="mb-8 p-4 bg-card rounded-lg shadow-sm">
          <h3 className="font-medium mb-4">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredFoods.map((food, index) => (
          <motion.div
            key={food.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Card className="overflow-hidden border-none shadow-md dark:bg-card">
              <div className="relative h-48">
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-full h-full object-cover"
                />
                {food.isZambian && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold py-1 px-2 rounded">
                    Zambian
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium mb-1">{food.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {food.restaurantName}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {food.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-bold">{formatCurrency(food.price)}</span>
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(food)}
                  >
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FoodsPage; 