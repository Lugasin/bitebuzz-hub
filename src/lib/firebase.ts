import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase } from 'firebase/database';
import { getMessaging } from 'firebase/messaging';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2p116zPL4PX-VOfZ9qcjnWY_hHSNzMO8",
  authDomain: "vonsedriverapp.firebaseapp.com",
  databaseURL: "https://vonsedriverapp-default-rtdb.firebaseio.com",
  projectId: "vonsedriverapp",
  storageBucket: "vonsedriverapp.appspot.com",
  messagingSenderId: "733220650661",
  appId: "1:733220650661:web:0ef884453f96b6106c974c",
  measurementId: "G-SM4K5NDYKS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);
const realtimeDb = getDatabase(app);
const messaging = getMessaging(app);

export { 
  app, 
  auth, 
  db, 
  storage, 
  analytics, 
  realtimeDb,
  messaging,
  firebaseConfig 
}; 