// Importo hooks de React
import { useState } from 'react';
// Importo mi hook personalizado para acceder al estado global del carrito
import { useCart } from '../context/CartContext';
// Importo Link de React Router para poder navegar entre páginas sin recargar el navegador
import { Link } from 'react-router-dom';
// Importo Helmet para SEO dinámico
import { Helmet } from 'react-helmet-async';
// Importo React Icons para los botones de interacción
import { FaPlus, FaMinus, FaTrashCan, FaCartShopping, FaCircleCheck } from 'react-icons/fa6';
// Importo contexto de autenticación
import { useAuth } from '../context/AuthContext';
// Importo servicio de checkout
import { createTransaction } from '../services/checkoutService';
// Importo configuración de Firebase
import { db } from '../firebase/config';

// --- Componente Cart ---

const Cart = () => {
  // Extraigo del contexto el array con los productos y todas las funciones que creé para manipularlos
  const { cart, increaseQuantity, decreaseQuantity, removeItem, clearCart } = useCart();

  // Obtengo el usuario autenticado para el checkout
  const { user } = useAuth();

  // Estado del proceso de checkout
  const [checkingOut, setCheckingOut] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [orderComplete, setOrderComplete] = useState(null);
  // orderComplete: { items: [...], total: number } o null

  // Calculo el precio total acumulado de todo el carrito. 
  // Uso el método reduce() para iterar sobre cada ítem, multiplicando su precio por la cantidad, 
  // y lo voy sumando al acumulador (acc) que arranca en 0.
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Manejador del checkout: guarda los items, crea la transacción y muestra la confirmación
  const handleCheckout = async () => {
    setCheckingOut(true);
    setErrorMsg(null);

    // Guardo una copia del carrito antes de limpiarlo para mostrar en la confirmación
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
      <div className="max-w-3xl mx-auto p-4 text-center">
        <Helmet>
          <title>¡Compra realizada! — Mi Tienda</title>
        </Helmet>

        <div className="text-6xl text-success mb-4">
          <FaCircleCheck />
        </div>

        <h2 className="text-2xl text-success mb-2">¡Gracias por tu compra!</h2>
        <p className="text-base-content/60 text-lg mb-8">
          Tu pedido fue registrado con éxito. Acá están los detalles:
        </p>

        <div className="text-left border border-base-300 rounded-lg p-6 bg-base-100 mb-8">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
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
                      <div className="flex items-center gap-2">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-10 h-10 object-contain"
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
            </table>
          </div>
          <div className="text-right text-xl font-bold mt-4 pt-4 border-t border-base-300">
            Total: <span className="text-success">${orderComplete.total.toFixed(2)}</span>
          </div>
        </div>

        <Link to="/productos" className="btn btn-primary px-6 py-3 text-lg gap-2">
          <FaCartShopping />Seguir comprando
        </Link>
      </div>
    );
  }

  // Verifico si el carrito está vacío. 
  // Si es así, corto la ejecución (early return) y devuelvo una vista amigable 
  // invitando al usuario a volver al catálogo para seguir comprando.
  if (cart.length === 0) {
    return (
      <div className="text-center py-12">
        <Helmet>
          <title>Carrito — Mi Tienda</title>
          <meta name="description" content="Tu carrito de compras en Mi Tienda" />
        </Helmet>
        <h2 className="text-2xl font-bold mb-2">Tu carrito está vacío</h2>
        <p className="text-base-content/60 mb-4">¡Date una vuelta por el catálogo para agregar tus productos favoritos!</p>
        <Link to="/productos" className="btn btn-primary mt-2">
          <FaCartShopping className="me-1" />Ir a la tienda
        </Link>
      </div>
    );
  }

  // Si el carrito tiene al menos un producto, renderizo la vista principal
  return (
    <div className="max-w-3xl mx-auto p-4">
      <Helmet>
        <title>Carrito — Mi Tienda</title>
        <meta name="description" content="Tu carrito de compras en Mi Tienda" />
      </Helmet>
      <h2 className="text-2xl font-bold mb-4">Tu Carrito</h2>
      
      {/* Contenedor de la lista de productos */}
      <div className="flex flex-col gap-4 mt-6">
        
        {/* Itero sobre el array del carrito usando map() para renderizar una tarjeta por cada producto.
            Es obligatorio pasarle la prop "key" (uso el id del ítem) para que React pueda rastrear los cambios de forma eficiente. */}
        {cart.map(item => (
          <div key={item.id} className="flex flex-col md:flex-row items-start md:items-center justify-between border border-base-300 p-4 rounded-lg bg-base-100 gap-4">
            {/* Imagen miniatura del producto */}
            <img src={item.image} alt={item.title} className="w-[70px] h-[70px] object-contain" />
            
            {/* Sección de información: Título cortado para no desarmar el diseño, precio unitario y el subtotal de ese ítem en particular */}
            <div className="flex-1 md:ml-6 w-full">
              <h4 className="text-lg font-medium mb-1">{item.title.substring(0, 45)}...</h4>
              <p className="text-sm text-base-content/60">Precio unitario: ${item.price}</p>
              <p className="font-bold text-base-content mt-1">
                Subtotal: ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>

            {/* Controles interactivos para modificar la cantidad que me llevo de este producto */}
            <div className="flex items-center gap-2">
              {/* Botón de restar */}
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => decreaseQuantity(item.id)} 
                disabled={item.quantity <= 1}
              >
                <FaMinus />
              </button>
              
              {/* Muestro la cantidad actual del ítem */}
              <span className="min-w-[25px] text-center font-bold text-lg">
                {item.quantity}
              </span>
              
              {/* Botón de sumar */}
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => increaseQuantity(item.id)}
              >
                <FaPlus />
              </button>
            </div>

            {/* Botón para eliminar definitivamente este producto del carrito */}
            <button 
              className="btn btn-error gap-2"
              onClick={() => removeItem(item.id)}
            >
              <FaTrashCan />Eliminar
            </button>
          </div>
        ))}
      </div>

      {/* Footer del Carrito: Zona de acciones generales y totales */}
      <div className="border-t-2 border-base-content mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        
        {/* Botón de pánico para limpiar todo el estado del carrito de una sola vez */}
        <button className="btn btn-ghost gap-2" onClick={clearCart}>
          <FaTrashCan />Vaciar Carrito
        </button>
        
        {/* Resumen del total y botón de pago (checkout) */}
        <div className="text-center sm:text-right">
          <h3 className="text-xl font-bold mb-2">
            Total a Pagar: <span className="text-success">${totalPrice.toFixed(2)}</span>
          </h3>

          {/* Feedback de checkout */}
          {errorMsg && (
            <div className="alert alert-error mb-2">
              <span>{errorMsg}</span>
              <button className="btn btn-ghost btn-xs" onClick={() => setErrorMsg(null)}>✕</button>
            </div>
          )}

          <button
            className="btn btn-success text-lg font-bold px-6 py-3 gap-2"
            onClick={handleCheckout}
            disabled={checkingOut}
          >
            {checkingOut ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Procesando...
              </>
            ) : (
              <>
                <FaCartShopping />Finalizar Compra
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
