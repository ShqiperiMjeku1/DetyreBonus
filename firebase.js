import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCzsGUYqlx4yrQDJJY6lgrYnaMUikMKI4Y",
  authDomain: "my-expo-go-app.firebaseapp.com",
  projectId: "my-expo-go-app",
  storageBucket: "my-expo-go-app.appspot.com",
  messagingSenderId: "202240217047",
  appId: "1:202240217047:web:12488614b511f8bfce8592",
  measurementId: "G-X7NZR4CZ37"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
