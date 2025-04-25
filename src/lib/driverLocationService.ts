import { db } from './firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

class DriverLocationService {
  // Update driver's current location
  async updateDriverLocation(driverId: string, location: { latitude: number; longitude: number }) {
    try {
      const driverLocationRef = doc(db, 'driver_locations', driverId);
      await setDoc(driverLocationRef, {
        location,
        updatedAt: new Date(),
        isActive: true
      }, { merge: true });
    } catch (error) {
      console.error('Error updating driver location:', error);
      throw error;
    }
  }

  // Set driver as inactive (offline)
  async setDriverInactive(driverId: string) {
    try {
      const driverLocationRef = doc(db, 'driver_locations', driverId);
      await updateDoc(driverLocationRef, {
        isActive: false,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error setting driver inactive:', error);
      throw error;
    }
  }

  // Get driver's current location
  async getDriverLocation(driverId: string) {
    try {
      const driverLocationRef = doc(db, 'driver_locations', driverId);
      const snapshot = await driverLocationRef.get();
      return snapshot.data();
    } catch (error) {
      console.error('Error getting driver location:', error);
      throw error;
    }
  }
}

export const driverLocationService = new DriverLocationService(); 