/* eslint-disable react-refresh/only-export-components */
// Deshabilito temporalmente esta regla de Vite. Al igual que en CartContext, esto me permite 
// exportar mi Provider y mi custom hook desde el mismo archivo sin que falle el Fast Refresh.

// Importo las herramientas necesarias de React para crear y consumir el contexto
import { createContext, useState, useEffect, useContext } from 'react';
// Importo las funciones de Firebase Auth que voy a usar
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
// Importo la instancia de auth ya inicializada desde mi archivo de configuración de Firebase
import { auth } from '../firebase/config';

// 1. Creo el contexto de autenticación. Este será el "canal de comunicación"
// para saber en toda la app si el usuario ha iniciado sesión o no.
const AuthContext = createContext();

// 2. Creo el componente AuthProvider que envolverá mi aplicación (o parte de ella)
export const AuthProvider = ({ children }) => {
  // Estado para almacenar el objeto de usuario de Firebase (null cuando no hay sesión)
  const [user, setUser] = useState(null);
  // Estado de carga: arranca en true porque onAuthStateChanged es ASYNC.
  // Mientras loading sea true, NO renderizamos rutas protegidas para evitar FOUC.
  const [loading, setLoading] = useState(true);

  // Efecto que se ejecuta UNA SOLA VEZ al montar el provider.
  // onAuthStateChanged se suscribe a los cambios de sesión de Firebase Auth.
  // - Si hay sesión activa (incluso al recargar la página), currentUser viene con los datos.
  // - Si no hay sesión, currentUser es null.
  // - La función unsubscribe se ejecuta al desmontar el provider (limpieza).
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // <-- crucial: recién acá dejamos de cargar
    });
    return unsubscribe;
  }, []);

  // Propiedades derivadas del estado de usuario
  const isAuthenticated = !!user;
  // Por ahora, el admin se determina por email fijo. En el futuro se puede migrar a custom claims.
  const isAdmin = user?.email === 'admin@gmail.com';

  // Función para iniciar sesión con email y contraseña
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Función para registrar un nuevo usuario
  const register = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Función para cerrar sesión
  const logout = () => {
    return signOut(auth);
  };

  return (
    // Proveo a los componentes hijos el estado actual y todas las funciones.
    // Incluyo loading para que los componentes puedan mostrar un spinner mientras Firebase verifica la sesión.
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isAdmin,
      loading,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Creo y exporto mi Custom Hook llamado useAuth.
// Esto me facilita la vida: en lugar de importar useContext y AuthContext en cada vista,
// simplemente llamaré a const { isAuthenticated, user, login } = useAuth() de forma limpia.
export const useAuth = () => {
  const context = useContext(AuthContext);

  // Validación de seguridad para otros desarrolladores (o para mi yo del futuro): 
  // si se intenta usar este hook fuera del árbol envuelto por <AuthProvider>, 
  // lanzo un error explicativo en consola en lugar de un fallo silencioso.
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }

  return context;
};
