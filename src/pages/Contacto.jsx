import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Contacto = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [asunto, setAsunto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!nombre.trim()) newErrors.nombre = 'El nombre es obligatorio.';
    if (!email.trim()) newErrors.email = 'El email es obligatorio.';
    else if (!EMAIL_REGEX.test(email)) newErrors.email = 'Formato de email inválido.';
    if (!mensaje.trim()) newErrors.mensaje = 'El mensaje es obligatorio.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setNombre('');
    setEmail('');
    setAsunto('');
    setMensaje('');
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setTimeout(() => {
      console.log({ nombre, email, asunto, mensaje });
      setShowSuccess(true);
      resetForm();
      setSubmitting(false);
    }, 300);
  };

  return (
    <Container className="py-4">
      <Helmet>
        <title>Mi Tienda — Contacto</title>
      </Helmet>

      <Row className="justify-content-center">
        <Col md={6}>
          <h2>Contacto</h2>
          <p className="text-muted">Completá el formulario y te responderemos a la brevedad.</p>

          {showSuccess && (
            <Alert
              variant="success"
              dismissible
              onClose={() => setShowSuccess(false)}
            >
              Mensaje enviado con éxito
            </Alert>
          )}

          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="nombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={nombre}
                isInvalid={!!errors.nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                {errors.nombre}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                isInvalid={!!errors.email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="asunto">
              <Form.Label>Asunto <span className="text-muted">(opcional)</span></Form.Label>
              <Form.Control
                type="text"
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="mensaje">
              <Form.Label>Mensaje</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={mensaje}
                isInvalid={!!errors.mensaje}
                onChange={(e) => setMensaje(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                {errors.mensaje}
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? 'Enviando...' : 'Enviar'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Contacto;
