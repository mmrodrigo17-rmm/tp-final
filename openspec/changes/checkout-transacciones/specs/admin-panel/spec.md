# Delta for Admin Panel

## ADDED Requirements

### Requirement: View Transactions

The dashboard MUST display all transactions from Firestore ordered by creation date descending in a dedicated "Transacciones" tab.

#### Scenario: Transactions loaded

- GIVEN the admin is on the dashboard "Transacciones" tab
- WHEN the Firestore `transacciones` collection is read, ordered by `createdAt desc`
- THEN all transactions are displayed showing at least ID, email, total, status, item count, and date

#### Scenario: No transactions

- GIVEN the admin is on the "Transacciones" tab
- WHEN the `transacciones` collection is empty
- THEN a message "No hay transacciones" is displayed

#### Scenario: Loading state

- GIVEN the admin navigates to the "Transacciones" tab
- WHILE Firestore is fetching transactions
- THEN a spinner MUST be displayed

### Requirement: Filter Transactions

The "Transacciones" tab MUST provide client-side filters for status, date range, and email.

#### Scenario: Filter by status

- GIVEN the admin is viewing transactions
- WHEN they select a status from a dropdown (e.g., "completada", "pendiente")
- THEN only transactions matching that status are shown

#### Scenario: Filter by date range

- GIVEN the admin is viewing transactions
- WHEN they enter a start and/or end date via date inputs
- THEN only transactions within the specified range are shown

#### Scenario: Filter by email

- GIVEN the admin is viewing transactions
- WHEN they type in an email search input
- THEN only transactions whose `userEmail` contains the typed text are shown

## MODIFIED Requirements

### Requirement: List Products

The dashboard MUST display all products from Firestore in a table or grid view. The product list MUST include client-side filter controls for category and stock threshold.
(Previously: no filter controls on product list)

#### Scenario: Products loaded (unchanged)

- GIVEN the admin is on the dashboard
- WHEN the Firestore products collection is read
- THEN all products are displayed showing at least title, price, stock, and action buttons

#### Scenario: Empty products list (unchanged)

- GIVEN the admin is on the dashboard
- WHEN the Firestore products collection is empty
- THEN the dashboard MUST show a message "No hay productos cargados"

#### Scenario: Loading state (unchanged)

- GIVEN the admin navigates to the dashboard
- WHILE Firestore is fetching products
- THEN a spinner MUST be displayed instead of the product list

#### Scenario: Filter by category

- GIVEN the admin is viewing products
- WHEN they select a category from a filter dropdown
- THEN only products matching that category are displayed

#### Scenario: Filter by stock threshold

- GIVEN the admin is viewing products
- WHEN they enter a minimum stock value in a filter input
- THEN only products with stock >= that value are displayed
