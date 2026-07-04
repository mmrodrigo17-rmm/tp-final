import { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  PlusIcon,
  MinusIcon,
  TrashIcon,
  CartIcon,
  CheckIcon,
} from '../assets/icons';
import { Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { createTransaction } from '../services/checkoutService';
import { db } from '../firebase/config';
import estilos from './Cart.module.css';

const Cart = () => {
  const { cart, increaseQuantity, decreaseQuantity, removeItem, clearCart } =
    useCart();
  const { user } = useAuth();

  const navigate = useNavigate();

  const [checkingOut, setCheckingOut] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [orderComplete, setOrderComplete] = useState(null);

  const totalPrice = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart]
  );

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setCheckingOut(true);
    setErrorMsg(null);

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
      <div className={estilos.confirmation}>
        <Helmet>
          <title>¡Compra realizada! — Mi Tienda</title>
        </Helmet>

        <div className={estilos.confirmIcon}>
          <CheckIcon size={64} />
        </div>
        <h2 className={estilos.confirmTitle}>¡Gracias por tu compra!</h2>
        <p className={estilos.confirmSubtitle}>
          Tu pedido fue registrado con éxito. Acá están los detalles:
        </p>

        <div className={estilos.orderDetails}>
          <h4>Resumen de tu compra</h4>
          {orderComplete.items.map((item, index) => (
            <div key={index} className={estilos.itemRow}>
              <img
                src={item.image}
                alt={item.title}
                className={estilos.itemRowImg}
              />
              <span className={estilos.itemRowName}>
                {item.title?.substring(0, 40)}...
              </span>
              <span style={{ marginLeft: 'auto' }}>
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
          <div className={estilos.orderTotal}>
            Total:{' '}
            <span className={estilos.orderTotalAmount}>
              ${orderComplete.total.toFixed(2)}
            </span>
          </div>
        </div>

        <Link to="/productos">
          <button className={`${estilos.btnIcon} ${estilos.btnPrimary}`}>
            <CartIcon size={18} />
            Seguir comprando
          </button>
        </Link>
      </div>
    );
  }

  // --- Carrito vacío ---
  if (cart.length === 0) {
    return (
      <div className={estilos.emptyState}>
        <Helmet>
          <title>Carrito — Mi Tienda</title>
          <meta
            name="description"
            content="Tu carrito de compras en Mi Tienda"
          />
        </Helmet>
        <h2 className={estilos.emptyTitle}>Tu carrito está vacío</h2>
        <p className={estilos.emptyText}>
          ¡Date una vuelta por el catálogo para agregar tus productos favoritos!
        </p>
        <Link to="/productos">
          <button className={`${estilos.btnIcon} ${estilos.btnPrimary}`}>
            <CartIcon size={18} />
            Ir a la tienda
          </button>
        </Link>
      </div>
    );
  }

  // --- Vista principal del carrito ---
  return (
    <div className={estilos.container}>
      <Helmet>
        <title>Carrito — Mi Tienda</title>
        <meta
          name="description"
          content="Tu carrito de compras en Mi Tienda"
        />
      </Helmet>

      <h2 className={estilos.title}>Tu Carrito</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {cart.map((item) => (
          <div key={item.id} className={estilos.cartItem}>
            <img
              src={item.image}
              alt={item.title}
              className={estilos.itemImage}
            />

            <div className={estilos.itemInfo}>
              <h4 className={estilos.itemName}>
                {item.title?.substring(0, 45)}...
              </h4>
              <p className={estilos.itemUnitPrice}>
                Precio unitario: ${item.price}
              </p>
              <p className={estilos.itemSubtotal}>
                Subtotal: ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>

            <div className={estilos.controls}>
              <button
                className={estilos.btnQty}
                onClick={() => decreaseQuantity(item.id)}
                disabled={item.quantity <= 1}
              >
                <MinusIcon size={16} />
              </button>

              <span className={estilos.quantityDisplay}>
                {item.quantity}
              </span>

              <button
                className={estilos.btnQty}
                onClick={() => increaseQuantity(item.id)}
              >
                <PlusIcon size={16} />
              </button>
            </div>

            <button
              className={estilos.btnRemove}
              onClick={() => removeItem(item.id)}
            >
              <TrashIcon size={16} />
              Eliminar
            </button>
          </div>
        ))}
      </div>

      <div className={estilos.summary}>
        <button className={estilos.btnClear} onClick={clearCart}>
          <TrashIcon size={16} />
          Vaciar Carrito
        </button>

        <div>
          <h3 className={estilos.totalLabel}>
            Total a Pagar:{' '}
            <span className={estilos.totalAmount}>
              ${totalPrice.toFixed(2)}
            </span>
          </h3>

          {errorMsg && (
            <Alert
              variant="danger"
              dismissible
              onClose={() => setErrorMsg(null)}
            >
              {errorMsg}
            </Alert>
          )}

          <button
            className={`${estilos.btnIcon} ${estilos.btnSuccess}`}
            onClick={handleCheckout}
            disabled={checkingOut}
          >
            {checkingOut ? (
              <>
                <Spinner size="sm" animation="border" />
                Procesando...
              </>
            ) : (
              <>
                <CartIcon size={20} />
                Finalizar Compra
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
