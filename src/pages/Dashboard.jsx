import { useState, useEffect, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaPlus, FaPenToSquare, FaTrashCan } from 'react-icons/fa6';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import ProductForm from '../components/admin/ProductForm';
import ProductFilters from '../components/admin/ProductFilters';
import TransactionTable from '../components/admin/TransactionTable';

const Dashboard = () => {
  // Estado principal de productos
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tab activa
  const [activeTab, setActiveTab] = useState('productos');

  // Estado del modal de agregar/editar
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Estado del modal de confirmación de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);

  // Estado de carga para operaciones CRUD (add, update, delete)
  const [operationLoading, setOperationLoading] = useState(false);

  // Estado de filtros de productos
  const [productFilters, setProductFilters] = useState({ category: '', minStock: '' });

  // Refs para modales DaisyUI
  const productModalRef = useRef(null);
  const deleteModalRef = useRef(null);

  // Productos filtrados por categoría y stock mínimo
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = !productFilters.category || p.category === productFilters.category;
      const matchesStock = !productFilters.minStock || p.stock >= Number(productFilters.minStock);
      return matchesCategory && matchesStock;
    });
  }, [products, productFilters]);

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

  // Control de modales con ref
  useEffect(() => {
    if (showModal) {
      productModalRef.current?.showModal();
    } else {
      productModalRef.current?.close();
    }
  }, [showModal]);

  useEffect(() => {
    if (showDeleteModal) {
      deleteModalRef.current?.showModal();
    } else {
      deleteModalRef.current?.close();
    }
  }, [showDeleteModal]);

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
      await fetchProducts();
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
      await fetchProducts();
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
      <div className="text-center mt-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <Helmet>
        <title>Panel de Administración — Mi Tienda</title>
      </Helmet>
      <h2 className="text-2xl font-bold mb-6">Panel de Administración</h2>

      {/* Alerta de error */}
      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
          <button className="btn btn-ghost btn-xs" onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* Tabs DaisyUI */}
      <div role="tablist" className="tabs tabs-bordered mb-6">
        <button
          role="tab"
          className={`tab ${activeTab === 'productos' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('productos')}
        >
          Productos
        </button>
        <button
          role="tab"
          className={`tab ${activeTab === 'transacciones' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('transacciones')}
        >
          Transacciones
        </button>
      </div>

      {/* Contenido de la pestaña Productos */}
      {activeTab === 'productos' && (
        <>
          {/* Botón para agregar producto con icono */}
          <button className="btn btn-primary mb-4 gap-2 whitespace-nowrap inline-flex items-center" onClick={handleAdd}>
            <FaPlus />Agregar Producto
          </button>

          {/* Filtros de productos */}
          <div className="mb-4 max-w-2xl">
            <ProductFilters products={products} onFilter={setProductFilters} />
          </div>

          {/* Lista de productos o mensaje si está vacía */}
          {products.length === 0 ? (
            <div className="alert alert-info">
              No hay productos todavía. Agregá tu primer producto.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
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
                  {filteredProducts.map(product => (
                    <tr key={product.id}>
                      <td>
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-[50px] h-[50px] object-cover rounded"
                          />
                        )}
                      </td>
                      <td>{product.title}</td>
                      <td>${product.price}</td>
                      <td>{product.stock}</td>
                      <td>{product.category}</td>
                      <td className="whitespace-nowrap">
                        <button
                          className="btn btn-warning btn-sm me-2 gap-2 whitespace-nowrap"
                          onClick={() => handleEdit(product)}
                        >
                          <FaPenToSquare />Editar
                        </button>
                        <button
                          className="btn btn-error btn-sm gap-2 whitespace-nowrap"
                          onClick={() => handleDeleteClick(product)}
                        >
                          <FaTrashCan />Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Contenido de la pestaña Transacciones */}
      {activeTab === 'transacciones' && (
        <TransactionTable />
      )}

      {/* Modal para agregar/editar producto */}
      <dialog ref={productModalRef} className={`modal ${showModal ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">
            {editingProduct ? 'Editar' : 'Agregar'}
          </h3>
          <ProductForm
            initialData={editingProduct}
            onSave={handleSave}
            onCancel={() => {
              setShowModal(false);
              setEditingProduct(null);
            }}
            loading={operationLoading}
          />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => { setShowModal(false); setEditingProduct(null); }}>close</button>
        </form>
      </dialog>

      {/* Modal de confirmación de eliminación */}
      <dialog ref={deleteModalRef} className={`modal ${showDeleteModal ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Confirmar Eliminación</h3>
          {deletingProduct && (
            <p>
              ¿Estás seguro de eliminar <strong>"{deletingProduct.title}"</strong>?
              Esta acción no se puede deshacer.
            </p>
          )}
          <div className="modal-action">
            <button
              className="btn btn-ghost"
              onClick={() => {
                setShowDeleteModal(false);
                setDeletingProduct(null);
              }}
              disabled={operationLoading}
            >
              Cancelar
            </button>
            <button
              className="btn btn-error"
              onClick={handleDeleteConfirm}
              disabled={operationLoading}
            >
              {operationLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm me-2"></span>
                  Eliminando...
                </>
              ) : (
                'Eliminar'
              )}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => { setShowDeleteModal(false); setDeletingProduct(null); }}>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default Dashboard;
