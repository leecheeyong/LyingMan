import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "lyingman.firebaseapp.com",
  projectId: "lyingman",
  storageBucket: "lyingman.firebasestorage.app",
  messagingSenderId: "1001586286359",
  appId: "1:1001586286359:web:61f6455f3f4d005db1e152",
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
