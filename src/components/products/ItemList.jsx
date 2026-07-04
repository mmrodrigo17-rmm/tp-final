import Item from './Item';
import estilos from './ItemList.module.css';

const ItemList = ({ productos }) => {
  return (
    <section className={estilos.grid}>
      {productos.map((product) => (
        <Item key={product.id} product={product} />
      ))}
    </section>
  );
};

export default ItemList;
