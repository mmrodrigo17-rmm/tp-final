import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Spinner, Alert } from 'react-bootstrap';
import { FaCartPlus, FaArrowLeft } from 'react-icons/fa6';
import { useCart } from '../../context/CartContext';

const ItemDetailContainer = () => {
  const { id } = useParams();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Cleanup del timeout de feedback al desmontar
  useEffect(() => {
    if (!addedFeedback) return;
    const id = setTimeout(() => setAddedFeedback(false), 1500);
    return () => clearTimeout(id);
  }, [addedFeedback]);

  // Carga el producto desde Firestore según el id de la URL
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      setProduct(null);
      
      try {
        const docSnap = await getDoc(doc(db, 'productos', id));
        
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          setProduct(null);
        }
      } catch (err) {
        setError('Error al cargar el producto.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando detalle del producto...</span>
        </Spinner>
      </div>
    );
  }

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

  const stock = product.stock ?? 0;
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 5;

  const metaDescription = product.description
    ? product.description.substring(0, 160)
    : 'Detalle del producto en Mi Tienda Monumental';

  return (
    <div>
      <Helmet>
        <title>{product.title} — Mi Tienda</title>
        <meta name="description" content={metaDescription} />
      </Helmet>
    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      
      <img
        src={product.image}
        alt={product.title}
        style={{ width: '300px', maxWidth: '100%', objectFit: 'contain' }}
      />
      
      <div style={{ flex: 1, minWidth: '250px' }}>
        <h2>{product.title}</h2>
        <p style={{ color: '#555', lineHeight: 1.6 }}>{product.description}</p>
        <h3 style={{ color: '#2c7be5' }}>${product.price}</h3>
        
        {product.category && (
          <p style={{ marginTop: '0.5rem' }}>
            <strong>Categoría:</strong> {product.category}
          </p>
        )}
        
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
        
        <button
          onClick={() => {
            addToCart(product, 1);
            setAddedFeedback(true);
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
            fontSize: '1rem',
            display: 'inline-flex',
            alignItems: 'center',
            whiteSpace: 'nowrap'
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
