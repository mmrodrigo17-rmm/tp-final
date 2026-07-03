import { useState, useEffect } from 'react';

const ProductForm = ({ initialData, onSave, onCancel, loading }) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    image: '',
    stock: '',
    category: ''
  });
  // Errores de validación
  const [errors, setErrors] = useState({});

  // Cuando edito un producto existente, cargo sus datos en el formulario
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        price: initialData.price?.toString() || '',
        description: initialData.description || '',
        image: initialData.image || '',
        stock: initialData.stock?.toString() || '',
        category: initialData.category || ''
      });
    }
  }, [initialData]);

  // Valido los campos antes de enviar
  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'El título es obligatorio';
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }
    if (formData.stock !== '' && parseInt(formData.stock) < 0) {
      newErrors.stock = 'El stock no puede ser negativo';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejo cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Manejo el envío
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      title: formData.title.trim(),
      price: parseFloat(formData.price),
      description: formData.description.trim(),
      image: formData.image.trim(),
      stock: formData.stock !== '' ? parseInt(formData.stock) : 0,
      category: formData.category.trim()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Título */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Título <span className="text-error">*</span></span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Nombre del producto"
          className={`input input-bordered w-full ${errors.title ? 'input-error' : ''}`}
        />
        {errors.title && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.title}</span>
          </label>
        )}
      </div>

      {/* Precio y Stock */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Precio <span className="text-error">*</span></span>
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className={`input input-bordered w-full ${errors.price ? 'input-error' : ''}`}
          />
          {errors.price && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.price}</span>
            </label>
          )}
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Stock</span>
          </label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="0"
            min="0"
            className={`input input-bordered w-full ${errors.stock ? 'input-error' : ''}`}
          />
          {errors.stock && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.stock}</span>
            </label>
          )}
        </div>
      </div>

      {/* Descripción */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Descripción</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          placeholder="Descripción del producto"
          className="textarea textarea-bordered w-full"
        />
      </div>

      {/* URL de Imagen */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">URL de Imagen</span>
        </label>
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="https://ejemplo.com/imagen.jpg"
          className="input input-bordered w-full"
        />
      </div>

      {/* Categoría */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Categoría</span>
        </label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Ej: Electrónica, Ropa, Hogar"
          className="input input-bordered w-full"
        />
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm me-2"></span>
              Guardando...
            </>
          ) : initialData ? (
            'Guardar Cambios'
          ) : (
            'Crear Producto'
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;