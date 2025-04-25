import { db } from '../config/firebase';
import { collection, query, where, getDocs, Timestamp, orderBy } from 'firebase/firestore';
import { OrderStatus } from '../types/order';

interface AnalyticsParams {
  startDate: string;
  endDate: string;
  restaurantId?: string;
}

interface AnalyticsData {
  dailyOrders: Array<{
    date: string;
    count: number;
    revenue: number;
  }>;
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
  orderStatus: Array<{
    status: OrderStatus;
    count: number;
  }>;
  summary: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    completionRate: number;
    averageDeliveryTime: number;
    customerSatisfaction: number;
  };
  peakHours: Array<{
    hour: number;
    orders: number;
  }>;
  deliveryPerformance: {
    averageTime: number;
    onTimeRate: number;
    lateRate: number;
  };
}

export const getAnalytics = async (params: AnalyticsParams): Promise<AnalyticsData> => {
  const { startDate, endDate, restaurantId } = params;
  const startTimestamp = Timestamp.fromDate(new Date(startDate));
  const endTimestamp = Timestamp.fromDate(new Date(endDate));

  // Base query for orders
  let ordersQuery = query(
    collection(db, 'orders'),
    where('createdAt', '>=', startTimestamp),
    where('createdAt', '<=', endTimestamp),
    orderBy('createdAt')
  );

  // Add restaurant filter if provided
  if (restaurantId) {
    ordersQuery = query(ordersQuery, where('restaurantId', '==', restaurantId));
  }

  const ordersSnapshot = await getDocs(ordersQuery);
  const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Process daily orders
  const dailyOrdersMap = new Map<string, { count: number; revenue: number }>();
  orders.forEach(order => {
    const date = order.createdAt.toDate().toISOString().split('T')[0];
    const existing = dailyOrdersMap.get(date) || { count: 0, revenue: 0 };
    dailyOrdersMap.set(date, {
      count: existing.count + 1,
      revenue: existing.revenue + (order.totalAmount || 0)
    });
  });

  const dailyOrders = Array.from(dailyOrdersMap.entries()).map(([date, data]) => ({
    date,
    ...data
  }));

  // Process top products
  const productSalesMap = new Map<string, { sales: number; revenue: number }>();
  orders.forEach(order => {
    order.items?.forEach(item => {
      const existing = productSalesMap.get(item.productId) || { sales: 0, revenue: 0 };
      productSalesMap.set(item.productId, {
        sales: existing.sales + item.quantity,
        revenue: existing.revenue + (item.price * item.quantity)
      });
    });
  });

  const topProducts = Array.from(productSalesMap.entries())
    .map(([productId, data]) => ({
      name: productId, // In real app, fetch product name from products collection
      ...data
    }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 10);

  // Process order status
  const statusCountMap = new Map<OrderStatus, number>();
  orders.forEach(order => {
    const count = statusCountMap.get(order.status) || 0;
    statusCountMap.set(order.status, count + 1);
  });

  const orderStatus = Array.from(statusCountMap.entries()).map(([status, count]) => ({
    status,
    count
  }));

  // Calculate summary metrics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const completedOrders = orders.filter(order => order.status === 'DELIVERED').length;
  const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

  // Calculate delivery performance
  const deliveredOrders = orders.filter(order => order.status === 'DELIVERED');
  const deliveryTimes = deliveredOrders.map(order => {
    const deliveryTime = order.deliveredAt?.toDate().getTime() - order.createdAt.toDate().getTime();
    return deliveryTime / (1000 * 60); // Convert to minutes
  });
  const averageDeliveryTime = deliveryTimes.length > 0 
    ? deliveryTimes.reduce((sum, time) => sum + time, 0) / deliveryTimes.length 
    : 0;
  const onTimeDeliveries = deliveryTimes.filter(time => time <= 45).length; // Assuming 45 minutes is the target
  const onTimeRate = deliveredOrders.length > 0 
    ? (onTimeDeliveries / deliveredOrders.length) * 100 
    : 0;

  // Calculate peak hours
  const hourMap = new Map<number, number>();
  orders.forEach(order => {
    const hour = order.createdAt.toDate().getHours();
    const count = hourMap.get(hour) || 0;
    hourMap.set(hour, count + 1);
  });

  const peakHours = Array.from(hourMap.entries())
    .map(([hour, orders]) => ({ hour, orders }))
    .sort((a, b) => b.orders - a.orders);

  // Calculate customer satisfaction (assuming we have ratings)
  const ratedOrders = orders.filter(order => order.rating);
  const customerSatisfaction = ratedOrders.length > 0
    ? ratedOrders.reduce((sum, order) => sum + order.rating, 0) / ratedOrders.length
    : 0;

  return {
    dailyOrders,
    topProducts,
    orderStatus,
    summary: {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      completionRate,
      averageDeliveryTime,
      customerSatisfaction
    },
    peakHours,
    deliveryPerformance: {
      averageTime: averageDeliveryTime,
      onTimeRate,
      lateRate: 100 - onTimeRate
    }
  };
}; 