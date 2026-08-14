import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, initializeFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import firebaseAppletConfig from '../../firebase-applet-config.json';

export const firebaseConfig = {
  apiKey: firebaseAppletConfig.apiKey || "AIzaSyCrbqEu1GhFj92d3KXVhZ7PfPhV53fjGRs",
  authDomain: firebaseAppletConfig.authDomain || "gen-lang-client-0627433321.firebaseapp.com",
  projectId: firebaseAppletConfig.projectId || "gen-lang-client-0627433321",
  storageBucket: firebaseAppletConfig.storageBucket || "gen-lang-client-0627433321.firebasestorage.app",
  messagingSenderId: firebaseAppletConfig.messagingSenderId || "767560190946",
  appId: firebaseAppletConfig.appId || "1:767560190946:web:54afb1ea6d750d5eba07bb",
  firestoreDatabaseId: firebaseAppletConfig.firestoreDatabaseId || "ai-studio-smartmenu-4f5e8576-b16c-4662-961b-48e1f3794c26"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let firestoreInstance: Firestore;
try {
  if (firebaseConfig.firestoreDatabaseId) {
    firestoreInstance = initializeFirestore(app, {}, firebaseConfig.firestoreDatabaseId);
  } else {
    firestoreInstance = getFirestore(app);
  }
} catch (e) {
  firestoreInstance = getFirestore(app);
}

export const db = firestoreInstance;
export const auth: Auth = getAuth(app);

