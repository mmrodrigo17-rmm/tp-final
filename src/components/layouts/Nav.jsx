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
  const { theme, effectiveTheme, toggleTheme } = useTheme();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Icono a mostrar: siempre el opuesto al tema efectivo actual
  const isDark = effectiveTheme === 'dark';
  const themeTooltip = theme === 'system'
    ? `Sigue al sistema (${isDark ? 'oscuro' : 'claro'}) — click para cambiar`
    : isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';

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

        <div className="d-flex align-items-center gap-1 ms-2">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={toggleTheme}
            title={themeTooltip}
            aria-label={themeTooltip}
            className="d-inline-flex align-items-center justify-content-center"
            style={{
              width: '36px',
              height: '36px',
              padding: 0,
              border: '1px solid var(--border)',
              color: 'var(--text)',
              background: 'var(--card-bg)',
            }}
          >
            {isDark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
          </Button>

          {theme === 'system' && (
            <small
              style={{
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                lineHeight: 1,
              }}
              title="Seguir sistema — click para fijar manual"
              onClick={toggleTheme}
            >
              Auto
            </small>
          )}
        </div>

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
