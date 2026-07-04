import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Nav from './Nav';
import Footer from './Footer';
import estilos from './Layout.module.css';
import logo from '../../assets/logo.png';

const Layout = () => {
  const [searchTerm, setSearchTerm] = useState('');

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
