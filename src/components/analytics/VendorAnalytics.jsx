
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Calendar, 
  TrendingUp, 
  ChevronDown, 
  BarChart2,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Download
} from "lucide-react";
import { formatZambianCurrency } from "@/utils/zambianCuisine";

// Sample data for the analytics charts
const salesData = [
  { name: 'Mon', sales: 6500 },
  { name: 'Tue', sales: 5800 },
  { name: 'Wed', sales: 8400 },
  { name: 'Thu', sales: 7900 },
  { name: 'Fri', sales: 9600 },
  { name: 'Sat', sales: 11200 },
  { name: 'Sun', sales: 10300 }
];

const monthlyData = [
  { name: 'Jan', sales: 85000 },
  { name: 'Feb', sales: 92000 },
  { name: 'Mar', sales: 105000 },
  { name: 'Apr', sales: 98000 },
  { name: 'May', sales: 115000 },
  { name: 'Jun', sales: 125000 }
];

const topSellingItems = [
  { name: 'Nshima with Chicken', value: 35 },
  { name: 'Village Chicken', value: 25 },
  { name: 'Ifisashi', value: 15 },
  { name: 'Kapenta', value: 12 },
  { name: 'Mundkoyo', value: 8 },
  { name: 'Other', value: 5 }
];

const COLORS = ['#FF6B00', '#10B981', '#6366F1', '#F43F5E', '#F59E0B', '#8B5CF6'];

const deliveryPerformance = [
  { name: 'On Time', value: 85 },
  { name: 'Late', value: 12 },
  { name: 'Very Late', value: 3 }
];

const customerFeedback = [
  { name: '5 Star', value: 65 },
  { name: '4 Star', value: 22 },
  { name: '3 Star', value: 8 },
  { name: '2 Star', value: 3 },
  { name: '1 Star', value: 2 }
];

const VendorAnalytics = () => {
  const [timeRange, setTimeRange] = useState('weekly');
  const [isLoading, setIsLoading] = useState(false);

  // In a real app, this would fetch data from Firebase
  const refreshData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const downloadReport = () => {
    // In a real app, this would generate a CSV or PDF report
    alert('Report download would start here in the production version');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Vendor Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track your restaurant's performance and growth</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Button variant="outline" className="flex gap-2 items-center">
              {timeRange === 'weekly' ? 'This Week' : timeRange === 'monthly' ? 'This Month' : 'This Year'}
              <ChevronDown className="h-4 w-4" />
            </Button>
            {/* In a real app, this would be a dropdown */}
          </div>
          <Button variant="outline" onClick={refreshData} disabled={isLoading}>
            {isLoading ? 'Refreshing...' : 'Refresh Data'}
          </Button>
          <Button onClick={downloadReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                <h3 className="text-2xl font-bold mt-1">
                  {isLoading ? (
                    <Skeleton className="h-8 w-32" />
                  ) : (
                    formatZambianCurrency(59800)
                  )}
                </h3>
                <div className="flex items-center mt-1 gap-1 text-emerald-600">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="text-sm font-medium">12.5%</span>
                  <span className="text-xs text-muted-foreground">vs last week</span>
                </div>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <h3 className="text-2xl font-bold mt-1">
                  {isLoading ? (
                    <Skeleton className="h-8 w-32" />
                  ) : (
                    "426"
                  )}
                </h3>
                <div className="flex items-center mt-1 gap-1 text-emerald-600">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="text-sm font-medium">8.2%</span>
                  <span className="text-xs text-muted-foreground">vs last week</span>
                </div>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-full">
                <ShoppingBag className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Customer Satisfaction</p>
                <h3 className="text-2xl font-bold mt-1">
                  {isLoading ? (
                    <Skeleton className="h-8 w-32" />
                  ) : (
                    "94.5%"
                  )}
                </h3>
                <div className="flex items-center mt-1 gap-1 text-emerald-600">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="text-sm font-medium">2.1%</span>
                  <span className="text-xs text-muted-foreground">vs last week</span>
                </div>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-full">
                <Users className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Delivery Time</p>
                <h3 className="text-2xl font-bold mt-1">
                  {isLoading ? (
                    <Skeleton className="h-8 w-32" />
                  ) : (
                    "32 min"
                  )}
                </h3>
                <div className="flex items-center mt-1 gap-1 text-red-500">
                  <ArrowDownRight className="h-4 w-4" />
                  <span className="text-sm font-medium">5.3%</span>
                  <span className="text-xs text-muted-foreground">vs last week</span>
                </div>
              </div>
              <div className="p-3 bg-indigo-500/10 rounded-full">
                <Calendar className="h-5 w-5 text-indigo-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>
            View your sales performance over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[350px] w-full" />
          ) : (
            <Tabs defaultValue="bar" className="w-full">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="bar" className="flex items-center gap-1">
                    <BarChart2 className="h-4 w-4" /> Bar
                  </TabsTrigger>
                  <TabsTrigger value="line" className="flex items-center gap-1">
                    <LineChartIcon className="h-4 w-4" /> Line
                  </TabsTrigger>
                </TabsList>
                
                <div className="text-sm text-muted-foreground">
                  Showing data for {timeRange === 'weekly' ? 'the past 7 days' : 'the past 6 months'}
                </div>
              </div>
              
              <TabsContent value="bar" className="pt-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={timeRange === 'weekly' ? salesData : monthlyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis 
                      tickFormatter={(value) => `K${(value / 1000).toFixed(0)}k`} 
                    />
                    <Tooltip formatter={(value) => formatZambianCurrency(value)} />
                    <Legend />
                    <Bar 
                      dataKey="sales" 
                      name="Sales" 
                      fill="#FF6B00" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="line" className="pt-2">
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart
                    data={timeRange === 'weekly' ? salesData : monthlyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis 
                      tickFormatter={(value) => `K${(value / 1000).toFixed(0)}k`} 
                    />
                    <Tooltip formatter={(value) => formatZambianCurrency(value)} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      name="Sales" 
                      stroke="#FF6B00"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
        <CardFooter className="justify-end">
          <Button variant="link" className="gap-1">
            <TrendingUp className="h-4 w-4" />
            View detailed analysis
          </Button>
        </CardFooter>
      </Card>

      {/* Pie charts grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Selling Items</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={topSellingItems}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {topSellingItems.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Delivery Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={deliveryPerformance}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {deliveryPerformance.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === 0 ? '#10B981' : index === 1 ? '#F59E0B' : '#EF4444'} 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Customer Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={customerFeedback}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {customerFeedback.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          index === 0 ? '#10B981' : 
                          index === 1 ? '#22C55E' : 
                          index === 2 ? '#F59E0B' : 
                          index === 3 ? '#F97316' : 
                          '#EF4444'
                        } 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorAnalytics;
