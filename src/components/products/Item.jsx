import { Link } from 'react-router-dom';
import estilos from './Item.module.css';

const Item = ({ product }) => {
  return (
    <div className={estilos.card}>
      <Link to={`/producto/${product.id}`}>
        <img
          src={product.image}
          alt={product.title}
          className={estilos.image}
        />
      </Link>
      <Link to={`/producto/${product.id}`} style={{ textDecoration: 'none' }}>
        <h3 className={estilos.title}>
          {product.title?.substring(0, 30)}...
        </h3>
      </Link>
      <p className={estilos.price}>${product.price}</p>
      <Link to={`/producto/${product.id}`}>
        <button className={estilos.btnDetail}>Ver Detalle</button>
      </Link>
    </div>
  );
};

export default Item;
