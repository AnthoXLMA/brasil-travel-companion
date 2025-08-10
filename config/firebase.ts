import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // ← Ajoute ça

const firebaseConfig = {
  apiKey: "AIzaSyAftVkhjlH0aiTg4ciiJJaGj3ogX77hOi0",
  authDomain: "brasiltravelcompanion.firebaseapp.com",
  projectId: "brasiltravelcompanion",
  storageBucket: "brasiltravelcompanion.firebasestorage.app",
  messagingSenderId: "946693752688",
  appId: "1:946693752688:web:00b52730f955f3deccf1b5"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
