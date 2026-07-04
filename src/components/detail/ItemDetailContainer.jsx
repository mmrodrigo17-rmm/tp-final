import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Spinner, Alert } from 'react-bootstrap';
import { ArrowLeftIcon, CartIcon } from '../../assets/icons';
import { useCart } from '../../context/CartContext';
import estilos from './ItemDetailContainer.module.css';

const ItemDetailContainer = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Opiniones en tiempo real con onSnapshot
  const [opiniones, setOpiniones] = useState([]);
  const [cargandoOpiniones, setCargandoOpiniones] = useState(true);

  // Cleanup del timeout de feedback al desmontar
  useEffect(() => {
    if (!addedFeedback) return;
    const timeoutId = setTimeout(() => setAddedFeedback(false), 1500);
    return () => clearTimeout(timeoutId);
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
      } catch {
        setError('Error al cargar el producto.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Opiniones en tiempo real con onSnapshot
  useEffect(() => {
    const q = query(collection(db, 'opiniones'), where('productoId', '==', id));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const opinionesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOpiniones(opinionesData);
        setCargandoOpiniones(false);
      },
      () => {
        // Si la colección 'opiniones' no existe, no hay opiniones
        setCargandoOpiniones(false);
      }
    );

    return unsubscribe;
  }, [id]);

  if (loading) {
    return (
      <div className={estilos.loadingContainer}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando detalle...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        {error}
        <div style={{ marginTop: '1rem' }}>
          <Link to="/productos" className={estilos.backLink}>
            <ArrowLeftIcon size={16} />
            Volver al catálogo
          </Link>
        </div>
      </Alert>
    );
  }

  if (!product) {
    return (
      <div className={estilos.notFound}>
        <h2>Producto no encontrado</h2>
        <Link to="/productos" className={estilos.notFoundLink}>
          <ArrowLeftIcon size={16} />
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const stock = product.stock ?? 0;
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 5;

  const metaDescription = product.description
    ? product.description.substring(0, 160)
    : 'Detalle del producto en Mi Tienda Monumental';

  const handleAddToCart = () => {
    addToCart(product, 1);
    setAddedFeedback(true);
  };

  return (
    <div className={estilos.container}>
      <Helmet>
        <title>{product.title} — Mi Tienda</title>
        <meta name="description" content={metaDescription} />
      </Helmet>

      <Link to="/productos" className={estilos.backLink}>
        <ArrowLeftIcon size={16} />
        Volver al catálogo
      </Link>

      <div className={estilos.layout}>
        <div className={estilos.imageWrapper}>
          <img
            src={product.image}
            alt={product.title}
            className={estilos.productImage}
          />
        </div>

        <div className={estilos.infoWrapper}>
          <h2 className={estilos.productTitle}>{product.title}</h2>

          <p className={estilos.description}>{product.description}</p>

          <p className={estilos.price}>${product.price}</p>

          {product.category && (
            <p className={estilos.category}>
              <strong>Categoría:</strong> {product.category}
            </p>
          )}

          <p className={estilos.stock}>
            <strong>Stock:</strong>{' '}
            {isOutOfStock ? (
              <span className={estilos.stockOut}>Sin stock</span>
            ) : isLowStock ? (
              <span className={estilos.stockLow}>
                {stock} unidades (bajo stock)
              </span>
            ) : (
              <span className={estilos.stockOk}>{stock} unidades</span>
            )}
          </p>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`${estilos.btnAddCart} ${addedFeedback ? estilos.btnAddCartAdded : ''}`}
          >
            {isOutOfStock ? (
              'Sin stock'
            ) : addedFeedback ? (
              '✓ Agregado'
            ) : (
              <>
                <CartIcon size={18} />
                Agregar al Carrito
              </>
            )}
          </button>
        </div>
      </div>

      {/* Opiniones en tiempo real */}
      <section className={estilos.opinionesSection}>
        <h3 className={estilos.opinionesTitle}>Opiniones de la comunidad</h3>

        {cargandoOpiniones ? (
          <p className={estilos.opinionesLoading}>Cargando opiniones...</p>
        ) : opiniones.length === 0 ? (
          <p className={estilos.opinionesEmpty}>
            Aún no hay reseñas para este producto.
          </p>
        ) : (
          opiniones.map((op) => (
            <div key={op.id} className={estilos.opinionCard}>
              <strong className={estilos.opinionAuthor}>
                {op.clienteNombre || 'Anónimo'}
              </strong>
              <p className={estilos.opinionText}>{op.comentario}</p>
              {op.rating && (
                <span className={estilos.opinionRating}>
                  {op.rating} ★
                </span>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default ItemDetailContainer;
