import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layouts/Layout';
import Home from './pages/Home';
import Contacto from './pages/Contacto';
import ItemListContainer from './components/products/ItemListContainer';
import ItemDetailContainer from './components/detail/ItemDetailContainer';
import AdminRoute from './components/auth/AdminRoute';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter basename="/tp-final">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="productos" element={<ItemListContainer />} />
              <Route path="producto/:id" element={<ItemDetailContainer />} />
              <Route path="contacto" element={<Contacto />} />
              <Route path="carrito" element={<Cart />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
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
