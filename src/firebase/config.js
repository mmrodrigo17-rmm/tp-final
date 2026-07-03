import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase
// Las credenciales se obtienen de variables de entorno (VITE_FIREBASE_*).
// En desarrollo: creá un archivo .env en la raíz con los valores reales.
// En CI/CD (GitHub Actions): se inyectan via GitHub Secrets.
// Si no hay variables de entorno, se usan los valores hardcodeados como fallback.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCOzxe5RrC3hnBTnFAff5ntUQYrWpoSvTA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "tp-final-19318.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "tp-final-19318",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "tp-final-19318.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "750193197085",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:750193197085:web:6d5bec9180b3ce8bdb86f4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
