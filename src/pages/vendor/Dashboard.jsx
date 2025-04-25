import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase'; // Make sure this is imported
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'; // Make sure these are imported
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'; // Make sure these are imported
import { Button } from '@/components/ui/button'; // Make sure this is imported
import { Link } from 'react-router-dom';
import { ChefHat, ShoppingBag, Clock, TrendingUp, DollarSign, Utensils } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import { formatCurrency } from '@/lib/utils';

const VendorDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({

    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    todayRevenue: 0,
    weeklyRevenue: 0,
    totalMenuItems: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser) return;
      
       let vendor;
      try {
        setIsLoading(true);
        
       // Get vendor info
         vendor = await Vendor.getVendorByFirebaseUid(currentUser.uid)
        // Get vendor info
        if(!vendor){
        }
        console.log("vendor: ", vendor)

        const vendorId = vendor.id;
        if (!vendorId) {
          throw new Error("Vendor ID is missing.");
        }
          console.log("vendorId: ", vendorId);



        // Fetch orders for this vendor
        const ordersQuery = query(
          collection(db, 'orders'),
          where('vendorId', '==', vendorId),
          orderBy('createdAt', 'desc')
        );
        
        const ordersSnapshot = await getDocs(ordersQuery);
        const orders = [];
        
        let pendingCount = 0;
        let completedCount = 0;
        let todayRevenue = 0;
        let weeklyRevenue = 0;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        oneWeekAgo.setHours(0, 0, 0, 0);
        
        ordersSnapshot.forEach(doc => {
          const order = { id: doc.id, ...doc.data() };
          
          // Add to orders array
          orders.push(order);
          
          // Calculate stats
          const orderDate = order.createdAt?.toDate() || new Date();
          
          if (['pending', 'preparing', 'ready'].includes(order.status)) {
            pendingCount++;
          }
          
          if (order.status === 'delivered') {
            completedCount++;
            
            // Today's revenue
            if (orderDate >= today) {
              todayRevenue += order.total;
            }
            
            // Weekly revenue
            if (orderDate >= oneWeekAgo) {
              weeklyRevenue += order.total;
            }
          }
        });
        
        // Fetch menu items count
        const menuQuery = query(
          collection(db, 'menuItems'),
          where('vendorId', '==', vendorId)
        );
        
        const menuSnapshot = await getDocs(menuQuery);
        
        setStats({
          totalOrders: orders.length,
          pendingOrders: pendingCount,
          completedOrders: completedCount,
          todayRevenue,
          weeklyRevenue,
          totalMenuItems: menuSnapshot.size
        });
        
        setRecentOrders(orders.slice(0, 5));
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [currentUser]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-10">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-10">
        <div className="flex flex-col space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
            <div className="space-x-2">
              <Button asChild>
                <Link to="/vendor/orders">View Orders</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/vendor/menu">Manage Menu</Link>
              </Button>
            </div>
          </div>
          
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-primary mr-2" />
                  <span className="text-3xl font-bold">{stats.pendingOrders}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Today's Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-primary mr-2" />
                  <span className="text-3xl font-bold">{formatCurrency(stats.todayRevenue)}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Menu Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Utensils className="h-5 w-5 text-primary mr-2" />
                  <span className="text-3xl font-bold">{stats.totalMenuItems}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Your latest orders and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map(order => {
                    const statusColors = {
                      'pending': 'bg-yellow-100 text-yellow-800',
                      'preparing': 'bg-blue-100 text-blue-800',
                      'ready': 'bg-green-100 text-green-800',
                      'delivered': 'bg-gray-100 text-gray-800',
                      'cancelled': 'bg-red-100 text-red-800'
                    };
                    
                    return (
                      <div key={order.id} className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center">
                          <ShoppingBag className="h-10 w-10 p-2 rounded-full bg-primary/10 text-primary mr-4" />
                          <div>
                            <h4 className="font-medium">Order #{order.id.slice(-6)}</h4>
                            <p className="text-sm text-muted-foreground">
                              {order.createdAt?.toDate().toLocaleString() || 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className={`px-3 py-1 rounded-full text-xs uppercase font-medium ${statusColors[order.status] || 'bg-gray-100'}`}>
                            {order.status}
                          </div>
                          <span className="font-medium">{formatCurrency(order.total)}</span>
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/vendor/orders/${order.id}`}>View</Link>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10">
                  <ChefHat className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No orders yet</h3>
                  <p className="text-muted-foreground">
                    Your recent orders will appear here
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/vendor/orders">View All Orders</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default VendorDashboard;