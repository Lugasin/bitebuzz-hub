
import React from "react";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck, Users, Globe, Heart, Building, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const jobOpenings = [
  {
    id: 1,
    title: "Senior Software Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time"
  },
  {
    id: 2,
    title: "UX/UI Designer",
    department: "Design",
    location: "New York, NY",
    type: "Full-time"
  },
  {
    id: 3,
    title: "Product Manager",
    department: "Product",
    location: "San Francisco, CA",
    type: "Full-time"
  },
  {
    id: 4,
    title: "Customer Support Specialist",
    department: "Customer Success",
    location: "Remote",
    type: "Full-time"
  },
  {
    id: 5,
    title: "Marketing Coordinator",
    department: "Marketing",
    location: "Chicago, IL",
    type: "Full-time"
  },
  {
    id: 6,
    title: "Data Analyst",
    department: "Analytics",
    location: "Remote",
    type: "Full-time"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const Careers = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Join Our Team</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're on a mission to transform the food delivery experience. Join us and help bring delicious meals to people's doorsteps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <motion.div 
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Collaborative Culture</h3>
              <p className="text-muted-foreground">
                Work with talented individuals in a supportive and inclusive environment.
              </p>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Make an Impact</h3>
              <p className="text-muted-foreground">
                Help shape the future of food delivery and improve people's daily lives.
              </p>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Great Benefits</h3>
              <p className="text-muted-foreground">
                Enjoy competitive pay, health benefits, flexible work, and free food deliveries.
              </p>
            </motion.div>
          </div>
          
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <BadgeCheck className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Customer Obsession</h3>
                  <p className="text-muted-foreground">
                    We start with the customer and work backwards. We work vigorously to earn and keep customer trust.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <BadgeCheck className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Innovation</h3>
                  <p className="text-muted-foreground">
                    We constantly push boundaries and find new ways to solve problems and improve our services.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <BadgeCheck className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Diversity & Inclusion</h3>
                  <p className="text-muted-foreground">
                    We embrace diverse perspectives and create an inclusive environment where everyone can thrive.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <BadgeCheck className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Ownership</h3>
                  <p className="text-muted-foreground">
                    We take responsibility for our actions and outcomes, and we think long-term, not just about immediate results.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Open Positions</h2>
              <Button variant="outline">All Departments</Button>
            </div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {jobOpenings.map((job) => (
                <motion.div key={job.id} variants={itemVariants}>
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>{job.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        {job.department}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-secondary">
                        {job.type}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">View & Apply</Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
            
            <div className="text-center mt-10">
              <p className="text-muted-foreground mb-6">
                Don't see a position that matches your skills?
              </p>
              <Button asChild>
                <a href="mailto:careers@bitebuzz.com">Send Your Resume</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Careers;
