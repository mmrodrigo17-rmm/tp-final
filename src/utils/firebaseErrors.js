// Mapeo de códigos de error de Firebase Auth a mensajes en español rioplatense
// Combinados de login y register para tenerlos en un solo lugar.
const FIREBASE_ERROR_MESSAGES = {
  // Login
  'auth/invalid-email': 'El correo electrónico no es válido',
  'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
  'auth/user-not-found': 'No se encontró un usuario con ese correo',
  'auth/wrong-password': 'Contraseña incorrecta',
  'auth/invalid-credential': 'Credenciales inválidas. Verificá tu correo y contraseña',
  'auth/too-many-requests': 'Demasiados intentos. Probá de nuevo más tarde',
  // Register
  'auth/email-already-in-use': 'Este correo electrónico ya está registrado',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
  // Red
  'auth/network-request-failed': 'Error de conexión. Verificá tu internet',
};

export const getFirebaseErrorMessage = (error) => {
  return FIREBASE_ERROR_MESSAGES[error.code] || 'Ocurrió un error inesperado. Intentá de nuevo';
};
