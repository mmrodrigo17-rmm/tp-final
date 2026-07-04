import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Carousel, Spinner } from 'react-bootstrap';
import ItemListContainer from '../components/products/ItemListContainer';

// --- Helpers ---

const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// --- Styled Components ---

const CarouselWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto 2rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  .carousel,
  .carousel-inner,
  .carousel-item {
    height: 400px;

    @media (max-width: 768px) {
      height: 250px;
    }
  }
`;

const SlideImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;

  @media (max-width: 768px) {
    height: 250px;
  }
`;

const CaptionGradient = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.75));
  pointer-events: none;
`;

const StyledCaption = styled(Carousel.Caption)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem 1rem 1.5rem;
  text-align: left;
  z-index: 1;

  h3 {
    font-size: 1.4rem;
    font-weight: 700;
    margin: 0;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);

    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }

  p {
    font-size: 1.2rem;
    margin: 0.25rem 0 0;
    font-weight: 600;
    color: #ffc107;

    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 400px;
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 1.2rem;

  @media (max-width: 768px) {
    height: 250px;
  }
`;

const SlideLink = styled(Link)`
  display: block;
  text-decoration: none;
  color: inherit;

  &:hover {
    cursor: pointer;
  }
`;

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
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      )}

      {!error && !loading && products.length > 0 && (
        <CarouselWrapper>
          <Carousel>
            {products.map((product) => (
              <Carousel.Item key={product.id}>
                <SlideLink to={`/producto/${product.id}`}>
                  {product.image ? (
                    <SlideImage src={product.image} alt={product.title || ''} />
                  ) : (
                    <ImagePlaceholder>Sin imagen</ImagePlaceholder>
                  )}
                  <CaptionGradient />
                  <StyledCaption>
                    <h3>{product.title || ''}</h3>
                    <p>${product.price ?? ''}</p>
                  </StyledCaption>
                </SlideLink>
              </Carousel.Item>
            ))}
          </Carousel>
        </CarouselWrapper>
      )}

      <ItemListContainer />
    </div>
  );
};

export default Home;
