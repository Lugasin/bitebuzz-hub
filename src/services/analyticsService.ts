
// Analytics service for fetching and processing analytics data

interface AnalyticsQuery {
  startDate: string;
  endDate: string;
  restaurantId?: string;
}

interface AnalyticsResult {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  topSellingItems: Array<{
    itemId: string;
    name: string;
    quantity: number;
    revenue: number;
  }>;
  ordersByDay: Array<{
    date: string;
    count: number;
    revenue: number;
  }>;
}

export const getAnalytics = async (query: AnalyticsQuery): Promise<AnalyticsResult> => {
  // In a real implementation, this would query a database
  // For now, return mock data
  
  // Parse dates from the query
  const startDate = new Date(query.startDate);
  const endDate = new Date(query.endDate);
  
  // Generate a range of dates between start and end
  const dateRange = generateDateRange(startDate, endDate);
  
  // Generate mock order data for each date in the range
  const ordersByDay = dateRange.map(date => ({
    date: date.toISOString().split('T')[0],
    count: Math.floor(Math.random() * 50) + 10, // Random order count between 10-60
    revenue: Math.floor(Math.random() * 5000) + 1000, // Random revenue between 1000-6000
  }));
  
  // Calculate totals
  const totalOrders = ordersByDay.reduce((sum, day) => sum + day.count, 0);
  const totalRevenue = ordersByDay.reduce((sum, day) => sum + day.revenue, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  // Generate mock top-selling items
  const topSellingItems = [
    {
      itemId: '1',
      name: 'Chicken Burger',
      quantity: Math.floor(Math.random() * 100) + 50,
      revenue: Math.floor(Math.random() * 1500) + 500,
    },
    {
      itemId: '2',
      name: 'Veggie Pizza',
      quantity: Math.floor(Math.random() * 100) + 40,
      revenue: Math.floor(Math.random() * 1300) + 400,
    },
    {
      itemId: '3',
      name: 'Chocolate Shake',
      quantity: Math.floor(Math.random() * 100) + 30,
      revenue: Math.floor(Math.random() * 1000) + 300,
    },
    {
      itemId: '4',
      name: 'French Fries',
      quantity: Math.floor(Math.random() * 100) + 70,
      revenue: Math.floor(Math.random() * 800) + 200,
    },
    {
      itemId: '5',
      name: 'Ice Cream Sundae',
      quantity: Math.floor(Math.random() * 100) + 20,
      revenue: Math.floor(Math.random() * 700) + 100,
    },
  ];
  
  return {
    totalOrders,
    totalRevenue,
    averageOrderValue,
    topSellingItems,
    ordersByDay,
  };
};

// Helper function to generate an array of dates between two dates
function generateDateRange(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
}
