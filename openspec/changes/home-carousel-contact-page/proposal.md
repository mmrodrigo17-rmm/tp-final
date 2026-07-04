# Proposal: Home Carousel + Contact Page

## Intent

Agregar un carrusel de productos destacados en la home y una página de contacto con formulario. Mejora la experiencia de navegación mostrando contenido visual atractivo en la landing page, y da un canal de comunicación básico sin requerir backend.

## Scope

### In Scope
- Carrusel con 4 productos aleatorios de Firestore en la ruta `/`
- Página `/contacto` con formulario y validación client-side
- Link "Contacto" en el Nav (visible para todos los usuarios)
- React-Bootstrap Carousel para el carrusel
- Formulario con validación (nombre, email, asunto, mensaje)

### Out of Scope
- Backend para el formulario (mailto: / console.log + alert)
- Administración de mensajes de contacto
- Carrusel en otras rutas
- Personalización de intervalos de auto-play

## Capabilities

### New Capabilities
- `home-carousel`: Carrusel de productos aleatorios en la página de inicio
- `contact-form`: Página de contacto con formulario validado

### Modified Capabilities
- `product-catalog`: La home ahora renderiza carrusel + grid, no solo grid

## Approach

1. **Home Carousel (`src/pages/Home.jsx`)**: Nueva página Home que combina carrusel + `ItemListContainer`. Usa `React-Bootstrap Carousel` con styled-components para el wrapper. Llama a Firestore (`getDocs` + `collection(db, 'productos')`) con una lógica similar a `ItemListContainer`, selecciona 4 aleatorios con `_.sampleSize` o Fisher-Yates shuffle inline. Renderiza el carrusel ANTES del grid.

2. **App.jsx**: Crear ruta `/` apuntando a `Home.jsx` en lugar de directamente a `ItemListContainer`. La ruta `/productos` sigue apuntando a `ItemListContainer` sin carrusel.

3. **Contact Page (`src/pages/Contacto.jsx`)**: Formulario con `Form` de React-Bootstrap, validación con estado local (required en nombre, email, mensaje). Submit: `console.log` datos + `alert("Mensaje enviado")`.

4. **Nav.jsx**: Agregar link `<NavBs.Link as={NavLink} to="/contacto">Contacto</NavBs.Link>` fuera del bloque admin (visible a todos).

5. **Estilos**: Styled-components para wrappers del carrusel y formulario, siguiendo el patrón de `Cart.jsx` y `Footer.jsx`.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/App.jsx` | Modified | Nueva ruta `/` → Home, ruta `/contacto` → Contacto |
| `src/pages/Home.jsx` | **New** | Página home con carrusel + ItemListContainer |
| `src/pages/Contacto.jsx` | **New** | Formulario de contacto con validación |
| `src/components/layouts/Nav.jsx` | Modified | Link "Contacto" agregado |
| `src/components/products/ItemListContainer.jsx` | Unchanged | Solo se reusa, no se modifica |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Firestore quota: doble lectura en home (carousel + grid) | Medium | El fetch del carrusel se hace inline y se reusa la data; si hay <4 productos se muestran los disponibles |
| mailto: no funciona en mobile sin cliente de correo configurado | Low | Se documenta en el spec que es comportamiento esperado sin backend |
| Estilos del Carousel de Bootstrap chocan con styled-components | Low | Usar styled-components para wrapper y className de Bootstrap para el inner; mismo pattern que Cart |
| Producto sin imagen rompe el carrusel | Low | Validar `product.image` antes de renderizar; fallback a placeholder |

## Rollback Plan

- Revertir cambios en `App.jsx` y `Nav.jsx` via `git checkout`
- Eliminar `src/pages/Home.jsx` y `src/pages/Contacto.jsx`
- Sin migración de datos ni cambios en Firestore — rollback inmediato

## Dependencies

- `react-bootstrap` Carousel ya disponible como dependencia
- Colección `productos` ya existente en Firestore
- Sin nuevas dependencias npm

## Success Criteria

- [ ] Home muestra carrusel con productos aleatorios antes del grid
- [ ] Carrusel funcional con flechas e indicadores
- [ ] Ruta `/contacto` accesible desde el Nav
- [ ] Formulario valida campos obligatorios y muestra alert en submit
- [ ] Sin errores de compilación (`npm run build`)
