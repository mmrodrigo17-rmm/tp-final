import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Carousel, Spinner } from 'react-bootstrap';
import ItemListContainer from '../components/products/ItemListContainer';
import estilos from './Home.module.css';

// --- Helpers ---

const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// --- Component ---

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const querySnapshot = await getDocs(collection(db, 'productos'));
        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const shuffled = shuffle(productsData);
        setProducts(shuffled.slice(0, 4));
      } catch {
        setError('Error al cargar productos.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Mi Tienda — Inicio</title>
      </Helmet>

      {loading && (
        <div className={estilos.loadingContainer}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      )}

      {!error && !loading && products.length > 0 && (
        <div className={estilos.carouselWrapper}>
          <Carousel>
            {products.map((product) => (
              <Carousel.Item key={product.id}>
                <Link
                  to={`/producto/${product.id}`}
                  className={estilos.slideLink}
                >
                  <div className={estilos.carouselInner}>
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title || ''}
                        className={estilos.slideImage}
                      />
                    ) : (
                      <div className={estilos.imagePlaceholder}>
                        Sin imagen
                      </div>
                    )}
                    <div className={estilos.captionGradient} />
                    <Carousel.Caption className={estilos.caption}>
                      <h3>{product.title || ''}</h3>
                      <p>${product.price ?? ''}</p>
                    </Carousel.Caption>
                  </div>
                </Link>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      )}

      <ItemListContainer />
    </div>
  );
};

export default Home;
