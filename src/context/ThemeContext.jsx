import { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

const STORAGE_KEY = 'mi-tienda-theme';

/**
 * Obtiene el tema inicial desde localStorage o 'system' por defecto.
 */
const getInitialTheme = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // localStorage no disponible (entorno de pruebas)
  }
  return 'system';
};

/**
 * Resuelve el tema efectivo: 'system' → prefiere el del sistema.
 */
const resolveTheme = (theme) => {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return theme;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  const applyTheme = (effectiveTheme) => {
    document.documentElement.setAttribute('data-theme', effectiveTheme);
  };

  // Aplica el tema al montar y cuando cambia la preferencia del sistema
  useEffect(() => {
    const effective = resolveTheme(theme);
    applyTheme(effective);

    // Escucha cambios en la preferencia del sistema (solo si es 'system')
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => {
        applyTheme(resolveTheme('system'));
      };
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [theme]);

  // Persiste la elección
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignorar
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  };

  const effectiveTheme = resolveTheme(theme);

  const iconTheme = effectiveTheme === 'dark' ? 'light' : 'dark';

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, toggleTheme, iconTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de un ThemeProvider');
  }
  return context;
};
