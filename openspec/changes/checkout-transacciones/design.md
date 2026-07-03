# Design: Checkout y Transacciones

## Technical Approach

Decoupled service-layer function for checkout, React-Bootstrap Tabs for Dashboard expansion, and client-side `.filter()` for all dashboards. No new context providers, no Firestore query complexity. Maps directly to the proposal's 4-file strategy and covers all spec scenarios from both domains (`checkout-transactions` and `admin-panel` delta).

## Architecture Decisions

### Decision: Service function over CartContext method

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Add `checkout()` to CartContext | + Internal to cart system; - CartContext already handles state only, mixing I/O violates single responsibility | **Rejected** |
| `checkoutService.js` as pure function | + Imported only where needed, testable without Context, follows existing Firebase import pattern (cf. `Dashboard.jsx` imports `collection/getDocs/addDoc` directly) | **Chosen** |

**Rationale**: CartContext is an in-memory state manager — adding async Firestore I/O mixes concerns. A separate service keeps the cart context testable and the checkout flow independently replaceable (future payment gateway).

### Decision: Denormalized item snapshots

**Choice**: Store `items[]` with `{ title, price, image, quantity }` copied from cart at purchase time.
**Alternatives**: Store only product IDs and join at read time (fragile — product edits would change historical transactions).
**Rationale**: Transaction integrity requires a point-in-time record. Cart items already carry `title`, `price`, `image`, `quantity` — no extra data fetching needed.

### Decision: Client-side filtering against Firestore full fetch

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Firestore `where()`/`orderBy()` queries | + Server-side perf; - Index setup, tight coupling with current fields | **Rejected** (small dataset) |
| Fetch all + `.filter()` in JS | + Zero index management, filters composable, instant tab switching; - Wastes reads if dataset is large | **Chosen** (scales to hundreds, not thousands) |

**Rationale**: Current product set is small (admin-managed). Transactions accumulate over time but even hundreds fit well within Firestore reads and client memory. If scale becomes an issue, migrate to Firestore queries later.

### Decision: React-Bootstrap Tabs for Dashboard layout

**Choice**: `<Tabs>` + `<Tab>` wrapping existing product ABM and new `TransactionTable`.
**Alternatives**: Custom tab implementation (extra CSS, state management), separate route (`/dashboard/transacciones` — more navigation overhead).
**Rationale**: React-Bootstrap `Tabs` is already in the dependency tree (via `react-bootstrap` used in Dashboard). Zero new dependencies, zero routing changes, natural component isolation via `eventKey`.

### Decision: Button disable + Spinner for double-click prevention

**Choice**: Local `checkingOut` boolean state toggles `disabled` prop and shows `<Spinner size="sm" />` inline.
**Rationale**: Simplest possible approach. No debouncing, no refs, no AbortController. The button's `disabled` prop also prevents CSS hover feedback confusion and works with assistive tech.

## Data Flow

### Checkout flow

```
Cart (onClick)
  │  setCheckingOut(true) — disables button + shows spinner
  │
  ▼
checkoutService.createTransaction(db, uid, email, cart, total)
  │  addDoc(collection(db, 'transacciones'), { items, total, status, userId, userEmail, createdAt: serverTimestamp() })
  ▼
Firestore write
  ├─ Success → clearCart() → Alert success (dismissible) → setCheckingOut(false)
  └─ Failure → setCheckingOut(false) → Alert error (preserve cart, allow retry)
```

### Transaction listing

```
Dashboard — "Transacciones" Tab mounts
  ▼
TransactionTable useEffect
  ↓  getDocs(query(collection(db, 'transacciones'), orderBy('createdAt', 'desc')))
  ▼
transactions state
  ▼
Render Table + FilterBar (status select, date inputs, email text)
  │  Filter state → useMemo / inline .filter()
  ▼
Filtered table rows
```

### Product filtering flow

```
ProductFilters state (category select, min stock input)
  │
  ▼
Dashboard
  │  products.filter(p => matchesCategory && p.stock >= minStock)
  ▼
Filtered table rows (existing Table JSX, unchanged layout)
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/services/checkoutService.js` | **Create** | `createTransaction(db, userId, userEmail, items, total)` — validates items, writes to `transacciones` with denormalized data + `serverTimestamp()` |
| `src/components/admin/TransactionTable.jsx` | **Create** | Fetches and displays `transacciones` ordered by `createdAt desc`. Client-side filters: status (`<Form.Select>`), date range (two `<Form.Control type="date">`), email search (`<Form.Control type="search">`). Spinner + empty-state handling. |
| `src/components/admin/ProductFilters.jsx` | **Create** | Category `<Form.Select>` populated from `products` + "Todas", stock `<Form.Control type="number" min="0">`. Emits `{ category, minStock }` up to parent via `onFilter`. |
| `src/pages/Cart.jsx` | **Modify** | Import `useAuth`, `checkoutService`, `Spinner` from RB, `Alert` from RB. Add `checkingOut` state + `handleCheckout` async handler. Wire `onClick` on "Finalizar Compra". Add success/error Alert UI. |
| `src/pages/Dashboard.jsx` | **Modify** | Import `Tabs`, `Tab` from RB, `TransactionTable`, `ProductFilters`. Wrap existing UI in `<Tab eventKey="productos" title="Productos">`. Add `<Tab eventKey="transacciones" title="Transacciones">` with `TransactionTable`. Add filter `<Row>` above product table with `ProductFilters`. Pass filter state through. |

## Interfaces / Contracts

### Firestore document: `transacciones`

```js
{
  items: [
    {
      title: string,
      price: number,
      image: string,
      quantity: number
    }
  ],
  total: number,
  status: "completada",
  userId: string,        // Firebase Auth UID
  userEmail: string,     // email at purchase time
  createdAt: Timestamp   // serverTimestamp()
}
```

### `checkoutService.js`

```js
// Returns: Promise<DocumentReference> — rejects on empty cart or Firestore error
// Throws: Error("El carrito está vacío") if items.length === 0
createTransaction(db, userId, userEmail, items, total)
```

### `ProductFilters`

```js
// Props:
//   products: array (to derive category list)
//   onFilter: ({ category: string, minStock: number | "" }) => void
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `createTransaction` with valid items, empty items, Firestore failure | Mock `addDoc` via `vi.mock('firebase/firestore')` |
| Unit | Cart.jsx checkout handler: success clears cart, failure preserves cart | Mock service + context, assert state changes |
| Integration | TransactionTable renders with mock transactions | Render with real-ish data, assert rows + empty state |
| Integration | ProductFilters emits correct filter object | Simulate select change and input, assert `onFilter` calls |
| E2E | Full checkout flow: add item → cart → checkout → see Alert → check Firestore | Manual via browser + Firestore console |
| E2E | Dashboard tabs switch between Products and Transacciones | Manual via browser |

## Migration / Rollout

No migration required. Firestore `transacciones` collection is schema-less — first write creates it. Existing `productos` data is untouched.

## Open Questions

- None.