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
  getDocs,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Spinner, Alert, Form, Button } from 'react-bootstrap';
import { ArrowLeftIcon, CartIcon } from '../../assets/icons';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import estilos from './ItemDetailContainer.module.css';

const RATING_OPTIONS = [1, 2, 3, 4, 5];

const ItemDetailContainer = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Opiniones en tiempo real con onSnapshot
  const [opiniones, setOpiniones] = useState([]);
  const [cargandoOpiniones, setCargandoOpiniones] = useState(true);

  // Control de acceso a la opinión
  const [comproElProducto, setComproElProducto] = useState(false);
  const [verificandoCompra, setVerificandoCompra] = useState(true);
  const [yaOpino, setYaOpino] = useState(false);
  const [userOpinionId, setUserOpinionId] = useState(null);

  // Formulario de opinión
  const [opinionForm, setOpinionForm] = useState({ rating: 5, comentario: '' });
  const [enviandoOpinion, setEnviandoOpinion] = useState(false);
  const [errorOpinion, setErrorOpinion] = useState(null);
  const [opinionEnviada, setOpinionEnviada] = useState(false);

  // Cleanup del timeout de feedback del carrito
  useEffect(() => {
    if (!addedFeedback) return;
    const timeoutId = setTimeout(() => setAddedFeedback(false), 1500);
    return () => clearTimeout(timeoutId);
  }, [addedFeedback]);

  // Carga el producto desde Firestore
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
        setCargandoOpiniones(false);
      }
    );

    return unsubscribe;
  }, [id]);

  // Verifica si el usuario compró este producto
  useEffect(() => {
    const verificarCompra = async () => {
      if (!user) {
        setComproElProducto(false);
        setVerificandoCompra(false);
        return;
      }

      try {
        const q = query(
          collection(db, 'transacciones'),
          where('userId', '==', user.uid),
          where('status', '==', 'completada')
        );
        const snapshot = await getDocs(q);

        const compro = snapshot.docs.some((doc) => {
          const data = doc.data();
          return data.items?.some((item) => item.id === id);
        });

        setComproElProducto(compro);
      } catch {
        setComproElProducto(false);
      } finally {
        setVerificandoCompra(false);
      }
    };

    verificarCompra();
  }, [user, id]);

  // Verifica si el usuario ya opinó sobre este producto
  useEffect(() => {
    if (!user) {
      setYaOpino(false);
      return;
    }

    const q = query(
      collection(db, 'opiniones'),
      where('productoId', '==', id),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        setYaOpino(true);
        setUserOpinionId(doc.id);
      } else {
        setYaOpino(false);
        setUserOpinionId(null);
      }
    });

    return unsubscribe;
  }, [user, id]);

  const puedeOpinar = !!user && comproElProducto && !yaOpino;

  const handleSubmitOpinion = async (e) => {
    e.preventDefault();
    if (!user) return;

    setEnviandoOpinion(true);
    setErrorOpinion(null);

    try {
      const opinionData = {
        productoId: id,
        userId: user.uid,
        userEmail: user.email,
        clienteNombre: user.email?.split('@')[0] || 'Anónimo',
        rating: opinionForm.rating,
        comentario: opinionForm.comentario.trim(),
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'opiniones'), opinionData);
      setOpinionEnviada(true);
      setOpinionForm({ rating: 5, comentario: '' });
    } catch {
      setErrorOpinion('Error al enviar la opinión. Intentá de nuevo.');
    } finally {
      setEnviandoOpinion(false);
    }
  };

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

      {/* Sección de opiniones */}
      <section className={estilos.opinionesSection}>
        <h3 className={estilos.opinionesTitle}>Opiniones de la comunidad</h3>

        {/* Formulario para opinar (solo si compró y aún no opinó) */}
        {user && !verificandoCompra && (
          <>
            {opinionEnviada ? (
              <Alert variant="success" dismissible onClose={() => setOpinionEnviada(false)}>
                ¡Gracias por tu opinión! Se publicó al instante.
              </Alert>
            ) : errorOpinion ? (
              <Alert variant="danger" dismissible onClose={() => setErrorOpinion(null)}>
                {errorOpinion}
              </Alert>
            ) : yaOpino ? (
              <Alert variant="info" style={{ marginBottom: '1.5rem' }}>
                Ya dejaste una opinión sobre este producto.
              </Alert>
            ) : comproElProducto ? (
              <div className={estilos.opinionForm}>
                <h4 className={estilos.opinionFormTitle}>Dejanos tu opinión</h4>
                <Form onSubmit={handleSubmitOpinion}>
                  <Form.Group className="mb-3">
                    <Form.Label>Puntuación</Form.Label>
                    <div className={estilos.ratingStars}>
                      {RATING_OPTIONS.map((star) => (
                        <span
                          key={star}
                          className={`${estilos.star} ${star <= opinionForm.rating ? estilos.starActive : ''}`}
                          onClick={() => setOpinionForm(prev => ({ ...prev, rating: star }))}
                          role="button"
                          aria-label={`${star} estrella${star > 1 ? 's' : ''}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Comentario</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={opinionForm.comentario}
                      onChange={(e) =>
                        setOpinionForm((prev) => ({ ...prev, comentario: e.target.value }))
                      }
                      placeholder="Contá tu experiencia con el producto..."
                      required
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    disabled={enviandoOpinion || !opinionForm.comentario.trim()}
                  >
                    {enviandoOpinion ? (
                      <>
                        <Spinner size="sm" animation="border" className="me-2" />
                        Enviando...
                      </>
                    ) : (
                      'Publicar opinión'
                    )}
                  </Button>
                </Form>
              </div>
            ) : (
              <Alert variant="light" style={{ marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
                Comprá este producto para poder dejar tu opinión.
              </Alert>
            )}
          </>
        )}

        {/* Lista de opiniones existentes */}
        {cargandoOpiniones ? (
          <p className={estilos.opinionesLoading}>Cargando opiniones...</p>
        ) : opiniones.length === 0 ? (
          <p className={estilos.opinionesEmpty}>
            Aún no hay reseñas para este producto. {!user && 'Iniciá sesión y compralo para ser el primero en opinar.'}
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
                  {'★'.repeat(op.rating)}{'☆'.repeat(5 - op.rating)}
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
