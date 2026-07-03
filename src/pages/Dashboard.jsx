import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Table, Button, Modal, Spinner, Alert } from 'react-bootstrap';
import { FaPlus, FaPenToSquare, FaTrashCan } from 'react-icons/fa6';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import ProductForm from '../components/admin/ProductForm';

const Dashboard = () => {
  // Estado principal de productos
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado del modal de agregar/editar
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Estado del modal de confirmación de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);

  // Estado de carga para operaciones CRUD (add, update, delete)
  const [operationLoading, setOperationLoading] = useState(false);

  // Cargo la lista de productos desde Firestore al montar el componente
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const snapshot = await getDocs(collection(db, 'productos'));
      const productsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsList);
    } catch (err) {
      setError('Error al cargar los productos. Verificá la conexión con Firebase.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Abro el modal en modo "agregar"
  const handleAdd = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  // Abro el modal en modo "editar" con los datos del producto seleccionado
  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  // Abro el modal de confirmación para eliminar
  const handleDeleteClick = (product) => {
    setDeletingProduct(product);
    setShowDeleteModal(true);
  };

  // Guardo el producto (crear o actualizar) en Firestore
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
      await fetchProducts(); // Recargo la lista
    } catch (err) {
      setError('Error al guardar el producto. Intentá de nuevo.');
    } finally {
      setOperationLoading(false);
    }
  };

  // Confirmo la eliminación del producto en Firestore
  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    setOperationLoading(true);
    setError(null);
    try {
      await deleteDoc(doc(db, 'productos', deletingProduct.id));
      setShowDeleteModal(false);
      setDeletingProduct(null);
      await fetchProducts(); // Recargo la lista
    } catch (err) {
      setError('Error al eliminar el producto. Intentá de nuevo.');
    } finally {
      setOperationLoading(false);
    }
  };

  // --- Renderizado condicional ---

  // Estado de carga inicial
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
      <h2 className="mb-4">Panel de Administración</h2>

      {/* Alerta de error */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Botón para agregar producto con icono */}
      <Button variant="primary" className="mb-3" onClick={handleAdd}>
        <FaPlus className="me-2" />Agregar Producto
      </Button>

      {/* Lista de productos o mensaje si está vacía */}
      {products.length === 0 ? (
        <Alert variant="info">
          No hay productos todavía. Agregá tu primer producto.
        </Alert>
      ) : (
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
            {products.map(product => (
              <tr key={product.id}>
                <td>
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.title}
                      style={{ width: 50, height: 50, objectFit: 'cover' }}
                    />
                  )}
                </td>
                <td>{product.title}</td>
                <td>${product.price}</td>
                <td>{product.stock}</td>
                <td>{product.category}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(product)}
                  >
                    <FaPenToSquare className="me-1" />Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteClick(product)}
                  >
                    <FaTrashCan className="me-1" />Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

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
