# Tasks: entrega-final — Evolucionar pre-entrega a proyecto final

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~1200-1500 |
| 800-line budget risk | High |
| Chained PRs recommended | Yes |
| Delivery strategy | ask-on-risk |
| Chain strategy | stacked-to-main |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
800-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Firebase infra + Auth + Admin dashboard | PR 1 | New: config, Login, Register, AdminRoute, Dashboard, ProductForm. Modify: AuthContext, App.jsx, main.jsx |
| 2 | Catalog migration + Detail + Search + Pagination | PR 2 | Modify: ItemListContainer, ItemDetailContainer, Item. Adds search bar, pagination controls, Firestore reads |
| 3 | Design (Bootstrap grid, Nav hamburger, Footer styled-components, React Icons, Cart) | PR 3 | Modify: Layout, Nav, Footer, Cart, Item. Visual-only changes |
| 4 | SEO + Deploy + Docs | PR 4 | Modify: App.jsx/main.jsx (Helmet), vite.config.js, package.json, README |

## Phase 1: Foundation

- [x] 1.1 Install deps: `npm install firebase react-bootstrap styled-components react-icons react-helmet-async`
- [x] 1.2 Import Bootstrap CSS in `src/main.jsx`: add `import 'bootstrap/dist/css/bootstrap.min.css'`
- [x] 1.3 Create `src/firebase/config.js` with Firebase SDK init; export `auth` (getAuth) and `db` (getFirestore)

## Phase 2: Firebase Auth

- [x] 2.1 Modify `src/context/AuthContext.jsx`: integrate Firebase Auth (createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut). Track `user`, `isAuthenticated`, `isAdmin` (user?.email === 'admin@gmail.com'), `loading` state
- [x] 2.2 Create `src/pages/Login.jsx`: form with email/password, validation, error display, redirect on auth success
- [x] 2.3 Create `src/pages/Register.jsx`: form with email/password/confirm, validation, error display, auto-login on success
- [x] 2.4 Create `src/components/auth/AdminRoute.jsx`: guard — loading→spinner, !user→redirect /login, !isAdmin→redirect /, else→children
- [x] 2.5 Update `src/App.jsx`: add routes `/login`, `/register`, `/dashboard` (wrapped with AdminRoute)

## Phase 3: Admin Dashboard (Firestore CRUD)

- [x] 3.1 Create `src/pages/Dashboard.jsx`: product list from Firestore (onSnapshot), add/edit inline modal, delete with confirmation, loading spinner per operation
- [x] 3.2 Create `src/components/admin/ProductForm.jsx`: controlled form with title, price, description, image, stock, category; validation (title required, price > 0)
- [x] 3.3 Add delete confirmation modal in Dashboard before removing Firestore document
- [x] 3.4 Add React-Bootstrap Spinner + error alert for all CRUD operations in Dashboard

## Phase 4: Catalog Migration

- [x] 4.1 Modify `src/components/products/ItemListContainer.jsx`: fetch products from Firestore (getDocs or onSnapshot) instead of FakeStore API
- [x] 4.2 Add search bar in Nav: lift searchTerm to Layout, pass as prop to ItemListContainer; filter products by title (case-insensitive includes)
- [x] 4.3 Add pagination: slice filtered products, 8 per page, page controls (Previous/Next + page number)
- [x] 4.4 Add React-Bootstrap Spinner while loading + error state when Firestore read fails

## Phase 5: Product Detail

- [x] 5.1 Modify `src/components/detail/ItemDetailContainer.jsx`: read from Firestore by doc id, display stock and category fields alongside existing data
- [x] 5.2 Add loading spinner + "Producto no encontrado" state for invalid/missing ids

## Phase 6: Design & Responsive

- [x] 6.1 Modify `src/components/layouts/Layout.jsx`: wrap Outlet in React-Bootstrap Container with Row/Col layout
- [x] 6.2 Modify `src/components/layouts/Nav.jsx`: hamburger toggle button, conditional admin link (isAdmin), search input (controlled, lifts state), cart icon with badge count, React-Bootstrap Navbar
- [x] 6.3 Rewrite `src/components/layouts/Footer.jsx` with styled-components (styled.footer, styled.p)
- [x] 6.4 Add React Icons to buttons: FaCartShopping (cart nav), FaTrashCan (delete), FaPenToSquare (edit), FaMagnifyingGlass (search)
- [x] 6.5 Convert `src/pages/Cart.jsx` layout to styled-components: cart item cards, summary, responsive breakpoints

## Phase 7: SEO

- [x] 7.1 Add `<HelmetProvider>` wrapper in `src/main.jsx` (or `src/App.jsx`) — around the entire app
- [x] 7.2 Add `<Helmet>` with dynamic `<title>` and `<meta name="description">` in: Home (ItemListContainer), Product Detail, Cart, Login, Register, Dashboard

## Phase 8: Deploy & Docs

- [x] 8.1 Update `vite.config.js`: add `base: '/tp-final/'` for GitHub Pages asset resolution
- [x] 8.2 Add deploy script to `package.json`: `"deploy": "gh-pages -d dist"` (also `npm install gh-pages --save-dev` in 1.1)
- [x] 8.3 Update `README.md`: install, run, build, deploy instructions + admin credentials (admin@gmail.com / 1234)
