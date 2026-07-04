import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase
// Las credenciales se obtienen EXCLUSIVAMENTE de variables de entorno (VITE_FIREBASE_*).
// En desarrollo: creá un archivo .env en la raíz con los valores reales (ver .env.example).
// En CI/CD (GitHub Actions): se inyectan via GitHub Secrets en el workflow.
// Sin estas variables, la app muestra un error en consola y Firebase no se inicializa.
const requiredVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const missing = requiredVars.filter(v => !import.meta.env[v]);
if (missing.length > 0) {
  console.error(
    `❌ Firebase no configurado. Variables faltantes: ${missing.join(', ')}\n` +
    'Creá un archivo .env basado en .env.example con las credenciales de tu proyecto Firebase.'
  );
  throw new Error('Firebase configuración incompleta');
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
