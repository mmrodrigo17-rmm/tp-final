import { NavLink } from 'react-router-dom';
import { Navbar, Nav as NavBs, Button } from 'react-bootstrap';
import { CartIcon, SearchIcon, SunIcon, MoonIcon } from '../../assets/icons';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import styles from './Nav.module.css';

const Nav = ({ searchTerm, setSearchTerm }) => {
  const { cart } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const themeLabel =
    theme === 'light' ? 'Modo oscuro' :
    theme === 'dark' ? 'Modo sistema' :
    'Modo claro';

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="light"
      variant="light"
      className="rounded"
      style={{ padding: '0.5rem 0' }}
    >
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <NavBs className="me-auto mb-2 mb-lg-0">
          <NavBs.Link as={NavLink} to="/" end>
            Inicio
          </NavBs.Link>
          <NavBs.Link as={NavLink} to="/productos">
            Productos
          </NavBs.Link>
          <NavBs.Link as={NavLink} to="/contacto">
            Contacto
          </NavBs.Link>
          <NavBs.Link as={NavLink} to="/carrito">
            <CartIcon size={18} className="me-1" />
            Carrito
            {totalItems > 0 && (
              <span className={styles.badge}>{totalItems}</span>
            )}
          </NavBs.Link>

          {isAdmin && (
            <NavBs.Link as={NavLink} to="/dashboard">
              Panel Admin
            </NavBs.Link>
          )}
        </NavBs>

        <div className={styles.searchWrapper}>
          <SearchIcon size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <Button
          variant="outline-secondary"
          size="sm"
          onClick={toggleTheme}
          className="ms-2"
          title={themeLabel}
          aria-label={themeLabel}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            background: 'var(--card-bg)',
          }}
        >
          {theme === 'light' ? <MoonIcon size={16} /> :
           theme === 'dark' ? <SunIcon size={16} /> :
           <><SunIcon size={14} /><MoonIcon size={14} /></>}
        </Button>

        <NavBs className="ms-2">
          {isAuthenticated ? (
            <>
              <Navbar.Text className="d-none d-lg-inline">
                {user?.email}
              </Navbar.Text>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={logout}
                className="ms-lg-2 mt-2 mt-lg-0"
              >
                Cerrar Sesión
              </Button>
            </>
          ) : (
            <>
              <NavBs.Link as={NavLink} to="/login">
                Iniciar Sesión
              </NavBs.Link>
              <NavBs.Link as={NavLink} to="/register">
                Registrarse
              </NavBs.Link>
            </>
          )}
        </NavBs>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Nav;
