// Importo Navigate para forzar redirección automática desde la lógica del componente
import { Navigate } from 'react-router-dom';
// Importo Spinner de React-Bootstrap para mostrar mientras Firebase verifica la sesión
import { Spinner } from 'react-bootstrap';

// Importo mi custom hook para poder consultar el estado global de la sesión
import { useAuth } from '../../context/AuthContext';

// Creo el componente ProtectedRoute.
// Recibe "children" por props, que representa al componente que quiero proteger.
// Ahora también maneja el estado "loading" de Firebase Auth para evitar el FOUC.
const ProtectedRoute = ({ children }) => {
  // Extraigo tanto isAuthenticated como loading del contexto
  const { isAuthenticated, loading } = useAuth();

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

  // Si el usuario NO está autenticado, lo redirijo al inicio
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si pasó ambas validaciones, renderizo el contenido protegido
  return children;
};

export default ProtectedRoute;
