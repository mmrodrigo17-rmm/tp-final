import styled from 'styled-components';
import { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaPlus, FaMinus, FaTrashCan, FaCartShopping, FaCircleCheck } from 'react-icons/fa6';
import { Spinner, Alert, Table } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { createTransaction } from '../services/checkoutService';
import { db } from '../firebase/config';

// --- Styled Components ---

const CartContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
`;

// CartItem: en mobile (<768px) apila verticalmente.
const CartItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
  background: #fff;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ItemImage = styled.img`
  width: 70px;
  height: 70px;
  object-fit: contain;
`;

const ItemInfo = styled.div`
  flex: 1;
  margin-left: 1.5rem;

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// SummarySection: pie del carrito con total y checkout
const SummarySection = styled.div`
  border-top: 2px solid #222;
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
    text-align: center;
  }
`;

// Botón estilizado reutilizable con variante de color.
const StyledButton = styled.button`
  padding: ${({ $size }) => $size === 'sm' ? '5px 12px' : '10px 20px'};
  font-size: ${({ $size }) => $size === 'sm' ? '1.1rem' : '1rem'};
  background: ${({ $variant }) =>
    $variant === 'danger' ? '#dc3545' :
    $variant === 'success' ? '#28a745' :
    $variant === 'secondary' ? '#6c757d' :
    $variant === 'primary' ? '#007bff' : '#007bff'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ disabled }) => disabled ? 0.6 : 1};
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  transition: opacity 0.2s ease;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

// CheckoutButton: más grande y destacado
const CheckoutButton = styled(StyledButton)`
  padding: 12px 25px;
  font-size: 1.2rem;
  font-weight: bold;
`;

// --- Confirmación de orden ---

const ConfirmationContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  text-align: center;
`;

const ConfirmationIcon = styled.div`
  font-size: 4rem;
  color: #28a745;
  margin-bottom: 1rem;
`;

const ConfirmationTitle = styled.h2`
  color: #28a745;
  margin-bottom: 0.5rem;
`;

const ConfirmationSubtitle = styled.p`
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 2rem;
`;

const OrderDetails = styled.div`
  text-align: left;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  background: #fff;
  margin-bottom: 2rem;
`;

const OrderTotal = styled.div`
  text-align: right;
  font-size: 1.3rem;
  font-weight: bold;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #ddd;
`;

// --- Componente ---

const Cart = () => {
  const { cart, increaseQuantity, decreaseQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuth();

  const navigate = useNavigate();

  const [checkingOut, setCheckingOut] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [orderComplete, setOrderComplete] = useState(null);

  const totalPrice = useMemo(
    () => cart.reduce((acc, item) => acc + (item.price * item.quantity), 0),
    [cart]
  );

  // Si no hay sesión, redirige al login
  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setCheckingOut(true);
    setErrorMsg(null);

    // Copia del carrito para confirmación antes de limpiar
    const purchasedItems = [...cart];
    const purchasedTotal = totalPrice;

    try {
      await createTransaction(db, user.uid, user.email, cart, totalPrice);
      clearCart();
      setOrderComplete({ items: purchasedItems, total: purchasedTotal });
    } catch (err) {
      setErrorMsg(err.message || 'Error al procesar la compra. Intentá de nuevo.');
    } finally {
      setCheckingOut(false);
    }
  };

  // --- Vista de orden completada ---
  if (orderComplete) {
    return (
      <ConfirmationContainer>
        <Helmet>
          <title>¡Compra realizada! — Mi Tienda</title>
        </Helmet>
        <ConfirmationIcon>
          <FaCircleCheck />
        </ConfirmationIcon>
        <ConfirmationTitle>¡Gracias por tu compra!</ConfirmationTitle>
        <ConfirmationSubtitle>
          Tu pedido fue registrado con éxito. Acá están los detalles:
        </ConfirmationSubtitle>

        <OrderDetails>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio Unit.</th>
                <th>Cant.</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {orderComplete.items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{ width: 40, height: 40, objectFit: 'contain' }}
                      />
                      <span>{item.title.substring(0, 40)}...</span>
                    </div>
                  </td>
                  <td>${item.price}</td>
                  <td>{item.quantity}</td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <OrderTotal>
            Total: <span style={{ color: '#28a745' }}>${orderComplete.total.toFixed(2)}</span>
          </OrderTotal>
        </OrderDetails>

        <Link to="/productos">
          <StyledButton $variant="primary" style={{ padding: '12px 30px', fontSize: '1.1rem' }}>
            <FaCartShopping className="me-2" />Seguir comprando
          </StyledButton>
        </Link>
      </ConfirmationContainer>
    );
  }

  // Verifico si el carrito está vacío. 
  // Si es así, corto la ejecución (early return) y devuelvo una vista amigable 
  // invitando al usuario a volver al catálogo para seguir comprando.
  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <Helmet>
          <title>Carrito — Mi Tienda</title>
          <meta name="description" content="Tu carrito de compras en Mi Tienda" />
        </Helmet>
        <h2>Tu carrito está vacío</h2>
        <p>¡Date una vuelta por el catálogo para agregar tus productos favoritos!</p>
        <Link to="/productos">
          <StyledButton $variant="primary" style={{ marginTop: '1rem' }}>
            <FaCartShopping className="me-1" />Ir a la tienda
          </StyledButton>
        </Link>
      </div>
    );
  }

  // Si el carrito tiene al menos un producto, renderizo la vista principal
  return (
    <CartContainer>
      <Helmet>
        <title>Carrito — Mi Tienda</title>
        <meta name="description" content="Tu carrito de compras en Mi Tienda" />
      </Helmet>
      <h2>Tu Carrito</h2>
      
      {/* Lista de productos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
        
        {cart.map(item => (
          <CartItem key={item.id}>
            <ItemImage src={item.image} alt={item.title} />
            
            <ItemInfo>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{item.title.substring(0, 45)}...</h4>
              <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Precio unitario: ${item.price}</p>
              <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', color: '#333' }}>
                Subtotal: ${(item.price * item.quantity).toFixed(2)}
              </p>
            </ItemInfo>

            <Controls>
              <StyledButton 
                $variant="primary"
                $size="sm"
                onClick={() => decreaseQuantity(item.id)} 
                disabled={item.quantity <= 1}
              >
                <FaMinus />
              </StyledButton>
              
              <span style={{ minWidth: '25px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>
                {item.quantity}
              </span>
              
              <StyledButton 
                $variant="primary"
                $size="sm"
                onClick={() => increaseQuantity(item.id)}
              >
                <FaPlus />
              </StyledButton>
            </Controls>

            <StyledButton 
              $variant="danger"
              onClick={() => removeItem(item.id)}
            >
              <FaTrashCan className="me-1" />Eliminar
            </StyledButton>
          </CartItem>
        ))}
      </div>

      <SummarySection>
        
        <StyledButton $variant="secondary" onClick={clearCart}>
          <FaTrashCan className="me-1" />Vaciar Carrito
        </StyledButton>
        
        <div>
          <h3 style={{ fontSize: '1.5rem', margin: '0 0 10px 0' }}>
            Total a Pagar: <span style={{ color: '#28a745' }}>${totalPrice.toFixed(2)}</span>
          </h3>

          {/* Feedback de checkout */}
          {errorMsg && (
            <Alert variant="danger" dismissible onClose={() => setErrorMsg(null)}>
              {errorMsg}
            </Alert>
          )}

          <CheckoutButton
            $variant="success"
            onClick={handleCheckout}
            disabled={checkingOut}
          >
            {checkingOut ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Procesando...
              </>
            ) : (
              <>
                <FaCartShopping className="me-2" />Finalizar Compra
              </>
            )}
          </CheckoutButton>
        </div>
      </SummarySection>
    </CartContainer>
  );
};

export default Cart;