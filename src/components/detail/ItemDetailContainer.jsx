// Importo los hooks de React para manejar el estado y el ciclo de vida del componente
import { useState, useEffect } from 'react';
// Importo useParams de React Router. Esto me permite leer los parámetros dinámicos de la URL 
import { useParams, Link } from 'react-router-dom';
// Importo Helmet para SEO dinámico
import { Helmet } from 'react-helmet-async';
// Importo las funciones de Firestore para leer un documento por su ID
import { doc, getDoc } from 'firebase/firestore';
// Importo la instancia de Firestore desde mi configuración centralizada
import { db } from '../../firebase/config';
// Importo React Icons para los botones de acción
import { FaCartPlus, FaArrowLeft } from 'react-icons/fa6';
// Importo mi custom hook para poder interactuar con el carrito global
import { useCart } from '../../context/CartContext'; 

const ItemDetailContainer = () => {
  const { id } = useParams();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { addToCart } = useCart(); 
  const [addedFeedback, setAddedFeedback] = useState(false);

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
      } catch (err) {
        setError('Error al cargar el producto.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error mb-4">
        {error}
        <Link to="/productos" className="btn btn-ghost btn-sm ml-4">
          <FaArrowLeft />Volver al catálogo
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold">Producto no encontrado</h2>
        <Link to="/productos" className="btn btn-primary mt-4">
          <FaArrowLeft />Volver al catálogo
        </Link>
      </div>
    );
  }

  const stock = product.stock ?? 0;
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 5;

  return (
    <div className="container mx-auto p-4">
      <Helmet>
        <title>{product.title} — Mi Tienda</title>
      </Helmet>
      
      <div className="flex flex-wrap gap-8 items-start">
        
        {/* Imagen */}
        <div className="w-full md:w-1/3 flex justify-center">
          <img
            src={product.image}
            alt={product.title}
            className="w-full max-w-[300px] h-[300px] object-contain"
          />
        </div>
        
        {/* Información */}
        <div className="flex-1 min-w-[250px]">
          <h2 className="text-3xl font-bold mb-4">{product.title}</h2>
          <p className="text-base-content/70 leading-relaxed mb-4">{product.description}</p>
          <h3 className="text-2xl font-bold text-success mb-2">${product.price}</h3>
          
          {product.category && (
            <p className="mb-2"><strong>Categoría:</strong> {product.category}</p>
          )}
          
          <p className="mb-4">
            <strong>Stock:</strong>{' '}
            {isOutOfStock ? (
              <span className="text-error font-bold">Sin stock</span>
            ) : isLowStock ? (
              <span className="text-warning font-bold">{stock} unidades (bajo stock)</span>
            ) : (
              <span>{stock} unidades</span>
            )}
          </p>
          
          <button
            onClick={() => {
              addToCart(product, 1);
              setAddedFeedback(true);
              setTimeout(() => setAddedFeedback(false), 1500);
            }}
            disabled={isOutOfStock}
            className={`btn ${isOutOfStock ? 'btn-disabled' : 'btn-primary'} gap-2`}
          >
            {isOutOfStock ? 'Sin stock' : addedFeedback ? '✓ Agregado' : <><FaCartPlus />Agregar al Carrito</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailContainer;
