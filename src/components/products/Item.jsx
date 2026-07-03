// Importo el componente Link de React Router. 
// Esto es fundamental para la navegación interna (Single Page Application): me permite cambiar de ruta 
// sin que el navegador haga una recarga completa de la página.
import { Link } from 'react-router-dom';

// Creo mi componente funcional Item. 
// En lugar de recibir "props" y usar "props.product", aplico desestructuración directamente 
// en los parámetros para extraer el objeto "product" que me envía el componente padre (ItemListContainer).
const Item = ({ product }) => {
  return (
    // Contenedor principal de la tarjeta (card) del producto.
    // Le aplico unos estilos en línea básicos para darle un borde sutil, esquinas redondeadas y centrar el contenido.
    <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
      
      {/* Renderizo la imagen del producto obtenida de la API.
          El atributo "objectFit: 'contain'" es clave aquí: garantiza que la imagen se adapte 
          a los 150px de altura sin deformarse ni recortarse. */}
      <img src={product.image} alt={product.title} style={{ height: '150px', objectFit: 'contain' }} />
      
      {/* Renderizo el título del producto.
          Como la FakeStore API a veces devuelve títulos larguísimos que rompen el diseño de la grilla,
          uso el método substring(0, 30) de JavaScript para mostrar solo los primeros 30 caracteres 
          y le concateno unos puntos suspensivos (...) para indicar que el texto continúa. */}
      <h3 style={{ fontSize: '1.1rem', margin: '10px 0' }}>{product.title.substring(0, 30)}...</h3>
      
      {/* Muestro el precio interpolando el valor que viene de la API */}
      <p>${product.price}</p>
      
      {/* Aquí entra en juego el ruteo dinámico. 
          Envuelvo el botón dentro del <Link>. Uso template literals (los backticks o comillas invertidas ``) 
          para construir dinámicamente la URL. 
          Por ejemplo, si el producto tiene el id 3, el Link me llevará a la ruta "/producto/3". */}
      <Link to={`/producto/${product.id}`}>
        <button style={{ padding: '10px', cursor: 'pointer' }}>Ver Detalle</button>
      </Link>
      
    </div>
  );
};

// Exporto el componente por defecto para poder importarlo en otros archivos de forma sencilla.
export default Item;