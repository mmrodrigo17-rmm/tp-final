// Importo Navigate para forzar redirección automática desde la lógica del componente
import { Navigate } from 'react-router-dom';
// Importo Spinner de React-Bootstrap para mostrar mientras Firebase verifica la sesión
import { Spinner } from 'react-bootstrap';

// Importo mi custom hook para poder consultar el estado global de la sesión
import { useAuth } from '../../context/AuthContext';

// Creo el componente AdminRoute.
// Es un guardia de ruta que verifica TRES condiciones en orden:
// 1. Esperar a que Firebase termine de verificar la sesión (loading)
// 2. Que el usuario esté autenticado
// 3. Que el usuario sea administrador
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // MIENTRAS Firebase no termine de verificar la sesión, muestro un spinner
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  // Si el usuario NO está autenticado, lo redirijo al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si el usuario NO es admin, lo redirijo al inicio
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Si pasó todas las validaciones, renderizo el contenido protegido
  return children;
};

export default AdminRoute;
