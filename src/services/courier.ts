
import { dbPool } from "../db";

interface CourierLocation {
  courierId: number;
  latitude: number;
  longitude: number;
  timestamp: Date;
}

interface AssignCourierResult {
  courierId: number;
  orderId: number;
  status: string;
}

interface CourierStatusUpdate {
  courierId: number;
  isAvailable: boolean;
  status?: string;
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

/**
 * Service for handling courier-related operations
 */
class CourierService {
  /**
   * Find the best courier for an order
   * @param {Order} order - The order to assign a courier to
   * @returns {Promise<number | null>} The ID of the best courier, or null if none available
   */
  async findBestCourier(order: Order): Promise<number | null> {
    try {
      // Find available couriers
      const availableCouriers = await dbPool.query<{ id: number; rating: number; longitude: number; latitude: number }>(
        `SELECT id, rating, longitude, latitude FROM users 
         WHERE role = 'delivery' AND is_available = true`
      );
      
      if (!availableCouriers.length) {
        return null;
      }
      
      // Calculate scores for each courier based on rating, distance, etc.
      // This is a simplified algorithm - real-world would be more complex
      const scoredCouriers = availableCouriers.map(courier => {
        // Calculate distance from courier to restaurant (simplified)
        const distance = Math.sqrt(
          Math.pow(courier.longitude - order.restaurantLocation.longitude, 2) + 
          Math.pow(courier.latitude - order.restaurantLocation.latitude, 2)
        );
        
        // Score is weighted: rating is 40%, distance is 60% (lower is better)
        const score = (courier.rating * 0.4) + ((1 / distance) * 0.6);
        
        return {
          id: courier.id,
          score
        };
      });
      
      // Sort by score, highest first
      scoredCouriers.sort((a, b) => b.score - a.score);
      
      // Return the best courier's ID
      return scoredCouriers[0]?.id || null;
    } catch (error) {
      console.error("Error finding best courier:", error);
      return null;
    }
  }

  /**
   * Update a courier's location
   * @param {number} courierId - The courier's ID
   * @param {number} latitude - The courier's latitude
   * @param {number} longitude - The courier's longitude
   * @returns {Promise<CourierLocation>} The updated courier location
   */
  async updateCourierLocation(
    courierId: number,
    latitude: number,
    longitude: number
  ): Promise<CourierLocation> {
    try {
      // In a real app, this would update the database
      // For now, we'll just log the update
      console.log(`Updating courier ${courierId} location: ${latitude}, ${longitude}`);
      
      const timestamp = new Date();
      
      // Insert into location history
      await dbPool.query(
        `INSERT INTO courier_location_history (courier_id, latitude, longitude, timestamp) 
         VALUES (?, ?, ?, ?)`,
        [courierId, latitude, longitude, timestamp]
      );
      
      // Update current location
      await dbPool.query(
        `UPDATE users 
         SET latitude = ?, longitude = ?, last_location_update = ? 
         WHERE id = ? AND role = 'delivery'`,
        [latitude, longitude, timestamp, courierId]
      );
      
      return {
        courierId,
        latitude,
        longitude,
        timestamp
      };
    } catch (error) {
      console.error("Error updating courier location:", error);
      throw new Error(`Failed to update courier location: ${(error as Error).message}`);
    }
  }

  /**
   * Assign a courier to an order
   * @param {number} orderId - The order ID
   * @param {number} courierId - The courier ID
   * @returns {Promise<boolean>} Whether the assignment was successful
   */
  async assignCourier(orderId: number, courierId: number): Promise<boolean> {
    try {
      // Assign courier to order
      await dbPool.query(
        `UPDATE deliveries SET courier_id = ?, status = 'assigned' WHERE order_id = ?`,
        [courierId, orderId]
      );
      
      // Update courier availability
      await dbPool.query(
        `UPDATE users SET is_available = false WHERE id = ?`,
        [courierId]
      );
      
      return true;
    } catch (error) {
      console.error("Error assigning courier:", error);
      throw new Error(`Failed to assign courier: ${(error as Error).message}`);
    }
  }

  /**
   * Update a courier's availability status
   * @param {CourierStatusUpdate} update - The status update
   * @returns {Promise<boolean>} Whether the update was successful
   */
  async updateCourierStatus({ courierId, isAvailable, status }: CourierStatusUpdate): Promise<boolean> {
    try {
      // Update courier status
      if (status) {
        await dbPool.query(
          `UPDATE users SET is_available = ?, status = ? WHERE id = ? AND role = 'delivery'`,
          [isAvailable, status, courierId]
        );
      } else {
        await dbPool.query(
          `UPDATE users SET is_available = ? WHERE id = ? AND role = 'delivery'`,
          [isAvailable, courierId]
        );
      }
      
      return true;
    } catch (error) {
      console.error("Error updating courier status:", error);
      throw new Error(`Failed to update courier status: ${(error as Error).message}`);
    }
  }
}

// Export a singleton instance
export const courierService = new CourierService();
export default courierService;
