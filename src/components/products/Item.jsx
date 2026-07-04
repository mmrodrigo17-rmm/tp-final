import { Link } from 'react-router-dom';

const Item = ({ product }) => {
  return (
    <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
      <img src={product.image} alt={product.title} style={{ height: '150px', objectFit: 'contain' }} />
      <h3 style={{ fontSize: '1.1rem', margin: '10px 0' }}>{product.title.substring(0, 30)}...</h3>
      <p>${product.price}</p>
      <Link to={`/producto/${product.id}`}>
        <button style={{ padding: '10px', cursor: 'pointer' }}>Ver Detalle</button>
      </Link>
    </div>
  );
};

export default Item;
