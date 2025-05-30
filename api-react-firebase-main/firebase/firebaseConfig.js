import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAZwWEOzx_Kvix8pTyTbzy4Jvev4ZmTf2k",
  authDomain: "pokeapi2-69880.firebaseapp.com",
  projectId: "pokeapi2-69880",
  storageBucket: "pokeapi2-69880.firebasestorage.app",
  messagingSenderId: "458860512410",
  appId: "1:458860512410:web:0f4a21c005da0b711d8b23"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // ✅ ¡Esto es necesario!

export { auth, db };
