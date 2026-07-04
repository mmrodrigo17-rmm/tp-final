import { useState, useEffect, useMemo } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Spinner, Alert } from 'react-bootstrap';
import Item from './Item';

const ITEMS_PER_PAGE = 8;

const ItemListContainer = () => {
  const { searchTerm } = useOutletContext();
  const location = useLocation();
  const pageTitle = location.pathname === '/' ? 'Inicio' : 'Productos';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const querySnapshot = await getDocs(collection(db, 'productos'));
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsData);
      } catch (err) {
        setError('Error al cargar productos. Intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Vuelve a página 1 cuando cambia el término de búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredProducts = useMemo(
    () => products.filter(product =>
      product.title?.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [products, searchTerm]
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando productos...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <Helmet>
        <title>Mi Tienda — {pageTitle}</title>
        <meta name="description" content="Los mejores productos en Mi Tienda Monumental" />
      </Helmet>
      {filteredProducts.length === 0 ? (
        <Alert variant="info">No se encontraron productos.</Alert>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem'
          }}>
            {paginatedProducts.map(product => (
              <Item key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '0.5rem 1.2rem',
                  marginRight: '0.5rem',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  background: currentPage === 1 ? '#f0f0f0' : '#fff'
                }}
              >
                Anterior
              </button>

              <span style={{ margin: '0 1rem', fontWeight: 'bold' }}>
                Página {currentPage} de {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '0.5rem 1.2rem',
                  marginLeft: '0.5rem',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  background: currentPage === totalPages ? '#f0f0f0' : '#fff'
                }}
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ItemListContainer;
