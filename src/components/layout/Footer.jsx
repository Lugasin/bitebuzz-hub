import React from 'react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-12">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <div className="mb-6">
          <Button>Subscribe to Newsletter</Button>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Eeats. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;