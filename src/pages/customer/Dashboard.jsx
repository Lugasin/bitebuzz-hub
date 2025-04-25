import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ShoppingBag, Clock, MapPin, Heart, CreditCard } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import { formatCurrency } from '@/lib/utils';

const CustomerDashboard = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!currentUser) return;
      
      try {
        setIsLoading(true);
        
        // Fetch recent orders
        const ordersQuery = query(
          collection(db, 'orders'),
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );
        
        const ordersSnapshot = await getDocs(ordersQuery);
        const recentOrders = [];
        
        ordersSnapshot.forEach(doc => {
          recentOrders.push({ id: doc.id, ...doc.data() });
        });
        
        // Fetch favorites
        const favoritesQuery = query(
          collection(db, 'favorites'),
          where('userId', '==', currentUser.uid)
        );
        
        const favoritesSnapshot = await getDocs(favoritesQuery);
        const userFavorites = [];
        
        favoritesSnapshot.forEach(doc => {
          userFavorites.push({ id: doc.id, ...doc.data() });
        });
        
        setOrders(recentOrders);
        setFavorites(userFavorites);
        
      } catch (error) {
        console.error("Error fetching customer data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCustomerData();
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
            <h1 className="text-3xl font-bold">My Dashboard</h1>
            <div className="space-x-2">
              <Button asChild>
                <Link to="/restaurants">Order Food</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/profile">My Profile</Link>
              </Button>
            </div>
          </div>
          
          {/* Action cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  My Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  View your order history and track current orders
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link to="/orders">View Orders</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Favorites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Your favorite restaurants and dishes
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link to="/favorites">View Favorites</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Manage your saved payment methods
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link to="/payment-methods">Manage Payments</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Recent orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Your most recent food orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.slice(0, 3).map(order => {
                    const statusColors = {
                      'pending': 'bg-yellow-100 text-yellow-800',
                      'preparing': 'bg-blue-100 text-blue-800',
                      'ready': 'bg-green-100 text-green-800',
                      'delivered': 'bg-gray-100 text-gray-800',
                      'cancelled': 'bg-red-100 text-red-800'
                    };
                    
                    return (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{order.restaurantName || 'Restaurant'}</h3>
                            <p className="text-sm text-muted-foreground">
                              Order #{order.id.slice(-6)} • {order.createdAt?.toDate().toLocaleString() || 'N/A'}
                            </p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs uppercase font-medium ${statusColors[order.status] || 'bg-gray-100'}`}>
                            {order.status}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 my-2">
                          {order.items?.map((item, index) => (
                            <span key={index} className="text-sm">
                              {item.quantity}× {item.name}{index < order.items.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex justify-between items-center mt-4 pt-2 border-t">
                          <span className="font-medium">{formatCurrency(order.total || 0)}</span>
                          <Button size="sm" asChild>
                            <Link to={`/order/${order.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10">
                  <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No orders yet</h3>
                  <p className="text-muted-foreground">
                    Your recent orders will appear here
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/orders">View All Orders</Link>
              </Button>
            </CardFooter>
          </Card>
          
        </div>
      </div>
    </MainLayout>
  );
};

export default CustomerDashboard;