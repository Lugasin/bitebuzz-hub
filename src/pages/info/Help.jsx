
import React from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingBag, Clock, CreditCard, User, HelpCircle, Map, AlertCircle } from "lucide-react";

const Help = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Help & Support</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Find answers to your questions and get support when you need it.
            </p>
            
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search for help with..." 
                className="pl-10 h-12"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="min-h-20">
                  Get help with tracking, modifying, or canceling your orders.
                </CardDescription>
                <Button asChild className="w-full mt-4" variant="outline">
                  <Link to="/faq#orders">View Help</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Delivery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="min-h-20">
                  Learn about delivery times, fees, and what to do if there's an issue with your delivery.
                </CardDescription>
                <Button asChild className="w-full mt-4" variant="outline">
                  <Link to="/faq#delivery">View Help</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="min-h-20">
                  Find information about payment methods, refunds, and billing issues.
                </CardDescription>
                <Button asChild className="w-full mt-4" variant="outline">
                  <Link to="/faq#payment">View Help</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Account
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="min-h-20">
                  Get help with creating, managing, or recovering your account.
                </CardDescription>
                <Button asChild className="w-full mt-4" variant="outline">
                  <Link to="/faq#account">View Help</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5 text-primary" />
                  Address & Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="min-h-20">
                  Learn how to update your address or troubleshoot location issues.
                </CardDescription>
                <Button asChild className="w-full mt-4" variant="outline">
                  <Link to="/faq#location">View Help</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Report an Issue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="min-h-20">
                  Let us know if you've experienced a problem with your order or our service.
                </CardDescription>
                <Button asChild className="w-full mt-4" variant="outline">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-secondary/40 p-6 rounded-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <HelpCircle className="h-12 w-12 text-primary" />
                <div>
                  <h3 className="text-xl font-bold">Need more help?</h3>
                  <p className="text-muted-foreground">Our support team is here for you.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Button asChild>
                  <Link to="/contact">Contact Support</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/faq">View FAQ</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Help;
