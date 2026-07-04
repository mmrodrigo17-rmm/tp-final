import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Nav from './Nav';
import Footer from './Footer';
import estilos from './Layout.module.css';

const Layout = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className={estilos.wrapper}>
      <header className={estilos.header}>
        <h1 className={estilos.brand}>Mi Tienda Monumental</h1>
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
