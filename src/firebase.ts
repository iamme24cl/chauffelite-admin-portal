import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCKE5PeqpXrIzPeaQKNwilUCHR-kEOHlfM",
  authDomain: "luxride-dev.firebaseapp.com",
  projectId: "luxride-dev",
  storageBucket: "luxride-dev.firebasestorage.app",
  messagingSenderId: "795477076815",
  appId: "1:795477076815:web:37303c4002150a6e00b33a",
  measurementId: "G-8K24WTE251"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;