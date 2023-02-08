import { initializeApp, getApp, getApps } from 'firebase/app';
import {getFirestore} from 'firebase/firestore'


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  projectId: process.env.FIREBASE_PROJECTID,
  storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
  appId: process.env.FIREBASE_APPID
};

// Inicializa Firebase para SSR
const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore(firebaseApp);
 
export {firebaseApp, db}


