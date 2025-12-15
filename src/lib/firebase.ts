import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyAjNpQ-6PNrXOjhM1zqufFDW5Vu0mgODMQ",
    authDomain: "neural-sync.firebaseapp.com",
    projectId: "neural-sync",
    storageBucket: "neural-sync.firebasestorage.app",
    messagingSenderId: "357205323874",
    appId: "1:357205323874:web:92b7806afc7b05e685e13b",
    measurementId: "G-8Z90VRQKDQ"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);

// Analytics (only on client side)
let analytics;
if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
}

export { analytics };
