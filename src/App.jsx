import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Importo mis proveedores de contexto para manejar el estado global de la app
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
// Importo mis componentes y páginas
import Layout from './components/layouts/Layout';
import ItemListContainer from './components/products/ItemListContainer';
import ItemDetailContainer from './components/detail/ItemDetailContainer';
import AdminRoute from './components/auth/AdminRoute';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    // Envuelvo toda la aplicación con AuthProvider para que cualquier componente pueda saber si el usuario está logueado
    <AuthProvider>
      {/* Envuelvo también con CartProvider para que el carrito esté disponible en cualquier parte (ej: navbar, botones de compra) */}
      <CartProvider>
        {/* Inicio la configuración del ruteo usando BrowserRouter */}
        <BrowserRouter basename="/tp-final">
          <Routes>
            {/* Defino una ruta padre "/" que renderiza el Layout. 
                Esto me permite mantener el Header (con el Nav) y el Footer siempre visibles, 
                mientras el contenido cambia en el medio (gracias al componente <Outlet /> dentro de Layout). */}
            <Route path="/" element={<Layout />}>
              
              {/* Esta es la ruta por defecto (index) que carga cuando entro a la raíz de la web */}
              <Route index element={<ItemListContainer />} />
              
              {/* Ruta específica para ver todo el catálogo de productos */}
              <Route path="productos" element={<ItemListContainer />} />
              
              {/* Ruta dinámica para ver el detalle de un solo producto. 
                  Uso ":id" para capturar el identificador del producto en la URL */}
              <Route path="producto/:id" element={<ItemDetailContainer />} />
              
              {/* Ruta del carrito — visible sin login. Solo se exige auth al finalizar compra. */}
              <Route path="carrito" element={<Cart />} />

              {/* Ruta de inicio de sesión */}
              <Route path="login" element={<Login />} />

              {/* Ruta de registro de nuevo usuario */}
              <Route path="register" element={<Register />} />

              {/* Ruta del panel de administración. Solo accesible para usuarios con rol admin. */}
              <Route path="dashboard" element={
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              } />
              
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
