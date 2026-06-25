import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyDe1KN7GgOU3OTwCzYS5Qqj3VLviuwfE9M',
  authDomain: 'meal-squard-be10b.firebaseapp.com',
  projectId: 'meal-squard-be10b',
  storageBucket: 'meal-squard-be10b.firebasestorage.app',
  messagingSenderId: '103476182133',
  appId: '1:103476182133:web:b43ad8f2e49269be790c3c',
  measurementId: 'G-9Q5JZDFMRS'
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)
