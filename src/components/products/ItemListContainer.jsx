import { Helmet } from 'react-helmet-async';
import { useOutletContext, useLocation } from 'react-router-dom';
import { Spinner, Alert } from 'react-bootstrap';
import { usePaginacion } from '../../hooks/usePaginacion';
import ItemList from './ItemList';
import Paginacion from '../Paginacion';
import estilos from './ItemListContainer.module.css';

const ItemListContainer = () => {
  const { searchTerm } = useOutletContext();
  const location = useLocation();
  const pageTitle = location.pathname === '/' ? 'Inicio' : 'Productos';

  const {
    data: productos,
    cargando,
    paginaActual,
    totalPaginas,
    cargarPagina,
  } = usePaginacion('productos', 'title', 8);

  // Filtro por búsqueda (del lado del cliente porque el search es local)
  const productosFiltrados = searchTerm
    ? productos.filter((p) =>
        p.title?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : productos;

  if (cargando && productos.length === 0) {
    return (
      <div className={estilos.loadingContainer}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando productos...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className={estilos.catalogContainer}>
      <Helmet>
        <title>Mi Tienda — {pageTitle}</title>
        <meta
          name="description"
          content="Los mejores productos en Mi Tienda Monumental"
        />
      </Helmet>

      {productosFiltrados.length === 0 ? (
        <div className={estilos.noResults}>
          <Alert variant="info">No se encontraron productos.</Alert>
        </div>
      ) : (
        <>
          <ItemList productos={productosFiltrados} />

          {/* Paginación — solo se muestra si no hay búsqueda activa */}
          {!searchTerm && (
            <Paginacion
              paginaActual={paginaActual}
              totalPaginas={totalPaginas}
              cargarPagina={cargarPagina}
              cargando={cargando}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ItemListContainer;
