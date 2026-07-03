import { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa6';

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'corporate';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'corporate' ? 'night' : 'corporate');
  };

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-ghost btn-circle"
      aria-label="Cambiar tema"
      title={theme === 'corporate' ? 'Modo oscuro' : 'Modo claro'}
    >
      {theme === 'corporate' ? (
        <FaMoon className="text-lg" />
      ) : (
        <FaSun className="text-lg" />
      )}
    </button>
  );
};

export default ThemeToggle;
