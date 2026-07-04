import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { getFirebaseErrorMessage } from '../utils/firebaseErrors';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validate()) return;

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/');
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
