/* eslint-disable react-refresh/only-export-components */
// Deshabilito la regla para exportar Provider + hook desde el mismo archivo

import { createContext, useState, useEffect, useContext } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { auth } from '../firebase/config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // loading evita FOUC: no renderizar rutas protegidas hasta que Firebase resuelva la sesión
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const isAuthenticated = !!user;
  // Admin determinado por variable de entorno. Si no está configurada, no hay admin.
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  const isAdmin = !!adminEmail && user?.email === adminEmail;

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const register = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  return (
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
