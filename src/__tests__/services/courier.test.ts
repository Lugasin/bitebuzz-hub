import CourierService from '../../services/courier';
import { dbPool } from '../../db';

describe('CourierService', () => {
  let courierService: CourierService;

  beforeEach(() => {
    courierService = new CourierService();
  });

  describe('findBestCourier', () => {
    it('should find the best courier based on multiple factors', async () => {
      // Insert test data
      await dbPool.query(`
        INSERT INTO users (id, role, is_available, rating, current_location, vehicle_type)
        VALUES 
          (1, 'delivery', true, 4.5, POINT(28.2833, -15.4166), 'motorcycle'),
          (2, 'delivery', true, 4.0, POINT(28.2834, -15.4167), 'bicycle'),
          (3, 'delivery', false, 5.0, POINT(28.2835, -15.4168), 'car')
      `);

      const order = {
        id: 1,
        restaurantLocation: {
          latitude: -15.4166,
          longitude: 28.2833
        },
        deliveryLocation: {
          latitude: -15.4167,
          longitude: 28.2834
        },
        estimatedPreparationTime: 30
      };

      const bestCourierId = await courierService.findBestCourier(order);

      expect(bestCourierId).toBe(1); // Should select the courier with highest rating and closest location
    });

    it('should return null if no available couriers', async () => {
      const order = {
        id: 1,
        restaurantLocation: {
          latitude: -15.4166,
          longitude: 28.2833
        },
        deliveryLocation: {
          latitude: -15.4167,
          longitude: 28.2834
        },
        estimatedPreparationTime: 30
      };

      const bestCourierId = await courierService.findBestCourier(order);

      expect(bestCourierId).toBeNull();
    });
  });

  describe('assignCourier', () => {
    it('should assign a courier to an order', async () => {
      // Insert test data
      await dbPool.query(`
        INSERT INTO users (id, role, is_available)
        VALUES (1, 'delivery', true)
      `);

      const result = await courierService.assignCourier(1, 1);

      expect(result).toBe(true);

      // Verify delivery record was created
      const [delivery] = await dbPool.query(
        'SELECT * FROM deliveries WHERE order_id = ? AND driver_id = ?',
        [1, 1]
      );

      expect(delivery).toBeDefined();
      expect(delivery.status).toBe('assigned');
    });

    it('should update courier availability when max deliveries reached', async () => {
      // Insert test data
      await dbPool.query(`
        INSERT INTO users (id, role, is_available)
        VALUES (1, 'delivery', true)
      `);

      // Create max deliveries
      for (let i = 1; i <= 3; i++) {
        await dbPool.query(`
          INSERT INTO deliveries (order_id, driver_id, status)
          VALUES (?, 1, 'assigned')
        `, [i]);
      }

      await courierService.assignCourier(4, 1);

      // Verify courier is no longer available
      const [courier] = await dbPool.query(
        'SELECT is_available FROM users WHERE id = ?',
        [1]
      );

      expect(courier.is_available).toBe(false);
    });
  });

  describe('updateCourierLocation', () => {
    it('should update courier location and store in history', async () => {
      // Insert test data
      await dbPool.query(`
        INSERT INTO users (id, role)
        VALUES (1, 'delivery')
      `);

      const location = {
        latitude: -15.4166,
        longitude: 28.2833
      };

      await courierService.updateCourierLocation(1, location);

      // Verify location was updated
      const [courier] = await dbPool.query(
        'SELECT ST_X(current_location) as longitude, ST_Y(current_location) as latitude FROM users WHERE id = ?',
        [1]
      );

      expect(courier.longitude).toBe(location.longitude);
      expect(courier.latitude).toBe(location.latitude);

      // Verify history was recorded
      const [history] = await dbPool.query(
        'SELECT * FROM courier_location_history WHERE courier_id = ?',
        [1]
      );

      expect(history).toBeDefined();
      expect(history.latitude).toBe(location.latitude);
      expect(history.longitude).toBe(location.longitude);
    });
  });
}); 