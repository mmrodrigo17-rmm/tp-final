import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Nav from './Nav';
import Footer from './Footer';
import estilos from './Layout.module.css';
import logoSrc from '../../assets/logo.png';
import logoOscuroSrc from '../../assets/logo-oscuro.png';
import { useTheme } from '../../context/ThemeContext';

const Layout = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { effectiveTheme } = useTheme();
  const logo = effectiveTheme === 'dark' ? logoOscuroSrc : logoSrc;

  return (
    <div className={estilos.wrapper}>
      <header className={estilos.header}>
        <Link to="/" className={estilos.brandLink}>
          <img src={logo} alt="Mi Tienda Monumental" className={estilos.logo} />
          <span className={estilos.brandName}>Mi Tienda Monumental</span>
        </Link>
        <Nav searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </header>

      <main className={estilos.main}>
        <Outlet context={{ searchTerm, setSearchTerm }} />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
