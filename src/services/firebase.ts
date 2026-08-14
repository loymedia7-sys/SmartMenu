import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, initializeFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyCrbqEu1GhFj92d3KXVhZ7PfPhV53fjGRs",
  authDomain: "gen-lang-client-0627433321.firebaseapp.com",
  projectId: "gen-lang-client-0627433321",
  storageBucket: "gen-lang-client-0627433321.firebasestorage.app",
  messagingSenderId: "767560190946",
  appId: "1:767560190946:web:54afb1ea6d750d5eba07bb",
  firestoreDatabaseId: ""
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
  // If already initialized
  firestoreInstance = getFirestore(app);
}

export const db = firestoreInstance;
export const auth: Auth = getAuth(app);
