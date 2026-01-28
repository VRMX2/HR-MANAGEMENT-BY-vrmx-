import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD8D9HGfoxjaocCHJTijDlTBvdtXueMl0M",
    authDomain: "vrmx-hrms-pro.firebaseapp.com",
    projectId: "vrmx-hrms-pro",
    storageBucket: "vrmx-hrms-pro.firebasestorage.app",
    messagingSenderId: "777926547029",
    appId: "1:777926547029:web:cfce4fa44527fcabb626dc"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
