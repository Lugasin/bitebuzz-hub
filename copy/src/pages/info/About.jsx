
import React from "react";
import MainLayout from "@/layouts/MainLayout";
import { motion } from "framer-motion";

const About = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-6">About BiteBuzz</h1>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="lead">
              BiteBuzz is a food delivery platform that connects hungry customers with their favorite local restaurants. Our mission is to make food delivery fast, reliable, and enjoyable for everyone.
            </p>
            
            <h2>Our Story</h2>
            <p>
              Founded in 2020, BiteBuzz started as a small operation serving just a few neighborhoods. Today, we've grown to serve multiple cities across the country, partnering with thousands of restaurants to deliver delicious meals to our customers.
            </p>
            
            <h2>Our Mission</h2>
            <p>
              We're on a mission to transform the way people experience food delivery. We believe that good food should be accessible to everyone, and we're committed to creating a platform that makes ordering food as enjoyable as eating it.
            </p>
            
            <h2>Our Values</h2>
            <ul>
              <li><strong>Quality:</strong> We partner only with restaurants that meet our high standards for food quality and safety.</li>
              <li><strong>Reliability:</strong> We're committed to delivering your food on time, every time.</li>
              <li><strong>Transparency:</strong> We believe in honest pricing with no hidden fees.</li>
              <li><strong>Community:</strong> We support local restaurants and create opportunities for delivery partners in the communities we serve.</li>
            </ul>
            
            <h2>Join Our Team</h2>
            <p>
              We're always looking for talented people to join our team. Whether you're interested in becoming a delivery partner or working in our corporate office, we'd love to hear from you.
            </p>
            <p>
              <a href="/careers" className="text-primary hover:underline">View open positions</a> or <a href="/delivery/signup" className="text-primary hover:underline">become a delivery partner</a>.
            </p>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default About;
