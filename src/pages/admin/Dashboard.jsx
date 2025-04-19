
import React from "react";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingBag,
  DollarSign,
  Store,
  Truck,
  ChevronRight,
  Clock,
  AlertCircle,
  BarChart4,
  PieChart,
  LineChart,
  Filter,
  Flag,
  Download,
  Calendar,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart as RechartLineChart, Line, PieChart as RechartPieChart, Pie, Cell, Legend } from "recharts";
import { formatCurrency } from "@/lib/utils";
import { formatDistance } from "date-fns";

// Mock dashboard data
const dashboardData = {
  revenue: {
    total: 125500,
    previous: 98700,
    growth: 27.15,
    breakdown: {
      orderCommission: 98500,
      deliveryFees: 15000,
      subscriptionFees: 12000
    }
  },
  orders: {
    total: 2345,
    previous: 2100,
    growth: 11.67,
    breakdown: {
      completed: 2085,
      cancelled: 145,
      processing: 115
    }
  },
  users: {
    total: 4578,
    previous: 4120,
    growth: 11.12,
    breakdown: {
      customers: 4200,
      restaurants: 278,
      drivers: 100
    },
    newToday: 37
  },
  restaurants: {
    total: 278,
    previous: 253,
    growth: 9.88,
    pending: 12,
    breakdown: {
      active: 253,
      suspended: 13,
      pending: 12
    }
  },
  recentOrders: [
    {
      id: "ORD12345",
      date: new Date(Date.now() - 25 * 60000),
      customer: {
        name: "Jane Cooper",
        avatar: "https://randomuser.me/api/portraits/women/12.jpg"
      },
      restaurant: {
        name: "Chicken King",
        image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
      },
      amount: 210,
      status: "completed"
    },
    {
      id: "ORD12346",
      date: new Date(Date.now() - 45 * 60000),
      customer: {
        name: "Robert Johnson",
        avatar: "https://randomuser.me/api/portraits/men/42.jpg"
      },
      restaurant: {
        name: "Pizza Palace",
        image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
      },
      amount: 165,
      status: "cancelled"
    },
    {
      id: "ORD12347",
      date: new Date(Date.now() - 60 * 60000),
      customer: {
        name: "Sarah Wilson",
        avatar: "https://randomuser.me/api/portraits/women/32.jpg"
      },
      restaurant: {
        name: "Fresh Fries",
        image: "https://images.unsplash.com/photo-1685109649408-c5c56ae4428d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
      },
      amount: 115,
      status: "processing"
    },
    {
      id: "ORD12348",
      date: new Date(Date.now() - 120 * 60000),
      customer: {
        name: "Michael Brown",
        avatar: "https://randomuser.me/api/portraits/men/62.jpg"
      },
      restaurant: {
        name: "Chicken King",
        image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
      },
      amount: 260,
      status: "completed"
    },
    {
      id: "ORD12349",
      date: new Date(Date.now() - 180 * 60000),
      customer: {
        name: "Emma Davis",
        avatar: "https://randomuser.me/api/portraits/women/52.jpg"
      },
      restaurant: {
        name: "Pizza Palace",
        image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80",
      },
      amount: 150,
      status: "completed"
    }
  ],
  alerts: [
    {
      id: "a1",
      title: "New restaurant approval required",
      description: "12 restaurants are waiting for approval",
      timestamp: new Date(Date.now() - 30 * 60000),
      type: "approval",
      link: "/admin/vendors"
    },
    {
      id: "a2",
      title: "Payment system maintenance",
      description: "Scheduled maintenance on July 25, 2023, from 2:00 AM to 4:00 AM UTC",
      timestamp: new Date(Date.now() - 3 * 3600000),
      type: "system",
      link: "/admin/settings"
    },
    {
      id: "a3",
      title: "High order cancellation rate",
      description: "Cancellation rate increased by 5% in the last 24 hours",
      timestamp: new Date(Date.now() - 5 * 3600000),
      type: "warning",
      link: "/admin/orders"
    }
  ],
  revenueChart: [
    { name: "Jan", value: 65000 },
    { name: "Feb", value: 59000 },
    { name: "Mar", value: 80000 },
    { name: "Apr", value: 81000 },
    { name: "May", value: 95000 },
    { name: "Jun", value: 110000 },
    { name: "Jul", value: 125500 }
  ],
  ordersByCategory: [
    { name: "Fast Food", value: 45 },
    { name: "Pizza", value: 20 },
    { name: "Chicken", value: 15 },
    { name: "Beverages", value: 10 },
    { name: "Vegetarian", value: 10 }
  ],
  ordersTimeline: [
    { time: "00:00", orders: 15 },
    { time: "03:00", orders: 5 },
    { time: "06:00", orders: 10 },
    { time: "09:00", orders: 45 },
    { time: "12:00", orders: 95 },
    { time: "15:00", orders: 85 },
    { time: "18:00", orders: 110 },
    { time: "21:00", orders: 65 }
  ]
};

// Colors for pie chart
const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

const AdminDashboard = () => {
  const getStatusBadge = (status) => {
    switch (status) {
      case "processing":
        return <Badge variant="secondary">Processing</Badge>;
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getAlertIcon = (type) => {
    switch (type) {
      case "approval":
        return <Store className="h-5 w-5 text-blue-500" />;
      case "system":
        return <Settings className="h-5 w-5 text-purple-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Flag className="h-5 w-5" />;
    }
  };
  
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Last 30 Days</span>
            </Button>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              <span>Filter</span>
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              <span>Export</span>
            </Button>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <SummaryCard 
            title="Total Revenue" 
            value={formatCurrency(dashboardData.revenue.total)} 
            icon={<DollarSign className="h-5 w-5 text-white" />}
            change={dashboardData.revenue.growth}
            iconColor="bg-green-500"
          />
          
          <SummaryCard 
            title="Total Orders" 
            value={dashboardData.orders.total.toLocaleString()} 
            icon={<ShoppingBag className="h-5 w-5 text-white" />}
            change={dashboardData.orders.growth}
            iconColor="bg-blue-500"
          />
          
          <SummaryCard 
            title="Total Users" 
            value={dashboardData.users.total.toLocaleString()} 
            icon={<Users className="h-5 w-5 text-white" />}
            change={dashboardData.users.growth}
            iconColor="bg-purple-500"
            subtext={`${dashboardData.users.newToday} new today`}
          />
          
          <SummaryCard 
            title="Restaurants" 
            value={dashboardData.restaurants.total.toLocaleString()} 
            icon={<Store className="h-5 w-5 text-white" />}
            change={dashboardData.restaurants.growth}
            iconColor="bg-orange-500"
            subtext={`${dashboardData.restaurants.pending} pending approval`}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Charts */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="revenue">
                <div className="flex justify-between items-center mb-4">
                  <TabsList>
                    <TabsTrigger value="revenue">Revenue</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                  </TabsList>
                  
                  <div className="text-sm text-muted-foreground">
                    Total Revenue: {formatCurrency(dashboardData.revenue.total)}
                  </div>
                </div>
                
                <TabsContent value="revenue" className="mt-0 h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardData.revenueChart}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => formatCurrency(value)}
                        labelFormatter={(label) => `Revenue for ${label}`}
                      />
                      <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>
                
                <TabsContent value="orders" className="mt-0 h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartLineChart data={dashboardData.ordersTimeline}>
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value} orders`, "Orders"]}
                        labelFormatter={(label) => `Time: ${label}`}
                      />
                      <Line type="monotone" dataKey="orders" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
                    </RechartLineChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Orders by Category</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartPieChart>
                  <Pie
                    data={dashboardData.ordersByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {dashboardData.ordersByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </RechartPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Recent Orders</CardTitle>
                <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                  <a href="/admin/orders">
                    View All
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={order.customer.avatar} alt={order.customer.name} />
                        <AvatarFallback>{getInitials(order.customer.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">#{order.id}</span>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {formatDistance(order.date, new Date(), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="hidden md:block text-right">
                        <div className="text-sm font-medium">{order.restaurant.name}</div>
                        <div className="text-sm text-muted-foreground">{formatCurrency(order.amount)}</div>
                      </div>
                      
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={order.restaurant.image} alt={order.restaurant.name} />
                        <AvatarFallback>{getInitials(order.restaurant.name)}</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Alerts */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Alerts & Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.alerts.map((alert) => (
                  <div key={alert.id} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex gap-3">
                      <div className="mt-0.5">
                        {getAlertIcon(alert.type)}
                      </div>
                      <div>
                        <h3 className="font-medium">{alert.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            {formatDistance(alert.timestamp, new Date(), { addSuffix: true })}
                          </span>
                          <Button variant="link" size="sm" className="h-auto p-0" asChild>
                            <a href={alert.link}>
                              View Details
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

// Summary Card Component
const SummaryCard = ({ title, value, icon, change, iconColor, subtext }) => {
  const isPositive = change >= 0;
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            
            <div className="flex items-center mt-1">
              {isPositive ? (
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? '+' : ''}{change.toFixed(2)}%
              </span>
              <span className="text-xs text-muted-foreground ml-1">from last month</span>
            </div>
            
            {subtext && (
              <p className="text-xs text-muted-foreground mt-2">{subtext}</p>
            )}
          </div>
          
          <div className={`${iconColor} rounded-full p-2`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Settings = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  );
};

export default AdminDashboard;
