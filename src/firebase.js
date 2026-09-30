// Collegamento a Firebase: accesso anonimo + database Firestore.
// Questa configurazione non è segreta (finisce comunque nel sito pubblico):
// a proteggere i dati sono le regole in firestore.rules.
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCLWNRX_oHD7tSOTCIcpqLsx4nNoN2bYUg',
  authDomain: 'undercover-9ab76.firebaseapp.com',
  projectId: 'undercover-9ab76',
  storageBucket: 'undercover-9ab76.firebasestorage.app',
  messagingSenderId: '33017929703',
  appId: '1:33017929703:web:3bf001dbffca2dd88ee742',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Cache sul dispositivo: senza rete si legge l'ultima copia e le scritture partono appena torna la connessione
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});

// Accesso anonimo: nessuna registrazione, ma solo chi usa l'app può scrivere
let signingIn = null;
export const ensureSignedIn = () => {
  if (auth.currentUser) return Promise.resolve(auth.currentUser);
  signingIn ??= new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        unsubscribe();
        resolve(user);
      } else {
        signInAnonymously(auth).catch((err) => {
          unsubscribe();
          signingIn = null;
          reject(err);
        });
      }
    });
  });
  return signingIn;
};
