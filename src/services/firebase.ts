import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, initializeFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

export const firebaseConfig = {
  projectId: "gen-lang-client-0706059584",
  appId: "1:816300505970:web:d54ca0f7b994018787fbeb",
  apiKey: "AIzaSyB9PBWxnejrvx4yI3-sN31R1N9qRU0aFoU",
  authDomain: "gen-lang-client-0706059584.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-tableqrdigitalme-ef6d826c-a620-4caa-aa55-95f53285b6db",
  storageBucket: "gen-lang-client-0706059584.firebasestorage.app",
  messagingSenderId: "816300505970",
  measurementId: "",
  oAuthClientId: "816300505970-a890p6sdcv7fr9eht7ct9a9rgkvp7jhs.apps.googleusercontent.com",
  recaptchaSiteKey: ""
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
