import { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';

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
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>
          Título <span className="text-danger">*</span>
        </Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          isInvalid={!!errors.title}
          placeholder="Nombre del producto"
        />
        <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
      </Form.Group>

      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>
              Precio <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              isInvalid={!!errors.price}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              isInvalid={!!errors.stock}
              placeholder="0"
              min="0"
            />
            <Form.Control.Feedback type="invalid">{errors.stock}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Descripción</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descripción del producto"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>URL de Imagen</Form.Label>
        <Form.Control
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="https://ejemplo.com/imagen.jpg"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Categoría</Form.Label>
        <Form.Control
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Ej: Electrónica, Ropa, Hogar"
        />
      </Form.Group>

      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner size="sm" animation="border" className="me-2" />
              Guardando...
            </>
          ) : initialData ? (
            'Guardar Cambios'
          ) : (
            'Crear Producto'
          )}
        </Button>
      </div>
    </Form>
  );
};

export default ProductForm;
