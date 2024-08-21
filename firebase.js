// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC4zdYdN1y637CZbqwwuyc9haTZfXGYpI0",
    authDomain: "fir-node-8c975.firebaseapp.com",
    projectId: "fir-node-8c975",
    storageBucket: "fir-node-8c975.appspot.com",
    messagingSenderId: "460327938400",
    appId: "1:460327938400:web:b21f7d4ce43eb059539605",
    measurementId: "G-6C815VCE9V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);