import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Pizza, 
  Utensils, 
  Coffee, 
  IceCream, 
  Sandwich, 
  Salad, 
  Soup, 
  Cake 
} from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Pizza",
    icon: Pizza,
    link: "/cuisine/pizza",
    color: "text-red-500"
  },
  {
    id: 2,
    name: "Burgers",
    icon: Sandwich,
    link: "/cuisine/burgers",
    color: "text-amber-500"
  },
  {
    id: 3,
    name: "Coffee",
    icon: Coffee,
    link: "/cuisine/coffee",
    color: "text-brown-500"
  },
  {
    id: 4,
    name: "Desserts",
    icon: IceCream,
    link: "/cuisine/desserts",
    color: "text-pink-500"
  },
  {
    id: 5,
    name: "Salads",
    icon: Salad,
    link: "/cuisine/salads",
    color: "text-green-500"
  },
  {
    id: 6,
    name: "Soups",
    icon: Soup,
    link: "/cuisine/soups",
    color: "text-orange-500"
  },
  {
    id: 7,
    name: "Cakes",
    icon: Cake,
    link: "/cuisine/cakes",
    color: "text-purple-500"
  },
  {
    id: 8,
    name: "More",
    icon: Utensils,
    link: "/cuisines",
    color: "text-blue-500"
  }
];

const CategorySlider = () => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Categories</h2>
          <Link to="/cuisines" className="text-primary text-sm font-medium hover:underline">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Link
                  to={category.link}
                  className="block p-4 text-center rounded-xl bg-card hover:bg-accent transition-colors"
                >
                  <div className={`w-12 h-12 mx-auto mb-2 ${category.color}`}>
                    <Icon className="w-full h-full" />
                  </div>
                  <span className="text-sm font-medium">{category.name}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySlider;
