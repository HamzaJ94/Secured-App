import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdGBctJkF7nKBZVFmWTZ0YuxCvJGojcRg",
  authDomain: "react-app-9b63e.firebaseapp.com",
  projectId: "react-app-9b63e",
  storageBucket: "react-app-9b63e.appspot.com",
  messagingSenderId: "354226394108",
  appId: "1:354226394108:web:da44c6c4d915e1d2861879",
  measurementId: "G-6E4YM4N4ME"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
