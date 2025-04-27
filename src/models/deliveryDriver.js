import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { apiService } from '@/services/apiService';

class DeliveryDriver {
  constructor(data) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.location = data.location || null;
    this.status = data.status || 'offline';
    this.vehicle = data.vehicle || null;
    this.rating = data.rating || 0;
    this.totalDeliveries = data.totalDeliveries || 0;
  }

  static async getDeliveryDriverByFirebaseUid(uid) {
    try {
      const db = getFirestore();
      const driverDoc = await getDoc(doc(db, 'deliveryDrivers', uid));
      
      if (driverDoc.exists()) {
        return new DeliveryDriver({ id: uid, ...driverDoc.data() });
      }
      
      // If not found in Firebase, try the custom API
      const apiData = await apiService.getDeliveryDriverProfile(uid);
      return new DeliveryDriver(apiData);
    } catch (error) {
      console.error('Error fetching delivery driver:', error);
      throw error;
    }
  }

  async updateLocation(location) {
    try {
      const db = getFirestore();
      await updateDoc(doc(db, 'deliveryDrivers', this.id), {
        location: location,
        lastUpdated: new Date()
      });
      
      // Also update in custom API
      await apiService.updateDeliveryDriverLocation(this.id, location);
      
      this.location = location;
      return this;
    } catch (error) {
      console.error('Error updating location:', error);
      throw error;
    }
  }

  async updateStatus(status) {
    try {
      const db = getFirestore();
      await updateDoc(doc(db, 'deliveryDrivers', this.id), {
        status: status,
        lastUpdated: new Date()
      });
      
      // Also update in custom API
      await apiService.updateDeliveryDriverStatus(this.id, status);
      
      this.status = status;
      return this;
    } catch (error) {
      console.error('Error updating status:', error);
      throw error;
    }
  }

  async getActiveDeliveries() {
    try {
      // Get from custom API
      return await apiService.getActiveDeliveries(this.id);
    } catch (error) {
      console.error('Error fetching active deliveries:', error);
      throw error;
    }
  }

  async getAvailableOrders() {
    try {
      // Get from custom API
      return await apiService.getAvailableOrders(this.id);
    } catch (error) {
      console.error('Error fetching available orders:', error);
      throw error;
    }
  }

  async getRecentDeliveries() {
    try {
      // Get from custom API
      return await apiService.getRecentDeliveries(this.id);
    } catch (error) {
      console.error('Error fetching recent deliveries:', error);
      throw error;
    }
  }

  async getEarnings() {
    try {
      // Get from custom API
      return await apiService.getDriverEarnings(this.id);
    } catch (error) {
      console.error('Error fetching earnings:', error);
      throw error;
    }
  }
}

export { DeliveryDriver };