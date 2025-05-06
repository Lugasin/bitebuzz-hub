
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldX, ArrowLeft, Home } from 'lucide-react';

const NotAuthorized = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-4">
      <div className="flex flex-col items-center max-w-md mx-auto text-center">
        <div className="rounded-full bg-red-100 p-6 mb-6">
          <ShieldX className="h-16 w-16 text-red-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
        
        <p className="text-gray-700 mb-6">
          You do not have permission to access this page. If you believe this is a mistake,
          please contact support or try logging in with a different account.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Button 
            variant="outline" 
            className="flex-1 gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          
          <Button 
            variant="default" 
            className="flex-1 gap-2"
            onClick={() => navigate('/')}
          >
            <Home className="h-4 w-4" />
            Home Page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotAuthorized;
