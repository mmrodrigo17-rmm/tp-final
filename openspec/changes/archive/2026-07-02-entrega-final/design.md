# Design: entrega-final

## Technical Approach

Migrate the pre-entrega from FakeStore API + simulated auth to Firebase Auth + Firestore CRUD in 4 layers: (1) **infrastructure** — Firebase setup, deploy config; (2) **auth** — extend AuthContext with Firebase Auth; (3) **data** — replace FakeStore fetches with Firestore reads; (4) **UI** — responsive layout, search, pagination, SEO, spinners. CartContext stays untouched as React state.

## Architecture Decisions

| Decision | Choice | Alternatives | Rationale |
|----------|--------|-------------|-----------|
| Auth backend | Firebase Auth | Custom JWT, Auth0 | Requisito del proyecto, serverless, integración directa con Firestore |
| Cart state | React Context (local) | Firestore cart | Carrito local evita latencia, funciona offline, no requiere migración |
| Data source (products) | Firestore reads | FakeStore API (actual) | Requisito del proyecto; CRUD admin requiere base de datos propia |
| Search implementation | Client-side filter | Firestore queries | Dataset pequeño (<100 prods), latencia cero, no requiere índices compuestos |
| Pagination | Client-side slice | Firestore pagination (cursor) | Misma razón; simplicidad para el alcance del proyecto |
| Grid system | React-Bootstrap (Container/Row/Col) | CSS Grid (actual), Material UI | Requisito del proyecto; solo para layout, no para componentes |
| Component styling | styled-components | CSS Modules (actual), inline (actual) | Requisito del proyecto; reemplaza estilos inline del Footer, Cart, Item |
| SEO | react-helmet-async | react-helmet (sync) | react-helmet-async soporta Concurrent Mode, mejor para React 19 |
| Admin detection | Hardcoded email check | Firestore custom claims | Firebase custom claims requieren Firebase Admin SDK (servidor); hardcode es suficiente para el proyecto |
| Icons | react-icons (FaCartShopping, FiMenu, etc.) | SVG inline, Bootstrap Icons | Requisito del proyecto; librería liviana con íconos populares |
| Spinners | React-Bootstrap Spinner | styled-components spinner | Ya incluimos react-bootstrap, evita CSS duplicado |
| Build base path | `base: '/tp-final/'` | `base: '/'` | GitHub Pages sirve desde subdirectorio; `base` incorrecto rompe assets |

## Data Flow

```
                    ┌──────────────────────┐
                    │   Firebase Auth       │
                    │  (signIn, signUp,     │
                    │   onAuthStateChanged) │
                    └──────────┬───────────┘
                               │ user object
                               ▼
┌──────────┐     ┌──────────────────────┐     ┌─────────────────┐
│Firestore │────▶│   AuthContext        │────▶│ AdminRoute      │
│(products │     │  (isAuthenticated,   │     │ ProtectedRoute  │
│collection│     │   user, isAdmin,     │     └─────────────────┘
│          │     │   login, logout)     │
│          │     └──────────────────────┘         ┌─────────────────┐
│          │                                      │ CartContext     │
│          │     ┌──────────────────────┐         │ (local state,  │
│          │────▶│ ProductCatalog       │         │  no Firebase)  │
│          │     │ (readAll + client    │         └─────────────────┘
│          │     │  search + paginate)  │
│          │     └──────────────────────┘
│          │     ┌──────────────────────┐
│          │────▶│ ProductDetail        │
│          │     │ (getById)            │
│          │     └──────────────────────┘
│          │     ┌──────────────────────┐
│          │◄────│ Dashboard (admin)    │
│          │     │  create / update /   │
│          │     │  delete product      │
│          │     └──────────────────────┘
└──────────┘
```

- **Auth**: `onAuthStateChanged` listener in AuthContext → sets `user` + `isAdmin` (via email check) → drives `ProtectedRoute` / `AdminRoute` guards.
- **Products**: ItemListContainer reads all products from Firestore once → stores in local state → search filters in-memory → pagination slices by page.
- **Detail**: ItemDetailContainer reads single document by `id` from Firestore.
- **Admin**: Dashboard reads all products → CRUD operations write back to Firestore.
- **SEO**: Each page renders `<Helmet>` with unique title + description. `HelmetProvider` wraps at root.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/firebase/config.js` | Create | Firebase app init, export `auth` + `db` instances |
| `src/pages/Login.jsx` | Create | Login form with email/password, error display, redirect on success |
| `src/pages/Register.jsx` | Create | Register form with email/password, validation, auto-login |
| `src/pages/Dashboard.jsx` | Create | Admin CRUD: product table + create/edit modal + delete confirm |
| `src/pages/Dashboard.module.css` | Create | Dashboard-specific styles (table, form, modal) |
| `src/components/auth/AdminRoute.jsx` | Create | Guard: checks `user.email === 'admin@gmail.com'`, redirects to `/` or `/login` |
| `src/components/admin/ProductForm.jsx` | Create | Reusable form for create/edit product with validation |
| `src/context/AuthContext.jsx` | Modify | Add Firebase Auth: `signIn`, `signUp`, `signOut`, `onAuthStateChanged`, `user`, `isAdmin` |
| `src/components/auth/ProtectedRoute.jsx` | Modify | Use Firebase `user` instead of `isAuthenticated` boolean |
| `src/components/layouts/Nav.jsx` | Modify | Add hamburger toggle, search input, admin link, cart icon with count |
| `src/components/layouts/Nav.module.css` | Modify | Responsive styles for hamburger menu at <768px |
| `src/components/layouts/Layout.jsx` | Modify | Wrap content in React-Bootstrap Container; integrate search state |
| `src/components/layouts/Footer.jsx` | Modify | Rewrite with styled-components |
| `src/components/products/ItemListContainer.jsx` | Modify | Replace fetch with Firestore `onSnapshot`; add search + pagination |
| `src/components/products/Item.jsx` | Modify | Use styled-components for card styling |
| `src/components/detail/ItemDetailContainer.jsx` | Modify | Read from Firestore; add stock display, category, disable add-to-cart when stock=0 |
| `src/pages/Cart.jsx` | Modify | Use styled-components for cart item cards and summary |
| `src/App.jsx` | Modify | Add routes: `/login`, `/register`, `/dashboard`; wrap in HelmetProvider |
| `src/main.jsx` | Modify | Import Bootstrap CSS (`bootstrap/dist/css/bootstrap.min.css`) |
| `vite.config.js` | Modify | Add `base: '/tp-final/'` for GitHub Pages |
| `package.json` | Modify | Add dependencies + `"deploy": "gh-pages -d dist"` script |
| `.env.example` | Create | Template for Firebase config env vars |

## Component Tree

```
App (HelmetProvider)
└── AuthProvider (Firebase Auth)
    └── CartProvider
        └── BrowserRouter (basename="/tp-final")
            └── Routes
                ├── Layout (Container/Row/Col)
                │   ├── Nav
                │   │   ├── Brand logo
                │   │   ├── Hamburger toggle (mobile)
                │   │   ├── NavLinks: Inicio, Productos, Carrito, Dashboard (admin only)
                │   │   ├── Search input (controlled, lifts state)
                │   │   ├── Cart icon with badge count
                │   │   └── Login/Logout button
                │   ├── main > Outlet
                │   │   ├── index → ItemListContainer (Firestore + search + pagination)
                │   │   ├── /productos → ItemListContainer
                │   │   ├── /producto/:id → ItemDetailContainer (stock + category)
                │   │   ├── /carrito → ProtectedRoute > Cart
                │   │   ├── /login → Login
                │   │   ├── /register → Register
                │   │   └── /dashboard → AdminRoute > Dashboard (CRUD)
                │   └── Footer (styled-components)
                └── 404 → Helmet fallback title
```

## Interfaces / Contracts

### Firestore Schema — `products` collection

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | yes | Product name |
| `price` | number | yes | > 0 |
| `description` | string | yes | Full description |
| `image` | string | yes | URL to product image |
| `stock` | number | yes | >= 0 |
| `category` | string | yes | e.g. "Zapatillas", "Remeras" |
| `createdAt` | timestamp | auto | `serverTimestamp()` on create |

### AuthContext Contract (extended)

```js
{
  user: firebase.User | null,    // Firebase user object from onAuthStateChanged
  isAuthenticated: boolean,       // derived: !!user
  isAdmin: boolean,               // derived: user?.email === 'admin@gmail.com'
  loading: boolean,               // true while Firebase resolves initial auth state
  login: (email, password) => Promise,
  logout: () => Promise,
  register: (email, password) => Promise,
}
```

### AdminRoute Contract

```
Props: { children }
Behavior:
  - loading → render nothing or spinner
  - !user → <Navigate to="/login" />
  - user && !isAdmin → <Navigate to="/" />
  - user && isAdmin → render children
```

### Search State Flow

Search input lives in `Nav`, value is lifted to `Layout` via state-lifting pattern (or a lightweight search context). `ItemListContainer` reads the search value and filters `products` client-side with `String.includes()` (case-insensitive).

```
Nav (input) ──onChange──▶ Layout (searchTerm state) ──prop──▶ ItemListContainer (filter)
```

### Pagination Contract

```
Props to ItemListContainer: { searchTerm }
Internal state:
  currentPage: number (1-based)
  pageSize: 8
Derived:
  totalPages = Math.ceil(filteredProducts.length / pageSize)
  pageProducts = filteredProducts.slice((currentPage-1)*pageSize, currentPage*pageSize)
  searchTerm change resets currentPage to 1
```

## Open Questions

- **Firebase config**: Will the config be hardcoded or read from env vars? Spec does not mention `.env`. Hardcoding is simpler for this project scope; `.env.example` provided as optional.
- **Search scope**: Spec says "title" only. Confirm we do NOT search description/category. (Decision: title-only as specified.)
- **Bootstrap import**: Which Bootstrap version? `react-bootstrap` v2.x pairs with Bootstrap 5.x. Spec doesn't specify version — will use latest stable.
