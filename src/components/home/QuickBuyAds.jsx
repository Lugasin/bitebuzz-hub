import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ads = [
  {
    id: 1,
    title: "50% OFF All Chicken Meals",
    description: "Use code CHICKEN50 at checkout",
    image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    link: "/cuisine/chicken",
    color: "from-orange-500 to-red-500"
  },
  {
    id: 2,
    title: "Buy 1 Get 1 Free on Pizza",
    description: "Every Tuesday and Wednesday",
    image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    link: "/cuisine/pizza",
    color: "from-red-500 to-yellow-500"
  },
  {
    id: 3,
    title: "Free Delivery on Orders Over K100",
    description: "Limited time offer",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
    link: "/restaurants",
    color: "from-blue-500 to-purple-500"
  }
];

const QuickBuyAds = () => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ads.map((ad, index) => (
            <motion.div
              key={ad.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={ad.link}
                className={`block relative h-48 rounded-xl overflow-hidden group bg-gradient-to-r ${ad.color}`}
              >
                <img
                  src={ad.image}
                  alt={ad.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity"
                />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {ad.title}
                  </h3>
                  <p className="text-white/80">{ad.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickBuyAds;
