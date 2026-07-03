import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase
// IMPORTANTE: Reemplazá estos valores con las credenciales de tu proyecto Firebase real.
// Podés obtenerlas desde Firebase Console → Project Settings → General → Your apps → Web app.
const firebaseConfig = {
  apiKey: "AIzaSyCOzxe5RrC3hnBTnFAff5ntUQYrWpoSvTA",
  authDomain: "tp-final-19318.firebaseapp.com",
  projectId: "tp-final-19318",
  storageBucket: "tp-final-19318.firebasestorage.app",
  messagingSenderId: "750193197085",
  appId: "1:750193197085:web:6d5bec9180b3ce8bdb86f4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
