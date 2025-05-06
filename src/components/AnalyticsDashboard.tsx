
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '../services/api';

// Simplified version without recharts dependencies
const AnalyticsDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<[string, string]>(['', '']);
  const [restaurantId, setRestaurantId] = useState<string>('');
  const [activeTab, setActiveTab] = useState('overview');
  const { user, userRole } = useAuth();
  const { toast } = useToast();

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [startDate, endDate] = timeRange;
      
      // Use apiService instead of direct api.get
      const response = await apiService.get('/analytics', {
        params: {
          startDate,
          endDate,
          restaurantId: userRole === 'vendor' ? user?.id : restaurantId
        }
      });
      
      setData(response.data);
      toast({
        title: "Analytics loaded",
        description: "Dashboard data updated successfully"
      });
    } catch (error) {
      console.error('Failed to fetch analytics data', error);
      toast({
        title: "Error",
        description: "Failed to fetch analytics data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timeRange[0] && timeRange[1]) {
      fetchAnalytics();
    }
  }, [timeRange, restaurantId]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <Button
          onClick={fetchAnalytics}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh Data"}
        </Button>
      </div>

      {/* Date range selector would go here */}
      <div className="mb-6">
        <p>Please select a date range to view analytics</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : data ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-2">Total Orders</h3>
            <p className="text-2xl font-bold">{data.summary?.totalOrders || 0}</p>
          </Card>
          
          <Card className="p-4">
            <h3 className="font-semibold mb-2">Total Revenue</h3>
            <p className="text-2xl font-bold">
              ${data.summary?.totalRevenue?.toFixed(2) || "0.00"}
            </p>
          </Card>
          
          <Card className="p-4">
            <h3 className="font-semibold mb-2">Avg. Order Value</h3>
            <p className="text-2xl font-bold">
              ${data.summary?.averageOrderValue?.toFixed(2) || "0.00"}
            </p>
          </Card>
        </div>
      ) : (
        <Card className="p-6 text-center">
          <p>Select a date range to view analytics</p>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
