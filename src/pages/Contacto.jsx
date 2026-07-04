import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Form, Button, Alert } from 'react-bootstrap';

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: '',
  });
  const [errors, setErrors] = useState({});
  const [enviado, setEnviado] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Formato de email inválido';
    }
    if (!formData.mensaje.trim()) {
      newErrors.mensaje = 'El mensaje es obligatorio';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setEnviado(true);
    setFormData({ nombre: '', email: '', asunto: '', mensaje: '' });
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '1rem' }}>
      <Helmet>
        <title>Contacto — Mi Tienda</title>
        <meta
          name="description"
          content="Comunicate con Mi Tienda Monumental"
        />
      </Helmet>

      <h2 style={{ color: 'var(--heading)' }}>Contacto</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Dejanos tu mensaje y te respondemos a la brevedad.
      </p>

      {enviado && (
        <Alert variant="success" dismissible onClose={() => setEnviado(false)}>
          ¡Mensaje enviado con éxito! Te vamos a responder pronto.
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>
            Nombre <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            isInvalid={!!errors.nombre}
            placeholder="Tu nombre"
          />
          <Form.Control.Feedback type="invalid">
            {errors.nombre}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>
            Email <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            isInvalid={!!errors.email}
            placeholder="tu@email.com"
          />
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Asunto <span className="text-muted">(opcional)</span></Form.Label>
          <Form.Control
            type="text"
            name="asunto"
            value={formData.asunto}
            onChange={handleChange}
            placeholder="¿Sobre qué querés hablar?"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>
            Mensaje <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            isInvalid={!!errors.mensaje}
            placeholder="Escribí tu mensaje acá..."
          />
          <Form.Control.Feedback type="invalid">
            {errors.mensaje}
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit">
          Enviar Mensaje
        </Button>
      </Form>
    </div>
  );
};

export default Contacto;
