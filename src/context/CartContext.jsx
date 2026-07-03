/* eslint-disable react-refresh/only-export-components */
// Deshabilito temporalmente esta regla de Vite para poder exportar tanto mi Provider 
// como mi custom hook desde un mismo archivo sin romper la recarga rápida (Fast Refresh).

// Importo las herramientas necesarias de React
import { createContext, useState, useContext } from 'react';

// 1. Creo el contexto. Este es el "almacén" que contendrá la información de nuestro carrito.
const CartContext = createContext();

// 2. Creo el componente Provider. 
// Su trabajo es envolver nuestra aplicación (recibiendo los componentes hijos por la prop "children")
// y proveerles el estado del carrito y las funciones para modificarlo.
export const CartProvider = ({ children }) => {
  // Inicializo el estado global del carrito como un array vacío
  const [cart, setCart] = useState([]);

  // Función principal para añadir un producto (o sumar cantidad si ya existe)
  const addToCart = (product, quantity) => {
    // Uso la versión de callback de setCart (prevCart) para asegurarme de estar trabajando
    // siempre con el estado más reciente, por si hay múltiples actualizaciones rápidas.
    setCart(prevCart => {
      // Primero, verifico si este producto ya fue agregado antes buscando su ID
      const existing = prevCart.find(item => item.id === product.id);
      
      if (existing) {
        // Si ya existe, recorro el array con map(). Cuando encuentro el producto,
        // creo una copia de él (...item) y le sumo la nueva cantidad. 
        // A los demás productos los dejo exactamente igual.
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      
      // Si no existe en el carrito, copio todo el array anterior (...prevCart)
      // y le agrego al final el nuevo producto (copiando sus datos y agregándole la propiedad quantity).
      return [...prevCart, { ...product, quantity }];
    });
  };

  // Función para sumar 1 unidad a un ítem desde la vista del carrito
  const increaseQuantity = (productId) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Función para restar 1 unidad a un ítem desde la vista del carrito
  const decreaseQuantity = (productId) => {
    setCart(prevCart =>
      prevCart.map(item =>
        // Aquí uso Math.max(1, ...) como medida de seguridad. 
        // Le digo a React: "resta 1, pero si el resultado es menor a 1, quédate con 1". 
        // Así evito tener cantidades negativas o cero.
        item.id === productId 
          ? { ...item, quantity: Math.max(1, item.quantity - 1) } 
          : item
      )
    );
  };

  // Función para eliminar completamente un producto del carrito
  const removeItem = (productId) => {
    // Uso filter() para crear un nuevo array que contenga solo los productos
    // cuyo ID sea diferente al que quiero borrar. Básicamente, dejo afuera al que quiero eliminar.
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  // Función para vaciar todo el carrito en un solo paso
  const clearCart = () => setCart([]); // Simplemente devuelvo el estado a un array vacío

  return (
    // Retorno el Provider. En la prop "value" expongo un objeto que contiene el estado (cart)
    // y todas las funciones que acabo de crear. Todo lo que esté aquí dentro estará disponible globalmente.
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

// 3. Creo y exporto un Custom Hook llamado useCart
// Esto es una muy buena práctica: me ahorra tener que importar useContext y CartContext 
// en cada archivo de mi app. Simplemente importaré useCart() y listo.
export const useCart = () => {
  const context = useContext(CartContext);
  
  // Agrego una validación de seguridad: si otro programador intenta usar useCart() 
  // en un componente que no está envuelto por el CartProvider, le lanzo un error claro en consola.
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  
  return context;
};