// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// =================================================================================
// تم ربط التطبيق بنجاح
// Your web app's Firebase configuration
// =================================================================================
const firebaseConfig = {
  apiKey: "AIzaSyBouopH2Dd9E-m35NXIhHggtfGRuAskPLU",
  authDomain: "bn-dahou-moul.firebaseapp.com",
  projectId: "bn-dahou-moul",
  storageBucket: "bn-dahou-moul.firebasestorage.app",
  messagingSenderId: "539291953673",
  appId: "1:539291953673:web:a66f4921b5dac55a89a6d8"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
