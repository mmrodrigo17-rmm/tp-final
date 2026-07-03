# Proposal: entrega-final — Evolucionar pre-entrega a proyecto final

Evolucionar la pre-entrega actual (FakeStore API + auth simulada) a una app completa con Firebase Auth, Firestore CRUD, diseño responsivo con React-Bootstrap + styled-components, búsqueda, paginación, panel admin y deploy a GitHub Pages.

---

## Scope

| En scope | Fuera de scope |
|----------|----------------|
| Firebase Auth (login/register) | Opiniones de productos (opcional) |
| Firestore CRUD (crear/editar/eliminar productos) | Tests unitarios (sin Vitest) |
| Panel admin protegido (`admin@gmail.com` / `1234`) | Backend propio (Firebase serverless) |
| React-Bootstrap grid + styled-components | Migración a TypeScript |
| React Icons en botones/interactivos | Cambio de arquitectura (Context API se mantiene) |
| React Helmet (SEO dinámico) | |
| Barra de búsqueda + paginación | |
| Menú hamburguesa responsive | |
| Spinners + manejo de errores visual | |
| README actualizado + deploy GitHub Pages | |

---

## Capabilities

### Nuevas
- **Auth real**: registro, login, logout con Firebase Auth. AuthContext existente se extiende con Firebase.
- **Admin Dashboard**: ruta `/dashboard` protegida. Admin ve CRUD de productos; usuario común NO.
- **Firestore CRUD**: productos desde Firestore. Formulario crear/editar con validaciones. Modal confirmación antes de eliminar.
- **Búsqueda en tiempo real**: barra de búsqueda filtra productos mientras se escribe.
- **Paginación**: paginador en catálogo de productos (ej. 8 por página).
- **Hamburger menu**: Nav se colapsa en mobile con toggle.
- **Spinners**: reemplazar `"Cargando..."` por spinners visuales (React-Bootstrap Spinner o styled).
- **SEO**: React Helmet setea `<title>` y `<meta>` por página.
- **Deploy**: build + deploy a GitHub Pages (gh-pages).

### Modificadas
- **ItemDetailContainer**: agrega stock y categoría al detalle.
- **CartContext**: se mantiene igual (ya funcional). Conecta a Firestore para stock check opcional.
- **Nav**: agrega hamburger menu + link a Dashboard (si es admin) + search bar.
- **README**: documentación completa de instalación, deploy, funcionalidades.

---

## Approach

| Paso | Acción |
|------|--------|
| 1. Dependencias | `npm install firebase react-bootstrap styled-components react-icons react-helmet-async gh-pages` |
| 2. Firebase setup | Crear proyecto Firebase, agregar config en `src/firebase/config.js`. Inicializar Auth + Firestore. |
| 3. AuthContext | Extender con Firebase Auth (createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged). Diferenciar admin por email fijo. |
| 4. Login/Register | Crear páginas `Login.jsx` + `Register.jsx` con formularios controlados y validación. |
| 5. AdminRoute | Nuevo guard que verifica `user.email === admin@gmail.com`. Redirige si no es admin. |
| 6. Dashboard | Ruta `/dashboard` con lista de productos desde Firestore. Botones crear/editar/eliminar. Modal confirmación para delete. |
| 7. ProductForm | Componente reutilizable para crear y editar productos. Validaciones (nombre requerido, precio > 0). |
| 8. ItemListContainer | Migrar fetch de FakeStore a lectura de Firestore. Agregar búsqueda (filtro local) + paginación. |
| 9. ItemDetailContainer | Agregar stock y categoría al render. |
| 10. Nav | Agregar hamburger toggle, link condicional a Dashboard, input de búsqueda. |
| 11. Diseño | Envolver app en React-Bootstrap container/grid. Refactorizar estilos inline a styled-components. Agregar React Icons. |
| 12. SEO | Envolver en HelmetProvider. Agregar `<Helmet>` en cada página. |
| 13. Spinners/Errores | Reemplazar textos de carga por Spinner. Styling uniforme para errores. |
| 14. Deploy | Configurar `vite.config.js` con `base: '/<repo>/'`. Script `deploy` con gh-pages. |
| 15. README | Documentar instalación, scripts, deploy, credenciales admin. |

---

## Affected Areas

```
src/
├── firebase/config.js         ← NUEVO
├── context/
│   └── AuthContext.jsx         ← MODIFICADO (Firebase Auth)
├── components/
│   ├── auth/
│   │   ├── ProtectedRoute.jsx  ← MODIFICADO (usa Firebase)
│   │   └── AdminRoute.jsx      ← NUEVO
│   ├── layouts/
│   │   ├── Nav.jsx             ← MODIFICADO (hamburger + search + admin link)
│   │   ├── Nav.module.css      ← MODIFICADO (responsive)
│   │   ├── Layout.jsx          ← MODIFICADO (HelmetProvider, Bootstrap grid)
│   │   └── Footer.jsx          ← MODIFICADO (styled-components)
│   ├── products/
│   │   ├── ItemListContainer.jsx ← MODIFICADO (Firestore + search + pagination)
│   │   └── Item.jsx            ← MODIFICADO (styled-components)
│   └── detail/
│       └── ItemDetailContainer.jsx ← MODIFICADO (stock + category + styled)
├── pages/
│   ├── Cart.jsx                ← MODIFICADO (styled-components)
│   ├── Login.jsx               ← NUEVO
│   ├── Register.jsx            ← NUEVO
│   └── Dashboard.jsx           ← NUEVO
├── App.jsx                     ← MODIFICADO (nuevas rutas)
├── main.jsx                    ← MODIFICADO (Bootstrap CSS import)
├── App.css / index.css         ← MODIFICADO (limpieza)
vite.config.js                  ← MODIFICADO (base para GH Pages)
README.md                       ← MODIFICADO (documentación)
```

---

## Riesgos

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Firebase setup incorrecto (reglas seguridad, config) | Auth/CRUD no funciona | Probar con reglas en modo test primero, luego endurecer |
| Firebase eliminado o sin plan | App muere en producción | Firestore Spark plan (gratuito) es suficiente para el proyecto |
| Romper CartContext existente al migrar | Carrito deja de funcionar | NO migrar CartContext a Firebase — mantener React state. Solo Auth migra a Firebase. |
| Sin tests, errores no detectados | Bugs en producción | Verificación manual contra especificación + build exitoso |
| styled-components + Bootstrap conflictos de estilos | Diseño inconsistente | Usar Bootstrap solo para grid/layout, styled-components para componentes específicos |

---

## Rollback Plan

1. **Git revert**: `git revert HEAD~N` donde N = commits de esta change (se planificarán commits atómicos por paso).
2. **Firebase**: eliminar proyecto Firebase o desactivar reglas. La app vuelve a FakeStore API.
3. **Dependencias**: `npm uninstall firebase react-bootstrap styled-components react-icons react-helmet-async gh-pages`.
4. **Archivos nuevos**: eliminar `src/firebase/`, `src/pages/Login.jsx`, `src/pages/Register.jsx`, `src/pages/Dashboard.jsx`, `src/components/auth/AdminRoute.jsx`.
5. **Archivos modificados**: restaurar desde git con `git checkout -- <file>`.

---

## Criterios de Éxito

- [ ] Login/register con Firebase Auth funciona. Admin (`admin@gmail.com` / `1234`) ve Dashboard; usuario común NO.
- [ ] CRUD Firestore: crear, leer, editar, eliminar productos con confirmación modal.
- [ ] Catálogo muestra productos desde Firestore con búsqueda y paginación.
- [ ] Detalle producto muestra: título, precio, descripción, imagen, stock, categoría.
- [ ] Carrito funcional: agregar, incrementar, decrementar, eliminar items, vaciar carrito.
- [ ] Diseño responsivo: menú hamburguesa en mobile, grilla Bootstrap adaptativa.
- [ ] React Icons visibles en botones e interactivos.
- [ ] Spinners reemplazan "Cargando..." en todas las vistas.
- [ ] Título y meta tags dinámicos por página (React Helmet).
- [ ] `npm run build` exitoso sin errores.
- [ ] Deploy a GitHub Pages accesible desde URL pública.
- [ ] README actualizado con instrucciones de instalación y deploy.
