import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Container,
  Table,
  Button,
  Modal,
  Spinner,
  Alert,
  Tabs,
  Tab,
  Row,
  Col,
} from 'react-bootstrap';
import { PlusIcon, EditIcon, TrashIcon } from '../assets/icons';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { usePaginacion } from '../hooks/usePaginacion';
import ProductForm from '../components/admin/ProductForm';
import ProductFilters from '../components/admin/ProductFilters';
import TransactionTable from '../components/admin/TransactionTable';
import Paginacion from '../components/Paginacion';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

  // Paginación de productos
  const {
    data: productosPaginados,
    cargando: cargandoPagina,
    paginaActual,
    totalPaginas,
    cargarPagina,
    refrescarPagina,
  } = usePaginacion('productos', 'title', 8);

  // Estado del modal de agregar/editar
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Estado del modal de confirmación de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);

  // Estado de carga para operaciones CRUD
  const [operationLoading, setOperationLoading] = useState(false);

  // Estado de filtros de productos
  const [productFilters, setProductFilters] = useState({
    category: '',
    minStock: '',
  });

  // Productos filtrados por categoría y stock mínimo
  const filteredProducts = useMemo(() => {
    return productosPaginados.filter((p) => {
      const matchesCategory =
        !productFilters.category || p.category === productFilters.category;
      const matchesStock =
        !productFilters.minStock || p.stock >= Number(productFilters.minStock);
      return matchesCategory && matchesStock;
    });
  }, [productosPaginados, productFilters]);

  // Cargo la lista completa de productos para los filtros (categorías)
  const fetchAllProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const snapshot = await getDocs(collection(db, 'productos'));
      const productsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsList);
    } catch {
      setError('Error al cargar los productos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  // Abro el modal en modo "agregar"
  const handleAdd = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  // Abro el modal en modo "editar"
  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  // Abro el modal de confirmación para eliminar
  const handleDeleteClick = (product) => {
    setDeletingProduct(product);
    setShowDeleteModal(true);
  };

  // Guardo el producto (crear o actualizar)
  const handleSave = async (productData) => {
    setOperationLoading(true);
    setError(null);
    try {
      if (editingProduct) {
        await updateDoc(doc(db, 'productos', editingProduct.id), productData);
      } else {
        await addDoc(collection(db, 'productos'), productData);
      }
      setShowModal(false);
      setEditingProduct(null);
      await fetchAllProducts();
      refrescarPagina();
    } catch {
      setError('Error al guardar el producto. Intentá de nuevo.');
    } finally {
      setOperationLoading(false);
    }
  };

  // Confirmo la eliminación
  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    setOperationLoading(true);
    setError(null);
    try {
      await deleteDoc(doc(db, 'productos', deletingProduct.id));
      setShowDeleteModal(false);
      setDeletingProduct(null);
      await fetchAllProducts();
      refrescarPagina();
    } catch {
      setError('Error al eliminar el producto. Intentá de nuevo.');
    } finally {
      setOperationLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando productos...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container>
      <Helmet>
        <title>Panel de Administración — Mi Tienda</title>
      </Helmet>
      <h2 style={{ color: 'var(--heading)' }} className="mb-4">
        Panel de Administración
      </h2>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Tabs defaultActiveKey="productos" className="mb-3">
        <Tab eventKey="productos" title="Productos">
          <Button
            variant="primary"
            className="mb-3 d-inline-flex align-items-center"
            onClick={handleAdd}
          >
            <PlusIcon size={18} className="me-2" />
            Agregar Producto
          </Button>

          <Row className="mb-3">
            <Col md={8}>
              <ProductFilters products={products} onFilter={setProductFilters} />
            </Col>
          </Row>

          {products.length === 0 ? (
            <Alert variant="info">
              No hay productos todavía. Agregá tu primer producto.
            </Alert>
          ) : filteredProducts.length === 0 ? (
            <Alert variant="warning">
              No hay productos que coincidan con los filtros actuales.
            </Alert>
          ) : (
            <>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Título</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Categoría</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.title}
                            style={{
                              width: 50,
                              height: 50,
                              objectFit: 'cover',
                            }}
                          />
                        )}
                      </td>
                      <td>{product.title}</td>
                      <td>${product.price}</td>
                      <td>{product.stock}</td>
                      <td>{product.category}</td>
                      <td className="d-flex justify-content-center gap-2">
                        <Button
                          variant="warning"
                          size="sm"
                          className="d-inline-flex align-items-center justify-content-center"
                          style={{ width: '90px' }}
                          onClick={() => handleEdit(product)}
                        >
                          <EditIcon size={16} className="me-1" />
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          className="d-inline-flex align-items-center justify-content-center"
                          style={{ width: '90px' }}
                          onClick={() => handleDeleteClick(product)}
                        >
                          <TrashIcon size={16} className="me-1" />
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <Paginacion
                paginaActual={paginaActual}
                totalPaginas={totalPaginas}
                cargarPagina={cargarPagina}
                cargando={cargandoPagina}
              />
            </>
          )}
        </Tab>

        <Tab eventKey="transacciones" title="Transacciones">
          <TransactionTable />
        </Tab>
      </Tabs>

      {/* Modal para agregar/editar producto */}
      <Modal
        show={showModal}
        onHide={() => {
          if (!operationLoading) {
            setShowModal(false);
            setEditingProduct(null);
          }
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProduct ? 'Editar Producto' : 'Agregar Producto'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProductForm
            initialData={editingProduct}
            onSave={handleSave}
            onCancel={() => {
              setShowModal(false);
              setEditingProduct(null);
            }}
            loading={operationLoading}
          />
        </Modal.Body>
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <Modal
        show={showDeleteModal}
        onHide={() => {
          if (!operationLoading) {
            setShowDeleteModal(false);
            setDeletingProduct(null);
          }
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deletingProduct && (
            <p>
              ¿Estás seguro de eliminar <strong>"{deletingProduct.title}"</strong>?
              Esta acción no se puede deshacer.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowDeleteModal(false);
              setDeletingProduct(null);
            }}
            disabled={operationLoading}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteConfirm}
            disabled={operationLoading}
          >
            {operationLoading ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Eliminando...
              </>
            ) : (
              'Eliminar'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Dashboard;
