
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
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
  AreaChart,
  Area
} from 'recharts';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  Clock, 
  MapPin, 
  Zap, 
  Calendar,
  UserCheck,
  CheckCircle,
  AlertCircle,
  ThumbsUp
} from "lucide-react";
import { formatZambianCurrency } from "@/utils/zambianCuisine";

// Sample data
const weeklyEarnings = [
  { day: 'Mon', earnings: 420, deliveries: 8 },
  { day: 'Tue', earnings: 380, deliveries: 7 },
  { day: 'Wed', earnings: 530, deliveries: 10 },
  { day: 'Thu', earnings: 490, deliveries: 9 },
  { day: 'Fri', earnings: 650, deliveries: 12 },
  { day: 'Sat', earnings: 780, deliveries: 15 },
  { day: 'Sun', earnings: 710, deliveries: 13 }
];

const monthlyEarnings = [
  { month: 'Jan', earnings: 4800, deliveries: 92 },
  { month: 'Feb', earnings: 5200, deliveries: 98 },
  { month: 'Mar', earnings: 6100, deliveries: 115 },
  { month: 'Apr', earnings: 5800, deliveries: 110 },
  { month: 'May', earnings: 6500, deliveries: 125 },
  { month: 'Jun', earnings: 7200, deliveries: 140 }
];

const deliveryTimes = [
  { time: '10-15', count: 12 },
  { time: '15-20', count: 18 },
  { time: '20-25', count: 25 },
  { time: '25-30', count: 20 },
  { time: '30-35', count: 14 },
  { time: '35-40', count: 8 },
  { time: '40+', count: 5 }
];

const recentDeliveries = [
  { 
    id: 'D1001', 
    customer: 'John M.', 
    restaurant: 'Zambian Flavors', 
    amount: 85, 
    time: '32 min', 
    distance: '4.8 km', 
    status: 'completed', 
    tip: 15 
  },
  { 
    id: 'D1002', 
    customer: 'Sarah K.', 
    restaurant: 'Lusaka Eats', 
    amount: 120, 
    time: '28 min', 
    distance: '3.2 km', 
    status: 'completed', 
    tip: 20 
  },
  { 
    id: 'D1003', 
    customer: 'Michael C.', 
    restaurant: 'Traditional Tastes', 
    amount: 75, 
    time: '41 min', 
    distance: '5.5 km', 
    status: 'completed', 
    tip: 10 
  },
  { 
    id: 'D1004', 
    customer: 'Anna L.', 
    restaurant: 'Zambezi Kitchen', 
    amount: 95, 
    time: '26 min', 
    distance: '2.9 km', 
    status: 'completed', 
    tip: 25 
  },
  { 
    id: 'D1005', 
    customer: 'Robert N.', 
    restaurant: 'Zambian Flavors', 
    amount: 150, 
    time: '35 min', 
    distance: '4.3 km', 
    status: 'completed', 
    tip: 30 
  }
];

const areasByPerformance = [
  { area: "Arcades", deliveries: 45, avgTime: 25, rating: 4.8, earnings: 2450 },
  { area: "Manda Hill", deliveries: 52, avgTime: 22, rating: 4.9, earnings: 2800 },
  { area: "Kabulonga", deliveries: 38, avgTime: 28, rating: 4.7, earnings: 2100 },
  { area: "Woodlands", deliveries: 30, avgTime: 32, rating: 4.6, earnings: 1850 },
  { area: "Northmead", deliveries: 35, avgTime: 29, rating: 4.7, earnings: 1950 }
];

const DeliveryAnalytics = () => {
  const [timeRange, setTimeRange] = useState('weekly');
  const [isLoading, setIsLoading] = useState(false);

  // Calculate statistics
  const totalEarnings = weeklyEarnings.reduce((sum, day) => sum + day.earnings, 0);
  const totalDeliveries = weeklyEarnings.reduce((sum, day) => sum + day.deliveries, 0);
  const avgDeliveryTime = 28; // minutes
  const rating = 4.8;

  // In a real app, this would fetch data from Firebase
  const refreshData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Delivery Partner Dashboard</h1>
          <p className="text-muted-foreground">Your delivery performance and earnings</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setTimeRange('weekly')}>
            Weekly
          </Button>
          <Button variant="outline" onClick={() => setTimeRange('monthly')}>
            Monthly
          </Button>
          <Button onClick={refreshData} disabled={isLoading}>
            {isLoading ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                <h3 className="text-2xl font-bold mt-1">
                  {isLoading ? (
                    <Skeleton className="h-8 w-32" />
                  ) : (
                    formatZambianCurrency(totalEarnings)
                  )}
                </h3>
                <div className="flex items-center mt-1 gap-1 text-emerald-600">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="text-sm font-medium">18.2%</span>
                  <span className="text-xs text-muted-foreground">vs last week</span>
                </div>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Deliveries</p>
                <h3 className="text-2xl font-bold mt-1">
                  {isLoading ? (
                    <Skeleton className="h-8 w-32" />
                  ) : (
                    totalDeliveries
                  )}
                </h3>
                <div className="flex items-center mt-1 gap-1 text-emerald-600">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="text-sm font-medium">12.5%</span>
                  <span className="text-xs text-muted-foreground">vs last week</span>
                </div>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-full">
                <CheckCircle className="h-5 w-5 text-blue-500" />
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
                    avgDeliveryTime + ' min'
                  )}
                </h3>
                <div className="flex items-center mt-1 gap-1 text-emerald-600">
                  <ArrowDownRight className="h-4 w-4" />
                  <span className="text-sm font-medium">5.3%</span>
                  <span className="text-xs text-muted-foreground">vs last week</span>
                </div>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-full">
                <Clock className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Customer Rating</p>
                <h3 className="text-2xl font-bold mt-1">
                  {isLoading ? (
                    <Skeleton className="h-8 w-32" />
                  ) : (
                    rating.toFixed(1)
                  )}
                </h3>
                <div className="flex items-center mt-1 gap-1 text-emerald-600">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="text-sm font-medium">0.2</span>
                  <span className="text-xs text-muted-foreground">vs last week</span>
                </div>
              </div>
              <div className="p-3 bg-yellow-500/10 rounded-full">
                <ThumbsUp className="h-5 w-5 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Earnings & Deliveries</CardTitle>
          <CardDescription>
            View your earnings and deliveries over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[350px] w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={timeRange === 'weekly' ? weeklyEarnings : monthlyEarnings}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={timeRange === 'weekly' ? 'day' : 'month'} />
                <YAxis yAxisId="left" orientation="left" stroke="#FF6B00" />
                <YAxis yAxisId="right" orientation="right" stroke="#6366F1" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'earnings' ? formatZambianCurrency(value) : value,
                    name === 'earnings' ? 'Earnings' : 'Deliveries'
                  ]}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="earnings" name="Earnings" fill="#FF6B00" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="deliveries" name="Deliveries" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Two column layout for additional charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Delivery Time Distribution</CardTitle>
            <CardDescription>Minutes taken per delivery</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[250px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart
                  data={deliveryTimes}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" name="Deliveries" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Areas</CardTitle>
            <CardDescription>Areas with best earnings and ratings</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[250px] w-full" />
            ) : (
              <div className="space-y-4">
                {areasByPerformance.map((area) => (
                  <div key={area.area} className="flex items-center justify-between p-2 border-b">
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        {area.area}
                      </div>
                      <div className="text-sm text-muted-foreground flex gap-4 mt-1">
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          {area.deliveries} deliveries
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {area.avgTime} min avg
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatZambianCurrency(area.earnings)}</div>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <ThumbsUp className="h-3 w-3" />
                        {area.rating}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent deliveries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Deliveries</CardTitle>
          <CardDescription>Your latest completed deliveries</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {recentDeliveries.map((delivery) => (
                <div 
                  key={delivery.id} 
                  className="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{delivery.customer}</span>
                        <Badge variant="outline">{delivery.id}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        From {delivery.restaurant}
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="font-bold">{formatZambianCurrency(delivery.amount)}</span>
                      {delivery.tip > 0 && (
                        <span className="text-sm text-emerald-600">
                          +{formatZambianCurrency(delivery.tip)} tip
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {delivery.time}
                      </Badge>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {delivery.distance}
                      </Badge>
                    </div>
                    
                    <Badge className="bg-emerald-500">
                      Completed
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryAnalytics;
