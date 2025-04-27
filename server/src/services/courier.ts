import { dbPool } from '../db';
import { calculateDistance } from '../utils/geo';

interface Courier {
  id: number;
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  isAvailable: boolean;
  rating: number;
  activeDeliveries: number;
  vehicleType: string;
}

interface Order {
  id: number;
  restaurantLocation: {
    latitude: number;
    longitude: number;
  };
  deliveryLocation: {
    latitude: number;
    longitude: number;
  };
  estimatedPreparationTime: number;
}

class CourierService {
  private MAX_ACTIVE_DELIVERIES = 3;
  private MAX_DISTANCE_KM = 10;
  private RATING_WEIGHT = 0.4;
  private DISTANCE_WEIGHT = 0.3;
  private LOAD_WEIGHT = 0.3;

  async findBestCourier(order: Order): Promise<number | null> {
    try {
      // Get all available couriers
      const [couriers] = await dbPool.query(`
        SELECT 
          u.id,
          u.current_location as currentLocation,
          u.is_available as isAvailable,
          u.rating,
          COUNT(d.id) as activeDeliveries,
          u.vehicle_type as vehicleType
        FROM users u
        LEFT JOIN deliveries d ON u.id = d.driver_id AND d.status IN ('assigned', 'picked')
        WHERE u.role = 'delivery' 
          AND u.is_available = true
        GROUP BY u.id
      `);

      if (!couriers.length) {
        return null;
      }

      // Calculate scores for each courier
      const scoredCouriers = couriers.map((courier: Courier) => {
        const distanceToRestaurant = calculateDistance(
          courier.currentLocation,
          order.restaurantLocation
        );

        const distanceToDelivery = calculateDistance(
          order.restaurantLocation,
          order.deliveryLocation
        );

        // Normalize values
        const normalizedRating = courier.rating / 5;
        const normalizedDistance = 1 - (distanceToRestaurant / this.MAX_DISTANCE_KM);
        const normalizedLoad = 1 - (courier.activeDeliveries / this.MAX_ACTIVE_DELIVERIES);

        // Calculate weighted score
        const score = 
          (normalizedRating * this.RATING_WEIGHT) +
          (normalizedDistance * this.DISTANCE_WEIGHT) +
          (normalizedLoad * this.LOAD_WEIGHT);

        return {
          courierId: courier.id,
          score,
          distanceToRestaurant,
          activeDeliveries: courier.activeDeliveries,
          vehicleType: courier.vehicleType
        };
      });

      // Sort by score and filter out couriers too far away
      const eligibleCouriers = scoredCouriers
        .filter(c => c.distanceToRestaurant <= this.MAX_DISTANCE_KM)
        .sort((a, b) => b.score - a.score);

      if (!eligibleCouriers.length) {
        return null;
      }

      // Return the best courier
      return eligibleCouriers[0].courierId;
    } catch (error) {
      console.error('Error finding best courier:', error);
      throw error;
    }
  }

  async assignCourier(orderId: number, courierId: number): Promise<boolean> {
    try {
      await dbPool.query(
        'INSERT INTO deliveries (order_id, driver_id, status) VALUES (?, ?, ?)',
        [orderId, courierId, 'assigned']
      );

      // Update courier availability if they've reached max deliveries
      const [deliveries] = await dbPool.query(
        'SELECT COUNT(*) as count FROM deliveries WHERE driver_id = ? AND status IN (?, ?)',
        [courierId, 'assigned', 'picked']
      );

      if (deliveries.count >= this.MAX_ACTIVE_DELIVERIES) {
        await dbPool.query(
          'UPDATE users SET is_available = false WHERE id = ?',
          [courierId]
        );
      }

      return true;
    } catch (error) {
      console.error('Error assigning courier:', error);
      throw error;
    }
  }

  async updateCourierLocation(courierId: number, location: { latitude: number; longitude: number }) {
    try {
      await dbPool.query(
        'UPDATE users SET current_location = POINT(?, ?) WHERE id = ?',
        [location.longitude, location.latitude, courierId]
      );

      // Store in history
      await dbPool.query(
        'INSERT INTO courier_location_history (courier_id, latitude, longitude) VALUES (?, ?, ?)',
        [courierId, location.latitude, location.longitude]
      );
    } catch (error) {
      console.error('Error updating courier location:', error);
      throw error;
    }
  }

  async updateCourierAvailability(courierId: number, isAvailable: boolean) {
    try {
      await dbPool.query(
        'UPDATE users SET is_available = ? WHERE id = ?',
        [isAvailable, courierId]
      );
    } catch (error) {
      console.error('Error updating courier availability:', error);
      throw error;
    }
  }
}

export default CourierService; 