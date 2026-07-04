// Importo los hooks de React necesarios para manejar el estado interno y el ciclo de vida
import { useState, useEffect, useMemo } from 'react';
// Importo useOutletContext para leer el searchTerm que el Layout pasa a los componentes hijos
// y useLocation para detectar en qué ruta estamos (index vs /productos)
import { useOutletContext, useLocation } from 'react-router-dom';
// Importo Helmet para SEO dinámico
import { Helmet } from 'react-helmet-async';
// Importo las funciones de Firestore para leer la colección de productos
import { collection, getDocs } from 'firebase/firestore';
// Importo la instancia de Firestore desde mi configuración centralizada
import { db } from '../../firebase/config';
// Importo los componentes visuales de React-Bootstrap para loading y estados
import { Spinner, Alert } from 'react-bootstrap';
// Importo el componente "hijo" que se encargará de darle estilo y estructura a cada tarjeta de producto
import Item from './Item';

const ItemListContainer = () => {
  // Lectura del contexto del Layout: searchTerm (escritura en el Nav, lectura acá)
  const { searchTerm } = useOutletContext();
  // useLocation para saber si estamos en index o /productos y setear el title correcto
  const location = useLocation();
  const pageTitle = location.pathname === '/' ? 'Inicio' : 'Productos';

  // Estado principal: productos obtenidos de Firestore
  const [products, setProducts] = useState([]);
  // loading: arranca en true porque al montarse el componente todavía no tengo datos
  const [loading, setLoading] = useState(true);
  // error: almacena el mensaje si la lectura de Firestore falla
  const [error, setError] = useState(null);
  // currentPage: página actual del paginado (1-based)
  const [currentPage, setCurrentPage] = useState(1);
  // Cantidad fija de productos por página
  const ITEMS_PER_PAGE = 8;

  // useEffect para leer los productos desde Firestore al montar el componente
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Obtengo todos los documentos de la colección 'productos' en Firestore
        const querySnapshot = await getDocs(collection(db, 'productos'));
        // Mapeo cada documento a un objeto plano con id + datos del documento
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsData);
      } catch (err) {
        // Si falla la conexión o la lectura, guardo el error para mostrarlo
        setError('Error al cargar productos. Intente nuevamente.');
      } finally {
        // En ambos casos (éxito o error) apago el spinner de carga
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Efecto secundario: cada vez que el usuario escribe en el buscador, vuelvo a la página 1
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Filtro los productos por título (case-insensitive) basado en el searchTerm, memoizado
  const filteredProducts = useMemo(
    () => products.filter(product =>
      product.title?.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [products, searchTerm]
  );

  // Calculo de paginación
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // --- Renderizado condicional ---

  // Mientras Firestore está respondiendo, muestro un spinner de Bootstrap
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando productos...</span>
        </Spinner>
      </div>
    );
  }

  // Si ocurrió un error en la lectura de Firestore, muestro una alerta de error
  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <Helmet>
        <title>Mi Tienda — {pageTitle}</title>
        <meta name="description" content="Los mejores productos en Mi Tienda Monumental" />
      </Helmet>
      {/* Si después del filtro no hay productos que mostrar */}
      {filteredProducts.length === 0 ? (
        <Alert variant="info">No se encontraron productos.</Alert>
      ) : (
        <>
          {/* Grilla de productos: responsiva con auto-fit y mínimo de 250px por columna */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem'
          }}>
            {paginatedProducts.map(product => (
              <Item key={product.id} product={product} />
            ))}
          </div>

          {/* Controles de paginación: solo se muestran si hay más de 1 página */}
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