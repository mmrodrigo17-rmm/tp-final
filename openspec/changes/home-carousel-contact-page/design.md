# Design: Home Carousel + Contact Page

**Change**: `home-carousel-contact-page`

---

## 1. Home.jsx (nuevo)

### Component Tree

```
<Helmet>
  <title>Mi Tienda — Inicio</title>
</Helmet>

{loading && <Spinner />}
{error && null}     ← carrusel oculto, ItemListContainer renderiza igual
{!loading && !error && (
  <CarouselWrapper>                ← styled-component (altura fija)
    <Carousel>                     ← react-bootstrap
      {products.map(p => (
        <Carousel.Item key={p.id}>
          <SlideImage src={p.image || PLACEHOLDER} alt={p.title} />  ← styled
          <Carousel.Caption>
            <CaptionGradient />     ← styled (gradiente superpuesto)
            <CaptionContent>
              <h3>{p.title}</h3>
              <p>${p.price}</p>
            </CaptionContent>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  </CarouselWrapper>
)}

<ItemListContainer />   ← se renderiza siempre, maneja su propio estado
```

### Data Flow

| What | How |
|------|-----|
| Product list (full) | `getDocs(collection(db, 'productos'))` dentro de un `useEffect` en mount |
| Random subset | Fisher-Yates shuffle sobre el array completo, tomar `slice(0, 4)` |
| Placeholder image | Si `product.image` es falsy, usar URL de placeholder (`https://via.placeholder.com/800x400?text=Sin+Imagen`) |
| Search term (para ItemListContainer) | Via `useOutletContext()` — el Layout lo provee |

### State Management

| State | Type | Initial | Description |
|-------|------|---------|-------------|
| `products` | `Array<{id, title, price, image, ...}>` | `[]` | Productos completos desde Firestore |
| `loading` | `boolean` | `true` | Mientras se resuelve la promesa |
| `error` | `string \| null` | `null` | Mensaje de error si falla Firestore |

No hay estado adicional para el carrusel — React-Bootstrap `<Carousel />` maneja su propio estado interno de slide activo con `Carousel.Item`.

### Styled Components (en `Home.jsx` o `Home.styles.js`)

```jsx
const CarouselWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto 2rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);

  .carousel,
  .carousel-inner,
  .carousel-item {
    height: 400px;

    @media (max-width: 768px) {
      height: 250px;
    }
  }
`;
// Propósito: contenedor que fija la altura del carrusel y evita layout shift
// entre slides con distintas relaciones de aspecto.

const SlideImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;

  @media (max-width: 768px) {
    height: 250px;
  }
`;
// Propósito: que todas las imágenes ocupen exactamente el alto del carrusel
// sin distorsión, recortando con cover.

const CaptionGradient = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(transparent, rgba(0,0,0,0.75));
  pointer-events: none;
`;
// Propósito: gradiente oscuro que asegura legibilidad del título y precio
// contra cualquier fondo de imagen.

const StyledCaption = styled(Carousel.Caption)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem 1rem 1.5rem;
  text-align: left;
  z-index: 1;

  h3 {
    font-size: 1.4rem;
    font-weight: 700;
    margin: 0;
    text-shadow: 0 1px 4px rgba(0,0,0,0.5);

    @media (max-width: 768px) { font-size: 1rem; }
  }

  p {
    font-size: 1.2rem;
    margin: 0.25rem 0 0;
    font-weight: 600;
    color: #ffc107;

    @media (max-width: 768px) { font-size: 1rem; }
  }
`;
// Propósito: contenido superpuesto con estilo propio, sin depender de los
// defaults de Bootstrap.
```

### Responsive Behavior

| Breakpoint | Carousel height | Caption font |
|------------|----------------|--------------|
| > 768px | 400px | Normal |
| ≤ 768px | 250px | Reducido (ver styled-components) |

El carrusel usa `max-width: 900px` centrado con `margin: auto`. En mobile el contenedor ocupa el ancho completo del `Container fluid` del Layout.

### Edge Cases

| Caso | Comportamiento |
|------|---------------|
| **Menos de 4 productos** | Fisher-Yates sobre el array, `take = Math.min(4, products.length)`. Se renderizan N slides sin errores. |
| **0 productos** | `loading = false`, `products = []`, no se renderiza carrusel, solo `<ItemListContainer />`. |
| **Error de Firestore** | `setError(msg)`, no se renderiza `<CarouselWrapper>`. `<ItemListContainer />` se renderiza igual (maneja su propio error). |
| **Producto sin `image`** | `product.image || PLACEHOLDER_URL`. El placeholder se muestra con `object-fit: cover`. |
| **Producto sin `title` / `price`** | Se usa optional chaining `product.title`, `product.price`. Si faltan, se muestran strings vacíos. |

---

## 2. Contacto.jsx (nuevo)

### Component Tree

```
<Container className="py-4">
  <Helmet>
    <title>Mi Tienda — Contacto</title>
  </Helmet>

  <Row className="justify-content-center">
    <Col md={6}>
      <h2>Contacto</h2>
      <p className="text-muted">Completá el formulario y te responderemos a la brevedad.</p>

      {showSuccess && <Alert variant="success">Mensaje enviado con éxito</Alert>}

      <Form noValidate onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="nombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            value={nombre}
            isInvalid={!!errors.nombre}
            onChange={...}
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
            onChange={...}
          />
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="asunto">
          <Form.Label>Asunto</Form.Label>
          <Form.Control
            type="text"
            value={asunto}
            onChange={...}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="mensaje">
          <Form.Label>Mensaje</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={mensaje}
            isInvalid={!!errors.mensaje}
            onChange={...}
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
```

### Data Flow

| What | How |
|------|-----|
| Form state | `useState` local — NO hay llamada externa |
| Submit | `console.log({ nombre, email, asunto, mensaje })` + mostrar Alert + reset |
| No hay backend | Feedback 100% visual |

### State Management

| State | Type | Initial | Description |
|-------|------|---------|-------------|
| `nombre` | `string` | `''` | Valor del campo |
| `email` | `string` | `''` | Valor del campo |
| `asunto` | `string` | `''` | Valor del campo |
| `mensaje` | `string` | `''` | Valor del campo |
| `errors` | `{ nombre?: string, email?: string, mensaje?: string }` | `{}` | Mensajes de error por campo |
| `showSuccess` | `boolean` | `false` | Controla visibilidad del Alert success |
| `submitting` | `boolean` | `false` | Previene doble submit (se usa con un breve timeout simulado) |

Validación en `handleSubmit`:
```js
const validate = () => {
  const newErrors = {};
  if (!nombre.trim()) newErrors.nombre = 'El nombre es obligatorio.';
  if (!email.trim()) newErrors.email = 'El email es obligatorio.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Formato de email inválido.';
  if (!mensaje.trim()) newErrors.mensaje = 'El mensaje es obligatorio.';
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

### Estado "submitting" — por qué existe

Aunque no haya backend, el `submitting` state tiene dos propósitos:
1. **UX**: deshabilita el botón mientras se "procesa", evitando doble click accidental.
2. **Extensibilidad**: si en el futuro se agrega un `fetch()` real, el estado ya está contemplado.

En la implementación, `handleSubmit` hace:
```
setSubmitting(true);
setTimeout(() => {   ← simula latencia mínima
  console.log(...);
  setShowSuccess(true);
  resetForm();
  setSubmitting(false);
}, 300);
```

### Styled Components

No se requieren styled-components para Contacto.jsx — todo el layout y los estilos se resuelven con componentes de React-Bootstrap (`Container`, `Row`, `Col`, `Form`, `Button`, `Alert`). Si se desea un estilo más cuidado, se puede agregar un wrapper opcional:

```jsx
const ContactWrapper = styled.div`
  h2 { margin-bottom: 1.5rem; }
  form { margin-top: 1.5rem; }
`;
```

Pero no es obligatorio para cumplir la spec.

### Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| ≥ md (768px) | Formulario centrado ocupando 6 columnas (`Col md={6}`) |
| < md | El `Col` ocupa 12 columnas (full width) de forma natural |

El `Container` de Bootstrap ya provee padding lateral automático.

### Edge Cases

| Caso | Comportamiento |
|------|---------------|
| **Submit con campos vacíos** | `validate()` retorna `false`, se muestran errores inline en nombre, email y mensaje. El Alert success NO aparece. |
| **Email inválido** | Regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` rechaza strings sin `@` o sin dominio. Ej: `invalido` → error. |
| **Asunto vacío** | No es obligatorio según spec CF-3. Se envía como string vacío. |
| **Submit exitoso** | `console.log` con los datos, `setShowSuccess(true)`, reseteo de todos los campos y errores. |
| **Doble click en submit** | Botón deshabilitado mientras `submitting === true`. |

---

## 3. Modificaciones a Archivos Existentes

### 3.1 App.jsx

```
import Home from './pages/Home';          ← NUEVO
import Contacto from './pages/Contacto';   ← NUEVO

<Route index element={<Home />} />                  ← CAMBIO: antes era <ItemListContainer />
<Route path="productos" element={<ItemListContainer />} />
<Route path="contacto" element={<Contacto />} />     ← NUEVO
```

### 3.2 Nav.jsx

Agregar después del link "Productos" y antes del link "Carrito":

```jsx
<NavBs.Link as={NavLink} to="/contacto">
  Contacto
</NavBs.Link>
```

**Ubicación exacta:** entre el bloque de Productos (línea 23) y Carrito (línea 24). Esto lo mantiene en la sección pública, visible para todos los usuarios (autenticados o anónimos), antes de la sección de auth.

No requiere cambios de import — `NavLink` ya está importado, `Nav as NavBs` también.

---

## 4. Decisiones Técnicas y Tradeoffs

| Decisión | Alternativa | Por qué |
|----------|-------------|---------|
| **Home.jsx y ItemListContainer fetch ambos de Firestore** | Pasar productos como props de Home a ItemListContainer | La spec dice HC-4 que ItemListContainer debe renderizar debajo SIN modificarlo. Mantenerlo independiente evita acoplar ambos componentes y preserva el comportamiento existente en `/productos`. La doble lectura es aceptable para este volumen de datos. |
| **asunto no tiene validación** | Hacerlo requerido | La spec CF-3 explícitamente solo marca nombre, email y mensaje como requeridos. asunto queda como opcional. |
| **Fisher-Yates inline** | `lodash.shuffle` | Evita agregar una dependencia para una función de 5 líneas. El shuffle se implementa como helper local. |
| **Submitting con setTimeout** | Submit instantáneo | El timeout de 300ms da feedback visual al usuario y previene doble click. Si se agrega backend después, se reemplaza por un `await fetch()`. |

---

## 5. Resumen de Archivos

| Archivo | Acción | Líneas estimadas |
|---------|--------|-----------------|
| `src/pages/Home.jsx` | **CREAR** | ~90 |
| `src/pages/Contacto.jsx` | **CREAR** | ~120 |
| `src/App.jsx` | **MODIFICAR** | +4 (imports + rutas) |
| `src/components/layouts/Nav.jsx` | **MODIFICAR** | +3 (link Contacto) |
