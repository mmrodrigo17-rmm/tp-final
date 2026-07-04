/* eslint-disable react-refresh/only-export-components */

import { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product, quantity) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);

      if (existing) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }

      return [...prevCart, { ...product, quantity }];
    });
  };

  const increaseQuantity = (productId) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  const removeItem = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      removeItem,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
};
