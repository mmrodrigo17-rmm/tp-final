import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Nav from './Nav';
import Footer from './Footer';

const Layout = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    // Flexbox en columna con min-height para que el footer se pegue al fondo
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <h1>Mi Tienda Monumental</h1>
        <Nav searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </header>

      <main style={{ flex: 1, padding: '2rem' }}>
        <Container fluid>
          <Outlet context={{ searchTerm, setSearchTerm }} />
        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
