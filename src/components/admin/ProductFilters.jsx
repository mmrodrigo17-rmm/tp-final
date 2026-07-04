import { useState, useMemo } from 'react';

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
    <div className="flex flex-col sm:flex-row gap-2 items-end">
      <div className="form-control w-full sm:w-1/2">
        <label className="label">
          <span className="label-text">Categoría</span>
        </label>
        <select
          value={category}
          onChange={handleCategoryChange}
          className="select select-bordered w-full"
          aria-label="Filtrar por categoría"
        >
          <option value="">Todas las categorías</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div className="form-control w-full sm:w-1/2">
        <label className="label">
          <span className="label-text">Stock mínimo</span>
        </label>
        <input
          type="number"
          min="0"
          value={minStock}
          onChange={handleStockChange}
          placeholder="Stock mínimo"
          className="input input-bordered w-full"
        />
      </div>
    </div>
  );
};

export default ProductFilters;