
import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary mt-16">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <img src="/favicon.svg" alt="Logo" className="w-8 h-8" />
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Eeats
              </h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Order your favorite meals from the best restaurants in town with quick and reliable delivery.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/restaurants" className="text-muted-foreground hover:text-primary transition-colors">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link to="/trending" className="text-muted-foreground hover:text-primary transition-colors">
                  Trending Foods
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-6">Information</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/help" className="text-muted-foreground hover:text-primary transition-colors">
                  Help & Support
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-muted-foreground hover:text-primary transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-6">Contact Us</h3>
            <address className="not-italic text-muted-foreground space-y-3">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                123 Food Street, Lusaka, Zambia
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <a href="tel:+260211123456" className="hover:text-primary transition-colors">
                  +260 211 123 456
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <a href="mailto:info@eeats.co.zm" className="hover:text-primary transition-colors">
                  info@eeats.co.zm
                </a>
              </p>
            </address>
            <div className="mt-6">
              <h4 className="font-medium mb-2">Join Our Team</h4>
              <Link to="/delivery/signup" className="text-primary hover:underline">
                Become a Delivery Partner
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} Eeats. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary">
              Terms
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">
              Privacy
            </Link>
            <Link to="/cookies" className="text-sm text-muted-foreground hover:text-primary">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
