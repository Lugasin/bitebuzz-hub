
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '../services/api';

interface OrderLocation {
  latitude: number;
  longitude: number;
  timestamp: string;
}

interface OrderStatus {
  status: string;
  updatedAt: string;
  location?: OrderLocation;
}

interface Order {
  id: string;
  status: string;
  estimatedDeliveryTime: string;
  currentLocation?: OrderLocation;
  statusHistory: OrderStatus[];
}

const OrderTracking: React.FC<{ orderId: string }> = ({ orderId }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Simulate WebSocket connection for real-time updates
    const intervalId = setInterval(() => {
      fetchOrder();
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [orderId]);

  // Fetch initial order data
  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await apiService.get(`/orders/${orderId}/track`);
      setOrder(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching order:', error);
      setError('Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return "default";
      case 'confirmed': return "default";
      case 'preparing': return "default";
      case 'ready': return "default";
      case 'picked_up': return "default";
      case 'on_the_way': return "default";
      case 'delivered': return "default";
      case 'cancelled': return "default";
      default: return "default";
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Card>
    );
  }

  if (error || !order) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p className="text-red-500">{error || 'Order not found'}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Order #{orderId}</h2>
          <Badge>
            {order.status}
          </Badge>
        </div>
        
        <div className="border-t pt-4">
          <p className="text-gray-500">
            Estimated delivery time: {formatDate(order.estimatedDeliveryTime)}
          </p>
        </div>
        
        <div className="border rounded-md p-4">
          <h3 className="font-semibold mb-4">Order Status History</h3>
          <div className="space-y-4">
            {order.statusHistory.map((status, index) => (
              <div key={index} className="flex items-start">
                <div className="mr-4 mt-0.5">
                  <div className="h-4 w-4 rounded-full bg-primary"></div>
                  {index < order.statusHistory.length - 1 && (
                    <div className="h-14 w-0.5 bg-gray-200 mx-auto my-1"></div>
                  )}
                </div>
                <div>
                  <div className="flex items-center">
                    <Badge>
                      {status.status}
                    </Badge>
                    <span className="ml-2 text-sm text-gray-500">
                      {formatDate(status.updatedAt)}
                    </span>
                  </div>
                  {status.location && (
                    <p className="text-sm mt-1">
                      Location: {status.location.latitude.toFixed(6)}, {status.location.longitude.toFixed(6)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Map would be integrated here in a real implementation */}
        <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
          <p className="text-gray-500">Map view would be displayed here</p>
        </div>
      </div>
    </Card>
  );
};

export default OrderTracking;
