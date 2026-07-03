# Admin Panel Specification

## Purpose

Provide a protected dashboard at `/dashboard` for the admin user (`admin@gmail.com`) to manage products stored in Firestore. Non-admin users MUST be redirected away. The dashboard SHALL support full CRUD: list, create, edit, and delete products with loading spinners and error messages.

## Requirements

### Requirement: Route Protection

The `/dashboard` route MUST only be accessible to the admin user.

#### Scenario: Admin accesses dashboard

- GIVEN a user logged in as `admin@gmail.com`
- WHEN they navigate to `/dashboard`
- THEN the dashboard page renders with the product list

#### Scenario: Non-admin redirected

- GIVEN a user logged in with a non-admin email
- WHEN they navigate to `/dashboard`
- THEN they are redirected to the home page

#### Scenario: Unauthenticated user redirected

- GIVEN a visitor who is not logged in
- WHEN they navigate to `/dashboard`
- THEN they are redirected to the Login page

### Requirement: List Products

The dashboard MUST display all products from Firestore in a table or grid view.

#### Scenario: Products loaded

- GIVEN the admin is on the dashboard
- WHEN the Firestore products collection is read
- THEN all products are displayed showing at least title, price, stock, and action buttons

#### Scenario: Empty products list

- GIVEN the admin is on the dashboard
- WHEN the Firestore products collection is empty
- THEN the dashboard MUST show a message "No hay productos cargados"

#### Scenario: Loading state

- GIVEN the admin navigates to the dashboard
- WHILE Firestore is fetching products
- THEN a spinner MUST be displayed instead of the product list

### Requirement: Create Product

The admin MUST be able to create a new product via a form.

#### Scenario: Successful creation

- GIVEN the admin opens the create product form
- WHEN they fill all required fields (name, price, description, image, stock, category) with valid data and submit
- THEN the product is saved to Firestore AND the admin sees a success message AND is returned to the product list

#### Scenario: Validation errors

- GIVEN the admin opens the create product form
- WHEN they submit with empty name OR price <= 0 OR stock < 0
- THEN the form MUST display inline validation errors AND the product MUST NOT be saved

### Requirement: Edit Product

The admin MUST be able to edit an existing product.

#### Scenario: Successful edit

- GIVEN the admin clicks "Edit" on a product
- WHEN the form is pre-filled with existing data, they modify fields, and submit
- THEN the product is updated in Firestore AND the admin sees a success message AND is returned to the product list

#### Scenario: Firestore error on edit

- GIVEN the admin edits a product
- WHEN the Firestore update operation fails
- THEN the system MUST display an error message "Error al actualizar el producto"

### Requirement: Delete Product

The admin MUST be able to delete a product with confirmation.

#### Scenario: Confirmed deletion

- GIVEN the admin clicks "Delete" on a product
- WHEN a confirmation modal appears and the admin confirms
- THEN the product is removed from Firestore AND removed from the product list

#### Scenario: Cancelled deletion

- GIVEN the admin clicks "Delete" on a product
- WHEN the confirmation modal appears and the admin cancels
- THEN the product MUST NOT be deleted AND the modal closes
