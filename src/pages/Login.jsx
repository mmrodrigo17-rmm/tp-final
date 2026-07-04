import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

// Mapeo de códigos de error de Firebase Auth a mensajes en español rioplatense
const getFirebaseErrorMessage = (error) => {
  const messages = {
    'auth/invalid-email': 'El correo electrónico no es válido',
    'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
    'auth/user-not-found': 'No se encontró un usuario con ese correo',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/invalid-credential': 'Credenciales inválidas. Verificá tu correo y contraseña',
    'auth/too-many-requests': 'Demasiados intentos. Probá de nuevo más tarde',
    'auth/network-request-failed': 'Error de conexión. Verificá tu internet',
  };
  return messages[error.code] || 'Ocurrió un error inesperado. Intentá de nuevo';
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Estado del formulario
  const [formData, setFormData] = useState({ email: '', password: '' });
  // Errores de validación por campo
  const [errors, setErrors] = useState({});
  // Error global del formulario (errores de Firebase)
  const [submitError, setSubmitError] = useState('');
  // Estado de carga mientras se procesa el login
  const [loading, setLoading] = useState(false);

  // Valido los campos del formulario antes de enviar
  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejo los cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpio el error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Manejo el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validate()) return;

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/'); // Redirijo al inicio tras login exitoso
    } catch (error) {
      setSubmitError(getFirebaseErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Helmet>
        <title>Iniciar Sesión — Mi Tienda</title>
      </Helmet>
      <Row className="justify-content-center mt-5">
        <Col xs={12} md={6} lg={4}>
          <h2 className="mb-4">Iniciar Sesión</h2>

          {submitError && <Alert variant="danger">{submitError}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
                placeholder="tu@correo.com"
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                isInvalid={!!errors.password}
                placeholder="Tu contraseña"
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit" disabled={loading} className="w-100">
              {loading ? (
                <>
                  <Spinner size="sm" animation="border" className="me-2" />
                  Ingresando...
                </>
              ) : 'Ingresar'}
            </Button>
          </Form>

          <p className="mt-3 text-center">
            ¿No tenés cuenta? <Link to="/register">Registrate</Link>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
