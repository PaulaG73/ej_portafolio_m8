import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY || 'REPLACE_ME',
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN || 'REPLACE_ME',
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID || 'REPLACE_ME',
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET || 'REPLACE_ME',
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID || 'REPLACE_ME',
  appId: process.env.VUE_APP_FIREBASE_APP_ID || 'REPLACE_ME'
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

