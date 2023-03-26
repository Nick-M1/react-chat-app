import { getApp, getApps, initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from "@firebase/storage";

import { getAuth, GoogleAuthProvider  } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_CONFIG_APPIKEY,
    authDomain: import.meta.env.VITE_FIREBASE_CONFIG_AUTH,
    projectId: import.meta.env.VITE_FIREBASE_CONFIG_PROJECTID,
    storageBucket: import.meta.env.VITE_FIREBASE_CONFIG_STORAGE,
    messagingSenderId: import.meta.env.VITE_FIREBASE_CONFIG_MESSAGINGID,
    appId: import.meta.env.VITE_FIREBASE_CONFIG_APPID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

const db = getFirestore(app)
const storage = getStorage(app, import.meta.env.VITE_FIREBASE_CONFIG_STORAGEURL);
const auth = getAuth(app)

const googleProvider = new GoogleAuthProvider()

export {db, storage, auth, googleProvider}