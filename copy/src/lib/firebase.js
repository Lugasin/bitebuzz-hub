import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  PhoneAuthProvider 
} from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyD2p116zPL4PX-VOfZ9qcjnWY_hHSNzMO8",
  authDomain: "vonsedriverapp.firebaseapp.com",
  databaseURL: "https://vonsedriverapp-default-rtdb.firebaseio.com",
  projectId: "vonsedriverapp",
  storageBucket: "vonsedriverapp.appspot.com",
  messagingSenderId: "733220650661",
  appId: "1:733220650661:web:2ff5add0c6d766546c974c",
  measurementId: "G-00906Y0041"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const phoneProvider = new PhoneAuthProvider(auth);

// Initialize Services
export const db = getFirestore(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

export default app;