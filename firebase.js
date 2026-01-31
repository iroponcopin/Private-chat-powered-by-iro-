// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// Your web app's Firebase configuration
// For GitHub Pages deployment, these values should ideally come from Env Vars (Vite logic)
// But for "Code Only" initialization, we put placeholders.
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

// Development: Connect to Emulators if running locally (Optional, controlled by Env flag)
if (window.location.hostname === "localhost") {
    // connectAuthEmulator(auth, "http://127.0.0.1:9099");
    // connectFirestoreEmulator(db, '127.0.0.1', 8080);
    // connectFunctionsEmulator(functions, "127.0.0.1", 5001);
}

export { auth, db, functions };
