// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { setLogLevel } from "firebase/firestore";

// Enable debug logging


const firebaseConfig = {
    apiKey: "AIzaSyDccZ-aCRTf7SOQsF9nMXjrPjxwX04jsHg",
    authDomain: "workflow-6b091.firebaseapp.com",
    projectId: "workflow-6b091",
    storageBucket: "workflow-6b091.firebasestorage.app",
    messagingSenderId: "545802335339",
    appId: "1:545802335339:web:c92c05dcd05e31185a2d2e",
    measurementId: "G-VG8LP3SMTQ"
};
setLogLevel('debug');
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();



// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDccZ-aCRTf7SOQsF9nMXjrPjxwX04jsHg",
//   authDomain: "workflow-6b091.firebaseapp.com",
//   projectId: "workflow-6b091",
//   storageBucket: "workflow-6b091.firebasestorage.app",
//   messagingSenderId: "545802335339",
//   appId: "1:545802335339:web:c92c05dcd05e31185a2d2e",
//   measurementId: "G-VG8LP3SMTQ"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);