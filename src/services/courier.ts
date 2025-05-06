
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

/**
 * Service for handling courier-related operations
 */
export class CourierService {
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
   * @returns {Promise<AssignCourierResult>} The assignment result
   */
  async assignCourier(orderId: number): Promise<AssignCourierResult> {
    try {
      // Find available couriers
      const availableCouriers = await dbPool.query(
        `SELECT id, latitude, longitude FROM users 
         WHERE role = 'delivery' AND is_available = true 
         ORDER BY RAND() LIMIT 1`
      );
      
      if (!availableCouriers.length) {
        throw new Error("No available couriers found");
      }
      
      const courier = availableCouriers[0];
      
      // Assign courier to order
      await dbPool.query(
        `UPDATE deliveries SET courier_id = ?, status = 'assigned' WHERE order_id = ?`,
        [courier.id, orderId]
      );
      
      // Update courier availability
      await dbPool.query(
        `UPDATE users SET is_available = false WHERE id = ?`,
        [courier.id]
      );
      
      return {
        courierId: courier.id,
        orderId,
        status: 'assigned'
      };
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

export default new CourierService();
