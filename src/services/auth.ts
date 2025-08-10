// src/services/auth.ts

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    UserCredential,
} from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

// Inscription d'un nouvel utilisateur
export async function signUp(email: string, password: string): Promise<UserCredential> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    throw error;
  }
}

// Connexion utilisateur existant
export async function signIn(email: string, password: string): Promise<UserCredential> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    throw error;
  }
}

// Déconnexion
export async function logOut(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
}
