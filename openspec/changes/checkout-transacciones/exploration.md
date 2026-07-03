## Exploration: checkout-transacciones

### Current State

#### Cart (`src/pages/Cart.jsx`)
- Uses `useCart()` → `{ cart, increaseQuantity, decreaseQuantity, removeItem, clearCart }`
- The **"Finalizar Compra"** button (`<CheckoutButton $variant="success">`) has **NO `onClick` handler** — it's purely decorative
- `totalPrice` is calculated via `cart.reduce((acc, item) => acc + item.price * item.quantity, 0)`
- Cart items structure: `{ id, title, price, image, quantity }` (+ any other product fields from Firestore)
- Route `/carrito` is wrapped in `<ProtectedRoute>` — user MUST be authenticated
- Does **NOT** use `useAuth()` — no access to current user
- Uses styled-components for styling

#### Dashboard (`src/pages/Dashboard.jsx`)
- Single section: ABM de productos (Create, Read, Update, Delete) on Firestore `productos` collection
- Uses React-Bootstrap: `Table`, `Modal`, `Spinner`, `Alert`, `Button`
- No transaction listing, no filters
- CRUD pattern: `getDocs(collection(db, 'productos'))`, `addDoc`, `updateDoc`, `deleteDoc`
- Product fields in table: Imagen, Título, Precio, Stock, Categoría, Acciones
- Route `/dashboard` is wrapped in `<AdminRoute>`

#### AuthContext (`src/context/AuthContext.jsx`)
- Provides: `user` (Firebase Auth user object), `isAuthenticated`, `isAdmin`, `loading`, `login`, `register`, `logout`
- Admin check: `user?.email === 'admin@gmail.com'`
- Loading state prevents FOUC on route guards

#### CartContext (`src/context/CartContext.jsx`)
- Pure React state — no Firestore persistence
- Functions: `addToCart`, `increaseQuantity`, `decreaseQuantity`, `removeItem`, `clearCart`
- Cart is lost on page refresh (no localStorage, no Firestore)

#### Firebase Config (`src/firebase/config.js`)
- Exports `auth` (getAuth) and `db` (getFirestore)
- Only `productos` collection exists — **no `transacciones` collection yet**

#### Route Structure (`src/App.jsx`)
```
<AuthProvider>
  <CartProvider>
    <BrowserRouter basename="/tp-final">
      <Route path="/" element={<Layout />}>
        <Route index element={<ItemListContainer />} />
        <Route path="productos" element={<ItemListContainer />} />
        <Route path="producto/:id" element={<ItemDetailContainer />} />
        <Route path="carrito" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
      </Route>
    </BrowserRouter>
  </CartProvider>
</AuthProvider>
```

#### Layout (`src/components/layouts/Layout.jsx`)
- Uses `<Outlet context={{ searchTerm, setSearchTerm }} />` to pass search state
- Cart and Dashboard already nested under Layout

#### Existing Filter Patterns
- **Product search**: `ItemListContainer.jsx` filters products client-side by `product.title` matching `searchTerm` (from Layout via `useOutletContext`)
- **Pagination**: 8 items per page with prev/next buttons
- No category, price, or other advanced filters exist

---

### Affected Areas

| File | Why affected |
|------|-------------|
| `src/pages/Cart.jsx` | Add checkout logic: import `useAuth`, write transaction to Firestore, call `clearCart`, show feedback |
| `src/pages/Dashboard.jsx` | Add transactions listing section with table, filters; add tabs/layout to switch between products and transactions |
| `src/context/CartContext.jsx` | May expose cart snapshot for checkout (or checkout stays in Cart.jsx) |
| `src/firebase/config.js` | No changes needed — `db` already exported, `transacciones` collection created at write time |
| `src/App.jsx` | No route changes needed — Dashboard already protected |
| `src/components/admin/ProductForm.jsx` | No changes — already handles product CRUD |
| `src/components/products/ItemListContainer.jsx` | Pattern reference for filter implementation |

---

### Approaches

#### 1. Transaction Data Model

**Single recommended model** for the `transacciones` Firestore collection:

```
transacciones/{docId}
  userId: string        // Firebase Auth UID
  userEmail: string     // email at time of purchase (denormalized)
  items: array<{
    id: string
    title: string
    price: number
    quantity: number
    image: string
  }>
  total: number         // pre-calculated total
  status: string        // 'completada' | 'pendiente' | 'cancelada'
  createdAt: Timestamp  // Firestore serverTimestamp()
  updatedAt: Timestamp  // Firestore serverTimestamp() — for status changes
```

- Pros: Denormalized items means the transaction is immutable and self-contained. `createdAt` enables date-range filtering. `status` enables state filtering.
- Cons: Data duplication with products collection (intentional — transaction must survive product changes).

#### 2. Checkout Flow

**Option A: Service function + direct call in Cart** _(Recommended)_

- Create `src/services/checkoutService.js` with `createTransaction(db, userId, userEmail, cartItems, total)` function
- In `Cart.jsx`: import `useAuth()`, import `createTransaction`, call it on button click, await success → `clearCart()` → show success feedback

| Pros | Cons | Effort |
|------|------|--------|
| Clean separation: checkout logic isolated | Cart.jsx grows slightly | Low |
| Reusable if checkout is needed elsewhere | Firestore dependency in service layer | |
| Follows existing pattern (no extra abstractions) | | |

**Option B: Custom `useCheckout` hook**

- Create `src/hooks/useCheckout.js` that combines `useAuth()` + `useCart()` + Firestore

| Pros | Cons | Effort |
|------|------|--------|
| Cleanest separation | New hook file | Low-Med |
| Easy to test/mock | Overhead for single-use case | |

**Option C: Add checkout to CartContext**

- Add `checkout()` function inside CartContext that receives `user` as param

| Pros | Cons | Effort |
|------|------|--------|
| Keeps cart domain together | CartContext should not know about auth | Low |
| | CartContext already doesn't touch Firebase — adding it breaks consistency | |

#### 3. Dashboard Layout

**Option A: React-Bootstrap Tabs** _(Recommended)_

- Use `<Tabs>` / `<Tab>` from `react-bootstrap` to switch between "Productos" and "Transacciones"
- Products tab keeps existing ABM. Transactions tab shows new table + filters.

| Pros | Cons | Effort |
|------|------|--------|
| Already have react-bootstrap dependency | Both sections share one component file (could split later) | Low |
| Clean UX, no route changes | State resets when switching tabs (acceptable) | |
| Follows existing Dashboard patterns | | |

**Option B: Extract to separate components + sub-routes**

- `/dashboard/productos` and `/dashboard/transacciones` with sub-navigation

| Pros | Cons | Effort |
|------|------|--------|
| Deep-linkable, isolated state | More routing setup, new files | Medium |
| Each section is independently testable | UX complexity for small project | |

**Option C: Collapsible sections**

- Both sections stacked vertically, can collapse/expand

| Pros | Cons | Effort |
|------|------|--------|
| See both at once | Bad UX with many products + transactions | Low |
| Simple implementation | Scrolling hell | |

#### 4. Filter Patterns

**Option A: Client-side filtering with React-Bootstrap Form controls** _(Recommended)_

- **Products**: `<Form.Select>` for category (derived from unique product categories), optional stock/price inputs
- **Transactions**: `<Form.Select>` for status, `<Form.Control type="date">` for date range, `<Form.Control>` for email search
- All filters are local state → `.filter()` + `.sort()` on the array

| Pros | Cons | Effort |
|------|------|--------|
| No extra Firestore reads | Not scalable for 1000s of documents | Low |
| Instant filter response | Must load all documents first | |
| Simple, consistent pattern | | |

**Option B: Firestore queries with `where()` / `orderBy()`**

- Each filter maps to a Firestore `where()` clause

| Pros | Cons | Effort |
|------|------|--------|
| Scales to large datasets | Composite indexes needed | Medium |
| Fewer documents read | Complex filter combination logic | |

**Option C: Extract reusable `<FilterBar>` component**

- Combine Options A + a generic FilterBar component for both sections

| Pros | Cons | Effort |
|------|------|--------|
| DRY, consistent UX | May be premature abstraction for 2 sections | Medium |
| Easy to add new filters | | |

---

### Recommendation

| Aspect | Choice | Rationale |
|--------|--------|-----------|
| Data model | Denormalized transaction doc | Self-contained, survives product changes |
| Checkout | Service function (`checkoutService.js`) | Clean separation, no new hooks or context coupling |
| Dashboard layout | React-Bootstrap Tabs | Already installed, cleanest UX, low effort |
| Filters | Client-side with React-Bootstrap Form controls | Small dataset, instant response, consistent with existing search pattern |

**Implementation flow:**

1. Create `src/services/checkoutService.js` — `createTransaction()` function
2. Modify `Cart.jsx` — add `useAuth()`, wire "Finalizar Compra" onClick → create transaction → clear cart → feedback
3. Modify `Dashboard.jsx` — add tabs (Products / Transactions), extract products section to sub-component or keep inline
4. Create `src/components/admin/TransactionTable.jsx` — transaction listing with filters by status, date range, email
5. Add filter bar to Product section (category, stock threshold)

---

### Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Firestore rules blocking writes**: If `transacciones` collection isn't in security rules, checkout fails silently | Checkout broken for all users | Add `transacciones` to Firestore security rules before deploying. Use `request.auth.uid` to enforce ownership. |
| **Cart.clearCart race condition**: If Firestore write succeeds but `clearCart()` isn't called (component unmount, error) | User sees items in cart after "successful" checkout | Wrap both operations in try/finally or use `useNavigate` to redirect after success |
| **Network failure during checkout**: User clicks, Firestore write fails, cart is not cleared | User thinks it failed, retries, gets duplicate transaction | Show error Alert + DO NOT clear cart. Let user retry. Check for duplicate `userId+createdAt`? Not needed for MVP. |
| **Concurrent checkout (double-click)**: User clicks multiple times before Firestore resolves | Multiple identical transactions | Disable button + show spinner immediately on first click |
| **Missing `useAuth()` in Cart**: Cart currently has no auth context | Checkout can't identify user | Import `useAuth` in Cart — straightforward addition |
| **Admin sees own transactions in dashboard**: Admin is also a regular user | Admin's purchases mixed with other users' data | `userId` field enables per-user queries; dashboard shows ALL (admin view) |
| **No tests to catch regressions** | Break existing product CRUD | Manual verification against spec + `npm run build` |

---

### Ready for Proposal

**Yes.** The codebase is well-understood, all affected files have been read, and the approaches are clear. The orchestrator can proceed to proposal with confidence.

Key points to communicate to the user:
- The Cart needs `useAuth()` to identify the user at checkout
- Transaction data is denormalized (stores all item data at time of purchase) to survive product changes
- Dashboard will use React-Bootstrap Tabs to switch between Products and Transactions
- Filters will be client-side (local state + `.filter()`) since data volume is small
- No new routes needed — Cart and Dashboard already exist and are properly protected
