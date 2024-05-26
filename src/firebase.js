// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "auth-app-9fbae.firebaseapp.com",
    projectId: "auth-app-9fbae",
    storageBucket: "auth-app-9fbae.appspot.com",
    messagingSenderId: "14797958485",
    appId: "1:14797958485:web:668aa333a096d776bcd3dc"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);