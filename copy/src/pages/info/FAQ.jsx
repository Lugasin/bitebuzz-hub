
import React from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const FAQPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-center">Frequently Asked Questions</h1>
          <p className="text-muted-foreground text-center mb-10">
            Find answers to the most common questions about BiteBuzz
          </p>

          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold mb-4">Ordering</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="order-1">
                  <AccordionTrigger>How do I place an order?</AccordionTrigger>
                  <AccordionContent>
                    To place an order, browse restaurants in your area, select the items you want, customize them if needed, add them to your cart, and proceed to checkout. You can pay online or choose cash on delivery for your order.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="order-2">
                  <AccordionTrigger>Can I schedule an order for later?</AccordionTrigger>
                  <AccordionContent>
                    Yes, you can schedule your order for a later time. During checkout, you'll have the option to select "Schedule for Later" and choose your preferred delivery time.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="order-3">
                  <AccordionTrigger>How do I modify or cancel my order?</AccordionTrigger>
                  <AccordionContent>
                    You can modify or cancel your order within 5 minutes of placing it. Go to your order details and select "Modify Order" or "Cancel Order." After this window, please contact customer support for assistance.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="order-4">
                  <AccordionTrigger>Is there a minimum order amount?</AccordionTrigger>
                  <AccordionContent>
                    Minimum order amounts vary by restaurant. You can see the minimum order amount on each restaurant's page before you start adding items to your cart.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Delivery</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="delivery-1">
                  <AccordionTrigger>How long will my delivery take?</AccordionTrigger>
                  <AccordionContent>
                    Delivery times vary depending on your distance from the restaurant, current order volume, and weather conditions. The estimated delivery time will be shown before you place your order and you can track your delivery in real-time after ordering.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="delivery-2">
                  <AccordionTrigger>How is the delivery fee calculated?</AccordionTrigger>
                  <AccordionContent>
                    The delivery fee is calculated based on your distance from the restaurant, current demand, and other factors. The exact fee will be displayed during checkout before you place your order.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="delivery-3">
                  <AccordionTrigger>Can I get free delivery?</AccordionTrigger>
                  <AccordionContent>
                    We offer free delivery on your first order when you sign up. Additionally, some restaurants offer free delivery on orders over a certain amount, and we regularly run promotions with reduced or free delivery fees.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="delivery-4">
                  <AccordionTrigger>What if my order is late or missing items?</AccordionTrigger>
                  <AccordionContent>
                    If your order is significantly delayed or missing items, please contact our customer support team. We'll work with you to resolve the issue, which may include providing a refund or credits for future orders.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Payment</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="payment-1">
                  <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                  <AccordionContent>
                    We accept credit/debit cards, digital wallets, and cash on delivery. Payment options may vary by location and restaurant.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="payment-2">
                  <AccordionTrigger>Is it safe to save my payment information?</AccordionTrigger>
                  <AccordionContent>
                    Yes, we use industry-standard encryption and security protocols to protect your payment information. We never store your complete card details on our servers.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="payment-3">
                  <AccordionTrigger>How do refunds work?</AccordionTrigger>
                  <AccordionContent>
                    Refunds are processed to your original payment method in 3-5 business days. For cash on delivery orders, refunds will be issued as credit to your BiteBuzz account.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Account</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="account-1">
                  <AccordionTrigger>How do I create an account?</AccordionTrigger>
                  <AccordionContent>
                    You can create an account by clicking "Sign Up" on our website or app. You'll need to provide your name, email, and a password. You can also sign up using your Google or Facebook account.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="account-2">
                  <AccordionTrigger>Can I order without creating an account?</AccordionTrigger>
                  <AccordionContent>
                    Yes, you can place orders as a guest without creating an account. However, creating an account allows you to save your delivery addresses, track your order history, and earn rewards.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="account-3">
                  <AccordionTrigger>How do I reset my password?</AccordionTrigger>
                  <AccordionContent>
                    You can reset your password by clicking "Forgot Password" on the login page. We'll send a password reset link to your registered email address.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="text-center mt-10">
              <p className="mb-6">Still have questions? We're here to help!</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild>
                  <Link to="/contact">Contact Support</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/help">Help Center</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FAQPage;
