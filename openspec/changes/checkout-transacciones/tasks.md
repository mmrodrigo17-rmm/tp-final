# Tasks: Checkout y Transacciones

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 300–500 |
| 800-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | auto-forecast |
| Chain strategy | stacked-to-main |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: stacked-to-main
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Checkout service + Cart wiring + Dashboard tabs + TransactionTable + ProductFilters + Firestore rules | PR 1 | Single PR, all tasks included. Base: main. |

## Phase 1: Service Layer

- [x] 1.1 Create `src/services/` directory and `checkoutService.js` — export `createTransaction(db, userId, userEmail, items, total)` that validates non-empty items, calls `addDoc(collection(db, 'transacciones'), { items, total, status: 'completada', userId, userEmail, createdAt: serverTimestamp() })`, returns `DocumentReference`

## Phase 2: Cart Checkout

- [x] 2.1 In `src/pages/Cart.jsx`: import `useAuth` from AuthContext, import `createTransaction` from checkoutService, import `Spinner` + `Alert` from react-bootstrap
- [x] 2.2 Add `checkingOut` state (`useState(false)`), `errorMsg` state, `successMsg` state; create `handleCheckout` async handler that sets `checkingOut(true)`, calls `createTransaction`, on success calls `clearCart()` + sets success Alert, on catch sets error Alert; always does `setCheckingOut(false)` in finally
- [x] 2.3 Wire `onClick` on "Finalizar Compra" button → `handleCheckout`; set `disabled={checkingOut}`; show `<Spinner size="sm" />` inline when checkingOut; render success/error `<Alert>` dismissible above the button

## Phase 3: Dashboard Tabs

- [x] 3.1 In `src/pages/Dashboard.jsx`: import `Tabs`, `Tab` from react-bootstrap, import `TransactionTable`, import `ProductFilters`
- [x] 3.2 Wrap existing product ABM in `<Tab eventKey="productos" title="Productos">`; add `<Tab eventKey="transacciones" title="Transacciones">` containing `<TransactionTable />`
- [x] 3.3 Add `<Row>` above product table with `<ProductFilters products={products} onFilter={setProductFilters} />`; apply `products.filter(p => matchesCategory && p.stock >= minStock)` before rendering table rows

## Phase 4: TransactionTable Component

- [x] 4.1 Create `src/components/admin/TransactionTable.jsx` — `useEffect` fetches `getDocs(query(collection(db, 'transacciones'), orderBy('createdAt', 'desc')))` into state; render `<Spinner>` while loading, "No hay transacciones" when empty
- [x] 4.2 Add filter bar: status `<Form.Select>` (options: "Todas", "completada", "pendiente"), date range (two `<Form.Control type="date">` for start/end filters), email `<Form.Control type="search">`; apply client-side `.filter()` via useMemo
- [x] 4.3 Render table: columns for ID (truncated), userEmail, total (formatted), status, item count, createdAt (formatted date)

## Phase 5: ProductFilters Component

- [x] 5.1 Create `src/components/admin/ProductFilters.jsx` — receives `products` array + `onFilter` callback
- [x] 5.2 Derive unique categories from `products` for `<Form.Select>` (option "Todas" by default); add stock threshold `<Form.Control type="number" min="0">`
- [x] 5.3 Emit `{ category, minStock }` to parent via `onFilter` on change

## Phase 6: Firestore Rules

- [x] 6.1 Add Firestore security rule allowing `read` + `write` on `transacciones` collection (or match `/{doc=**}` if already open)
