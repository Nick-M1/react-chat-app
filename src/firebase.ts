import { getApp, getApps, initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from "@firebase/storage";

import { getAuth, GoogleAuthProvider  } from "firebase/auth";
import {getMessaging} from "firebase/messaging/sw";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_CONFIG_APPIKEY,
    authDomain: import.meta.env.VITE_FIREBASE_CONFIG_AUTH,
    projectId: import.meta.env.VITE_FIREBASE_CONFIG_PROJECTID,
    storageBucket: import.meta.env.VITE_FIREBASE_CONFIG_STORAGE,
    messagingSenderId: import.meta.env.VITE_FIREBASE_CONFIG_MESSAGINGID,
    appId: import.meta.env.VITE_FIREBASE_CONFIG_APPID,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseApp)
const storage = getStorage(firebaseApp, import.meta.env.VITE_FIREBASE_CONFIG_STORAGEURL);
const messaging = getMessaging(firebaseApp);
const auth = getAuth(firebaseApp)

const googleProvider = new GoogleAuthProvider()

export {firebaseConfig, db, storage, messaging, auth, googleProvider}