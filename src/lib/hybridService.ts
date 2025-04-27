import { auth, db } from './firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

class HybridService {
  // Authentication
  async loginWithEmailPassword(email: string, password: string) {
    try {
      // First try Firebase auth
      const firebaseUser = await auth.signInWithEmailAndPassword(email, password);
      
      // Then authenticate with custom API
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });

      return {
        firebaseUser,
        apiToken: response.data.token
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // User Profile
  async getUserProfile(userId: string, apiToken: string) {
    try {
      // Get Firebase profile
      const userDoc = await getDoc(doc(db, 'users', userId));
      const firebaseProfile = userDoc.data();

      // Get API profile
      const response = await axios.get(`${API_BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${apiToken}` }
      });

      return {
        ...firebaseProfile,
        ...response.data.user
      };
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  // Driver Location
  async updateDriverLocation(driverId: string, location: { latitude: number; longitude: number }, apiToken: string) {
    try {
      // Update Firebase
      const driverLocationRef = doc(db, 'driver_locations', driverId);
      await setDoc(driverLocationRef, {
        location,
        updatedAt: new Date(),
        isActive: true
      }, { merge: true });

      // Update API
      await axios.post(`${API_BASE_URL}/driver/location`, {
        driverId,
        location
      }, {
        headers: { Authorization: `Bearer ${apiToken}` }
      });
    } catch (error) {
      console.error('Error updating driver location:', error);
      throw error;
    }
  }

  // Orders
  async getOrderDetails(orderId: string, apiToken: string) {
    try {
      // Get Firebase order data
      const orderDoc = await getDoc(doc(db, 'orders', orderId));
      const firebaseOrder = orderDoc.data();

      // Get API order data
      const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${apiToken}` }
      });

      return {
        ...firebaseOrder,
        ...response.data.order
      };
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  }
}

export const hybridService = new HybridService(); 