import { db } from './firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

interface Location {
  latitude: number;
  longitude: number;
}

interface DeliveryPoint {
  id: string;
  location: Location;
  address: string;
  type: 'pickup' | 'delivery';
  orderId: string;
  priority: number;
  timeWindow?: {
    start: Date;
    end: Date;
  };
}

interface OptimizedRoute {
  points: DeliveryPoint[];
  totalDistance: number;
  estimatedTime: number;
  waypoints: Location[];
}

class RouteService {
  // Get optimized route for a driver
  async getOptimizedRoute(driverId: string): Promise<OptimizedRoute> {
    try {
      // Get all active deliveries for the driver
      const deliveriesQuery = query(
        collection(db, 'deliveries'),
        where('driverId', '==', driverId),
        where('status', 'in', ['assigned', 'picked']),
        orderBy('priority', 'desc')
      );

      const deliveriesSnapshot = await getDocs(deliveriesQuery);
      const deliveryPoints: DeliveryPoint[] = [];

      deliveriesSnapshot.forEach(doc => {
        const data = doc.data();
        deliveryPoints.push({
          id: doc.id,
          location: data.location,
          address: data.address,
          type: data.type,
          orderId: data.orderId,
          priority: data.priority || 0,
          timeWindow: data.timeWindow
        });
      });

      // Sort points by priority and time window
      const sortedPoints = this.sortDeliveryPoints(deliveryPoints);

      // Calculate route details
      const route = await this.calculateRouteDetails(sortedPoints);

      return route;
    } catch (error) {
      console.error('Error getting optimized route:', error);
      throw error;
    }
  }

  // Sort delivery points by priority and time window
  private sortDeliveryPoints(points: DeliveryPoint[]): DeliveryPoint[] {
    return points.sort((a, b) => {
      // First sort by priority
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }

      // Then sort by time window if available
      if (a.timeWindow && b.timeWindow) {
        return a.timeWindow.start.getTime() - b.timeWindow.start.getTime();
      }

      return 0;
    });
  }

  // Calculate route details (distance, time, waypoints)
  private async calculateRouteDetails(points: DeliveryPoint[]): Promise<OptimizedRoute> {
    // In a real implementation, this would use a routing service like Google Maps Directions API
    // For now, we'll return a simplified version
    const waypoints = points.map(point => point.location);
    
    // Calculate total distance (simplified)
    const totalDistance = this.calculateTotalDistance(waypoints);
    
    // Estimate time based on distance (assuming average speed of 30 km/h)
    const estimatedTime = (totalDistance / 30) * 60; // in minutes

    return {
      points,
      totalDistance,
      estimatedTime,
      waypoints
    };
  }

  // Calculate total distance between points (simplified)
  private calculateTotalDistance(points: Location[]): number {
    let totalDistance = 0;
    for (let i = 0; i < points.length - 1; i++) {
      totalDistance += this.calculateDistance(points[i], points[i + 1]);
    }
    return totalDistance;
  }

  // Calculate distance between two points using Haversine formula
  private calculateDistance(point1: Location, point2: Location): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(point2.latitude - point1.latitude);
    const dLon = this.toRad(point2.longitude - point1.longitude);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRad(point1.latitude)) * Math.cos(this.toRad(point2.latitude)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

export const routeService = new RouteService(); 