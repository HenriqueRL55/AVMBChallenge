// Firebase
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configurações do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDLUKLdzP9dvnwu5_4VyBFV1NuqXOtCVns",
  authDomain: "avmbchallenge.firebaseapp.com",
  projectId: "avmbchallenge",
  storageBucket: "avmbchallenge.appspot.com",
  messagingSenderId: "710968096532",
  appId: "1:710968096532:web:bb98f122b9906d8ac73401",
  measurementId: "G-SJV7RYFSRW",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
