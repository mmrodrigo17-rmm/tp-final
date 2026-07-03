// Importo el hook de estado de React para manejar el término de búsqueda
import { useState } from 'react';
// Importo Outlet de react-router-dom. Esta es la pieza clave (el comodín) 
// que me permite armar layouts con rutas anidadas. También uso Outlet con context
// para pasar el searchTerm a los componentes hijos renderizados en las rutas.
import { Outlet } from 'react-router-dom';
// Importo Container, Row, Col de React-Bootstrap para estructurar el layout principal
import { Container, Row, Col } from 'react-bootstrap';
// Importo mis componentes visuales que quiero mantener constantes en toda la navegación
import Nav from './Nav';
import Footer from './Footer';

const Layout = () => {
  // Estado global para el término de búsqueda. Se lo paso al Nav (para el input)
  // y a ItemListContainer (para filtrar) a través del context de Outlet.
  const [searchTerm, setSearchTerm] = useState('');

  return (
    // Envuelvo toda la estructura en un div contenedor maestro.
    // Uso Flexbox en columna y le doy una altura mínima del 100% del alto de la ventana gráfica (100vh).
    // Este es el truco clásico (y más efectivo) en CSS para garantizar que el Footer 
    // siempre se quede pegado abajo de la pantalla, incluso si la página tiene muy poco contenido.
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* Defino el encabezado de mi sitio. 
          Este bloque se mantendrá estático y visible sin importar por qué ruta navegue el usuario. */}
      <header style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <h1>Mi Tienda Monumental</h1>
        {/* Renderizo mi barra de navegación pasándole el estado de búsqueda */}
        <Nav searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </header>
      
      {/* Etiqueta semántica <main> para el contenido principal. 
          La propiedad "flex: 1" le dice a este contenedor que crezca y ocupe todo el espacio 
          vertical disponible, empujando de forma automática al Footer hacia el fondo. */}
      <main style={{ flex: 1, padding: '2rem' }}>
        {/* Envuelvo el Outlet con un Container fluid de React-Bootstrap.
            Esto le da un padding consistente y responsivo a todo el contenido.
            Uso Row > Col para mantener la estructura de grilla de Bootstrap. */}
        <Container fluid>
          <Row>
            <Col>
              {/* Aquí es donde ocurre la magia del Layout anidado de React Router. 
                  El componente <Outlet /> actúa como un "marcador de posición" (un agujero).
                  Dependiendo de la URL en la que esté el usuario (ej: "/productos" o "/carrito"), 
                  React Router tomará el componente hijo correspondiente y lo inyectará exactamente aquí.
                  
                  Paso el searchTerm y setSearchTerm a través del context para que los componentes
                  hijos (como ItemListContainer) puedan leer el término de búsqueda. */}
              <Outlet context={{ searchTerm, setSearchTerm }} />
            </Col>
          </Row>
        </Container>
      </main>

      {/* Finalmente, agrego el Footer al fondo de la estructura. 
          Al igual que el header, estará presente en todas las vistas de la app. */}
      <Footer />
      
    </div>
  );
};

export default Layout;