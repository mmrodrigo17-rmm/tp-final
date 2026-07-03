// Importo NavLink de react-router-dom. A diferencia del Link normal, NavLink me permite 
// saber si la ruta actual está activa (si el usuario está en esa página) para aplicarle estilos.
import { NavLink } from 'react-router-dom';
// Importo componentes de React-Bootstrap para armar la barra de navegación responsiva
import { Navbar, Nav as NavBs, Button } from 'react-bootstrap';
// Importo iconos de React Icons para mejorar la interfaz visual
import { FaCartShopping, FaMagnifyingGlass } from 'react-icons/fa6';
// Importo mis custom hooks para poder leer el estado global del carrito y de la sesión del usuario.
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
// Importo los estilos usando CSS Modules. Esto asegura que estas clases 
// solo afecten a este componente y no rompan los estilos en otras partes de la app.
import styles from './Nav.module.css';

const Nav = ({ searchTerm, setSearchTerm }) => {
  // Extraigo el array de productos del contexto del carrito
  const { cart } = useCart();
  
  // Extraigo los datos de autenticación del contexto: usuario, estado de admin y función de cierre de sesión
  const { user, isAuthenticated, isAdmin, logout } = useAuth(); 

  // Calculo la cantidad total de artículos en el carrito para mostrar en la burbuja/contador.
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    logout();
  };

  return (
    <Navbar collapseOnSelect expand="lg" bg="light" variant="light" className="rounded" style={{ padding: '0.5rem 0' }}>
      
      {/* Botón de hamburguesa: solo se muestra en pantallas menores a lg (992px) */}
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      
      {/* Contenido colapsable: se expande como menú horizontal en desktop, 
          y se pliega detrás del botón hamburguesa en mobile */}
      <Navbar.Collapse id="responsive-navbar-nav">
        
        {/* Links de navegación principales: se alinean a la izquierda (me-auto) */}
        <NavBs className="me-auto mb-2 mb-lg-0">
          
          {/* Uso el parámetro "as" de Bootstrap para que <Nav.Link> renderice 
              un <NavLink> de React Router en lugar de un <a> genérico.
              Así mantengo el ruteo interno sin recargar la página. */}
          <Nav.Link as={NavLink} to="/" end>
            Inicio
          </Nav.Link>
          <Nav.Link as={NavLink} to="/productos">
            Productos
          </Nav.Link>
          <Nav.Link as={NavLink} to="/carrito">
            {/* Icono de carrito de compras con contador de artículos */}
            <FaCartShopping className="me-1" />
            Carrito
            {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
          </Nav.Link>
          
          {/* Link al panel de administración — solo visible para usuarios admin */}
          {isAdmin && (
            <Nav.Link as={NavLink} to="/dashboard">
              Panel Admin
            </Nav.Link>
          )}
        </NavBs>
        
        {/* Buscador de productos con icono de lupa */}
        <div className={styles.searchWrapper}>
          <FaMagnifyingGlass className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* Sección de autenticación: se alinea a la derecha */}
        <NavBs className="ms-2">
          {isAuthenticated ? (
            // Muestro el email del usuario logueado y el botón para cerrar sesión
            <>
              <Navbar.Text className="d-none d-lg-inline">
                {user?.email}
              </Navbar.Text>
              <Button variant="outline-secondary" size="sm" onClick={handleLogout} className="ms-lg-2 mt-2 mt-lg-0">
                Cerrar Sesión
              </Button>
            </>
          ) : (
            // Muestro enlaces a las páginas de login y registro
            <>
              <Nav.Link as={NavLink} to="/login">
                Iniciar Sesión
              </Nav.Link>
              <Nav.Link as={NavLink} to="/register">
                Registrarse
              </Nav.Link>
            </>
          )}
        </NavBs>
        
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Nav;
