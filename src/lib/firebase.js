// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

async function getToken() {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    return token;
  }
  return null;
}

export { app, analytics, auth, db, googleProvider, facebookProvider, getToken, storage };