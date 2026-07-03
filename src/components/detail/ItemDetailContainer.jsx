// Importo los hooks de React para manejar el estado y el ciclo de vida del componente
import { useState, useEffect } from 'react';
// Importo useParams de React Router. Esto me permite leer los parámetros dinámicos de la URL 
// (en este caso, el :id del producto que configuré en App.jsx)
import { useParams, Link } from 'react-router-dom';
// Importo Helmet para SEO dinámico
import { Helmet } from 'react-helmet-async';
// Importo las funciones de Firestore para leer un documento por su ID
import { doc, getDoc } from 'firebase/firestore';
// Importo la instancia de Firestore desde mi configuración centralizada
import { db } from '../../firebase/config';
// Importo los componentes visuales de React-Bootstrap para loading y estados
import { Spinner, Alert } from 'react-bootstrap';
// Importo React Icons para los botones de acción
import { FaCartPlus, FaArrowLeft } from 'react-icons/fa6';
// Importo mi custom hook para poder interactuar con el carrito global
import { useCart } from '../../context/CartContext'; 

const ItemDetailContainer = () => {
  // Extraigo el "id" directamente de la URL. Si la ruta es "/producto/abc123", id valdrá "abc123".
  const { id } = useParams();
  
  // Estado para guardar la información detallada del producto (arranca en null porque aún no hay datos)
  const [product, setProduct] = useState(null);
  
  // Estado para manejar la pantalla de carga, arranca en true
  const [loading, setLoading] = useState(true);
  
  // Estado para manejar errores de Firestore
  const [error, setError] = useState(null);
  
  // Extraigo la función addToCart de mi contexto para poder usarla en el botón de compra
  const { addToCart } = useCart(); 

  // Estado local para feedback visual al agregar al carrito
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Uso useEffect para leer el producto desde Firestore.
  // Es clave que en el array de dependencias (al final) ponga [id]. 
  // Así le digo a React: "Si el usuario cambia de producto y el ID de la URL cambia, 
  // vuelve a ejecutar este efecto para traer los datos del nuevo producto".
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      setProduct(null);
      
      try {
        // Leo el documento de Firestore por su ID desde la colección 'productos'
        const docSnap = await getDoc(doc(db, 'productos', id));
        
        if (docSnap.exists()) {
          // Si el documento existe, armo el objeto con su ID y datos
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          // Si no existe, dejo product en null (se mostrará "Producto no encontrado")
          setProduct(null);
        }
      } catch (err) {
        // Si falla la conexión o el ID tiene formato inválido
        setError('Error al cargar el producto.');
      } finally {
        // En ambos casos apago el estado de carga
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // --- Renderizado condicional ---

  // Mientras Firestore responde, muestro un spinner de Bootstrap
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando detalle del producto...</span>
        </Spinner>
      </div>
    );
  }

  // Si ocurrió un error en la lectura de Firestore
  if (error) {
    return (
      <Alert variant="danger">
        {error}
        <div style={{ marginTop: '1rem' }}>
          <Link to="/productos"><FaArrowLeft className="me-1" />Volver al catálogo</Link>
        </div>
      </Alert>
    );
  }

  // Si el producto no existe o fue eliminado
  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Producto no encontrado</h2>
        <p style={{ marginTop: '1rem' }}>
          <Link to="/productos"><FaArrowLeft className="me-1" />Volver al catálogo</Link>
        </p>
      </div>
    );
  }

  // Determino el estado del stock para mostrar advertencias
  const stock = product.stock ?? 0;
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 5;

  // Si pasé las validaciones anteriores, renderizo la vista detallada del producto
  const metaDescription = product.description
    ? product.description.substring(0, 160)
    : 'Detalle del producto en Mi Tienda Monumental';

  return (
    <div>
      <Helmet>
        <title>{product.title} — Mi Tienda</title>
        <meta name="description" content={metaDescription} />
      </Helmet>
    // Contenedor principal usando Flexbox para poner la imagen y el texto lado a lado
    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      
      {/* Imagen del producto */}
      <img
        src={product.image}
        alt={product.title}
        style={{ width: '300px', maxWidth: '100%', objectFit: 'contain' }}
      />
      
      {/* Contenedor de la información del producto */}
      <div style={{ flex: 1, minWidth: '250px' }}>
        <h2>{product.title}</h2>
        <p style={{ color: '#555', lineHeight: 1.6 }}>{product.description}</p>
        <h3 style={{ color: '#2c7be5' }}>${product.price}</h3>
        
        {/* Categoría del producto */}
        {product.category && (
          <p style={{ marginTop: '0.5rem' }}>
            <strong>Categoría:</strong> {product.category}
          </p>
        )}
        
        {/* Stock del producto con indicador visual */}
        <p style={{ marginTop: '0.5rem' }}>
          <strong>Stock:</strong>{' '}
          {isOutOfStock ? (
            <span style={{ color: 'red', fontWeight: 'bold' }}>Sin stock</span>
          ) : isLowStock ? (
            <span style={{ color: '#e67e22', fontWeight: 'bold' }}>
              {stock} unidades (bajo stock)
            </span>
          ) : (
            <span>{stock} unidades</span>
          )}
        </p>
        
        {/* Botón de compra */}
        <button
          onClick={() => {
            addToCart(product, 1);
            setAddedFeedback(true);
            setTimeout(() => setAddedFeedback(false), 1500);
          }}
          disabled={isOutOfStock}
          style={{
            padding: '10px 20px',
            background: isOutOfStock ? '#ccc' : 'blue',
            color: 'white',
            cursor: isOutOfStock ? 'not-allowed' : 'pointer',
            border: 'none',
            borderRadius: '4px',
            marginTop: '10px',
            fontSize: '1rem'
          }}
        >
          {isOutOfStock ? 'Sin stock' : addedFeedback ? '✓ Agregado' : <><FaCartPlus className="me-2" />Agregar al Carrito</>}
        </button>
      </div>
      
    </div>
    </div>
  );
};

export default ItemDetailContainer;