
import { courierService } from '../../services/courier';
import { dbPool } from '../../db';

describe('CourierService', () => {
  // No need to create a new instance since we're using a singleton
  
  beforeEach(() => {
    // Reset any mocks before each test
    jest.clearAllMocks();
  });

  describe('findBestCourier', () => {
    it('should find the best courier based on multiple factors', async () => {
      // Mock the database query response
      jest.spyOn(dbPool, 'query').mockResolvedValueOnce([
        {
          id: 1,
          rating: 4.5,
          longitude: 28.2833,
          latitude: -15.4166,
          is_available: true
        },
        {
          id: 2,
          rating: 4.0, 
          longitude: 28.2834,
          latitude: -15.4167,
          is_available: true
        }
      ]);

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
      // Mock empty response from database
      jest.spyOn(dbPool, 'query').mockResolvedValueOnce([]);
      
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
      // Mock database queries
      jest.spyOn(dbPool, 'query').mockResolvedValue([]);

      const result = await courierService.assignCourier(1, 1);

      expect(result).toBe(true);
    });
  });

  describe('updateCourierLocation', () => {
    it('should update courier location and store in history', async () => {
      // Mock database queries
      jest.spyOn(dbPool, 'query').mockResolvedValue([]);

      const courierId = 1;
      const latitude = -15.4166;
      const longitude = 28.2833;

      const result = await courierService.updateCourierLocation(courierId, latitude, longitude);

      expect(result.courierId).toBe(courierId);
      expect(result.latitude).toBe(latitude);
      expect(result.longitude).toBe(longitude);
      expect(result.timestamp).toBeInstanceOf(Date);
    });
  });
}); 
