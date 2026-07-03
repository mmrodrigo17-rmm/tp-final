# Proposal: Checkout y Transacciones

## Intent

Enable users to complete purchases and admins to view/manage transactions. Currently the "Finalizar Compra" button on Cart is non-functional, and Dashboard has no visibility into completed orders.

## Scope

### In Scope
- Checkout flow: wire "Finalizar Compra" → create Firestore transaction → clear cart → user feedback
- Transaction data model with denormalized item copies (survives product changes)
- Dashboard "Transacciones" tab via React-Bootstrap Tabs (alongside existing Products)
- Client-side filters for transactions (status, date range, email) and products (category, stock threshold)
- Button disabling + spinner during checkout (prevents double-click)

### Out of Scope
- Payment gateway integration (Stripe/MP) — deferred
- Server-side pagination or Firestore query filters — client-side only (small dataset)
- Cart persistence (localStorage/Firestore) — cart is session-only
- Email confirmation or receipt generation — future enhancement

## Capabilities

### New
- `checkout-transactions`: checkout flow + transaction storage in Firestore

### Modified
- `admin-panel`: add transaction listing with status/date/email filters

## Approach

1. **Data model**: denormalized `transacciones` docs — item snapshots, total, status, timestamps, userId+email
2. **Service layer**: `checkoutService.js` — single `createTransaction()` writing to `transacciones`
3. **Cart wiring**: import `useAuth()`, wire "Finalizar Compra" onClick → disable button + spinner → call service → success Alert + clearCart → error Alert (retry)
4. **Dashboard tabs**: wrap existing ABM in "Productos" `<Tab>`, add "Transacciones" `<Tab>` with new `TransactionTable` component
5. **TransactionTable**: fetch `transacciones` ordered by `createdAt desc`, render table + filters (status `<select>`, date range `<input type="date">`, email search)

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/services/checkoutService.js` | **New** | `createTransaction()` function |
| `src/pages/Cart.jsx` | Modified | Import `useAuth`, wire checkout, feedback |
| `src/pages/Dashboard.jsx` | Modified | Add Tabs layout, embed TransactionTable |
| `src/components/admin/TransactionTable.jsx` | **New** | Transaction table + filters |
| `src/components/admin/ProductFilters.jsx` | **New** | Category + stock filters |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Firestore rules block writes | Low | Add `transacciones` write rule before deploy |
| Double-click creates duplicates | Medium | Disable button + spinner immediately |
| Network failure mid-checkout | Medium | Error Alert, cart intact, retry allowed |

## Rollback

- Revert Cart.jsx and Dashboard.jsx via git
- Delete `checkoutService.js`, `TransactionTable.jsx`, `ProductFilters.jsx`
- Firestore `transacciones` collection remains orphaned but harmless
- Spec revert via SDD archive

## Dependencies

- Firestore `transacciones` collection created at first write (no setup needed)
- Admin email check remains `admin@gmail.com` (unchanged)

## Success Criteria

- [ ] User completes checkout → transaction in Firestore → cart cleared
- [ ] Admin sees all transactions with working filters
- [ ] Double-click protection prevents duplicates
- [ ] `npm run build` succeeds
