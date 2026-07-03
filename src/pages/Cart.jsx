// Importo styled-components para escribir CSS directamente dentro del componente
import styled from 'styled-components';
// Importo mi hook personalizado para acceder al estado global del carrito
import { useCart } from '../context/CartContext';
// Importo Link de React Router para poder navegar entre páginas sin recargar el navegador
import { Link } from 'react-router-dom';
// Importo Helmet para SEO dinámico
import { Helmet } from 'react-helmet-async';
// Importo React Icons para los botones de interacción
import { FaPlus, FaMinus, FaTrashCan, FaCartShopping } from 'react-icons/fa6';

// --- Styled Components ---

// CartContainer: envoltura principal, centrada y con ancho máximo.
const CartContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
`;

// CartItem: tarjeta individual de producto en el carrito.
// En mobile (<768px) apila los elementos verticalmente.
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

// ItemImage: miniatura del producto.
const ItemImage = styled.img`
  width: 70px;
  height: 70px;
  object-fit: contain;
`;

// ItemInfo: bloque de información textual del producto (título, precio, subtotal).
const ItemInfo = styled.div`
  flex: 1;
  margin-left: 1.5rem;

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
  }
`;

// Controls: grupo de botones para aumentar/disminuir cantidad.
const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// SummarySection: pie del carrito con acciones globales y totales.
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

// Botón de checkout, más grande y con estilo destacado.
const CheckoutButton = styled(StyledButton)`
  padding: 12px 25px;
  font-size: 1.2rem;
  font-weight: bold;
`;

// --- Componente Cart ---

const Cart = () => {
  // Extraigo del contexto el array con los productos y todas las funciones que creé para manipularlos
  const { cart, increaseQuantity, decreaseQuantity, removeItem, clearCart } = useCart();

  // Calculo el precio total acumulado de todo el carrito. 
  // Uso el método reduce() para iterar sobre cada ítem, multiplicando su precio por la cantidad, 
  // y lo voy sumando al acumulador (acc) que arranca en 0.
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

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
      <h2>Tu Carrito (Ruta Protegida)</h2>
      
      {/* Contenedor de la lista de productos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
        
        {/* Itero sobre el array del carrito usando map() para renderizar una tarjeta por cada producto.
            Es obligatorio pasarle la prop "key" (uso el id del ítem) para que React pueda rastrear los cambios de forma eficiente. */}
        {cart.map(item => (
          <CartItem key={item.id}>
            {/* Imagen miniatura del producto */}
            <ItemImage src={item.image} alt={item.title} />
            
            {/* Sección de información: Título cortado para no desarmar el diseño, precio unitario y el subtotal de ese ítem en particular */}
            <ItemInfo>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{item.title.substring(0, 45)}...</h4>
              <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Precio unitario: ${item.price}</p>
              <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', color: '#333' }}>
                Subtotal: ${(item.price * item.quantity).toFixed(2)}
              </p>
            </ItemInfo>

            {/* Controles interactivos para modificar la cantidad que me llevo de este producto */}
            <Controls>
              {/* Botón de restar */}
              <StyledButton 
                $variant="primary"
                $size="sm"
                onClick={() => decreaseQuantity(item.id)} 
                disabled={item.quantity <= 1}
              >
                <FaMinus />
              </StyledButton>
              
              {/* Muestro la cantidad actual del ítem */}
              <span style={{ minWidth: '25px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>
                {item.quantity}
              </span>
              
              {/* Botón de sumar */}
              <StyledButton 
                $variant="primary"
                $size="sm"
                onClick={() => increaseQuantity(item.id)}
              >
                <FaPlus />
              </StyledButton>
            </Controls>

            {/* Botón para eliminar definitivamente este producto del carrito */}
            <StyledButton 
              $variant="danger"
              onClick={() => removeItem(item.id)}
            >
              <FaTrashCan className="me-1" />Eliminar
            </StyledButton>
          </CartItem>
        ))}
      </div>

      {/* Footer del Carrito: Zona de acciones generales y totales */}
      <SummarySection>
        
        {/* Botón de pánico para limpiar todo el estado del carrito de una sola vez */}
        <StyledButton $variant="secondary" onClick={clearCart}>
          <FaTrashCan className="me-1" />Vaciar Carrito
        </StyledButton>
        
        {/* Resumen del total y botón de pago (checkout) */}
        <div>
          <h3 style={{ fontSize: '1.5rem', margin: '0 0 10px 0' }}>
            Total a Pagar: <span style={{ color: '#28a745' }}>${totalPrice.toFixed(2)}</span>
          </h3>
          <CheckoutButton $variant="success">
            <FaCartShopping className="me-2" />Finalizar Compra
          </CheckoutButton>
        </div>
      </SummarySection>
    </CartContainer>
  );
};

export default Cart;