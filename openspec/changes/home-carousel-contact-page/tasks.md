# Tasks: Home Carousel + Contact Page

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~217 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Delivery strategy | single-pr |
| Chain strategy | size-exception |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Home + Contacto + routing | PR 1 | Single PR. base = main |

## Phase 1: New Pages

- [x] **T1** — `src/pages/Home.jsx` | CREAR | ~90 líneas
  Fetch productos desde Firestore en mount via `getDocs(collection(db, 'productos'))`. Fisher-Yates shuffle para seleccionar 4 aleatorios (o `Math.min(4, products.length)`). React-Bootstrap `<Carousel>` con styled-components: altura fija 400px (250px mobile), gradiente oscuro en caption, `object-fit: cover` en imágenes, placeholder via `https://via.placeholder.com/800x400?text=Sin+Imagen` si falta `image`. Renderiza `<ItemListContainer />` debajo sin modificarlo. `<Spinner>` mientras carga — si hay error no se renderiza el carrusel. `<Helmet>` con title "Mi Tienda — Inicio". Sin dependencias.

- [x] **T2** — `src/pages/Contacto.jsx` | CREAR | ~120 líneas
  Formulario React-Bootstrap: nombre (text, requerido), email (email, requerido + formato), asunto (text, opcional), mensaje (textarea, requerido). Validación inline con `isInvalid` y `Form.Control.Feedback`. En submit válido: `console.log({...})`, `<Alert variant="success">` con "Mensaje enviado con éxito", reset de todos los campos y errores. `submitting` state con `setTimeout(300ms)` para deshabilitar botón y prevenir doble click. Layout: `Container > Row justify-content-center > Col md={6}`. `<Helmet>` con title "Mi Tienda — Contacto". Sin dependencias.

## Phase 2: Wiring

- [x] **T3** — `src/App.jsx` | MODIFICAR | +4 líneas
  Importar `Home` desde `./pages/Home` y `Contacto` desde `./pages/Contacto`. Cambiar `<Route index element={<ItemListContainer />} />` → `<Route index element={<Home />} />`. Agregar `<Route path="contacto" element={<Contacto />} />` antes de la ruta `carrito`. Depende de T1 y T2.

- [x] **T4** — `src/components/layouts/Nav.jsx` | MODIFICAR | +3 líneas
  Agregar `<NavBs.Link as={NavLink} to="/contacto">Contacto</NavBs.Link>` entre el link de Productos (línea 23) y el de Carrito (línea 24). Sin nuevas importaciones necesarias. Sin dependencias.

## Phase 3: Verification

- [x] **T5** — Verificar build | ~0 líneas
  Ejecutar `npm run build` y confirmar que compila sin errores. Verificar acceptance criteria: carrusel con productos aleatorios, manejo de <4 productos sin error, error de Firestore oculta carrusel, formulario valida inline, success Alert + reset, link "Contacto" visible en Nav para todos los usuarios. Depende de T3 y T4.
