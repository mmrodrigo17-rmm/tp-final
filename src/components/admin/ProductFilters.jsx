import { useState, useMemo } from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const ProductFilters = ({ products, onFilter }) => {
  const [category, setCategory] = useState('');
  const [minStock, setMinStock] = useState('');

  const categories = useMemo(() => {
    const unique = [...new Set(products.map(p => p.category).filter(Boolean))];
    return unique.sort();
  }, [products]);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);
    onFilter({ category: value, minStock });
  };

  const handleStockChange = (e) => {
    const value = e.target.value;
    setMinStock(value);
    onFilter({ category, minStock: value });
  };

  return (
    <Row className="g-2 align-items-end">
      <Col>
        <Form.Select value={category} onChange={handleCategoryChange} aria-label="Filtrar por categoría">
          <option value="">Todas las categorías</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </Form.Select>
      </Col>
      <Col>
        <Form.Control
          type="number"
          min="0"
          value={minStock}
          onChange={handleStockChange}
          placeholder="Stock mínimo"
        />
      </Col>
    </Row>
  );
};

export default ProductFilters;
