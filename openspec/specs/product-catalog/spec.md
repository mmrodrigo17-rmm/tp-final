# Product Catalog Specification

## Purpose

Replace FakeStore API with Firestore as the data source for the product catalog. The catalog MUST display products in a card grid, support real-time search by title, implement pagination (8 products per page), and show loading/error states.

## Requirements

### Requirement: Fetch Products from Firestore

The catalog MUST read products from the Firestore `products` collection instead of the FakeStore API.

#### Scenario: Products loaded successfully

- GIVEN the user navigates to the home/products page
- WHEN Firestore returns the products collection
- THEN each product card displays image, title, and price

#### Scenario: Firestore unavailable

- GIVEN the user navigates to the home/products page
- WHEN the Firestore read operation fails or times out
- THEN the system MUST display a user-friendly error message "Error al cargar productos. Intente nuevamente."

#### Scenario: Loading spinner

- GIVEN the user navigates to the home/products page
- WHILE Firestore is fetching products
- THEN a visual spinner MUST be displayed in place of the product grid

### Requirement: Search by Title

The user MUST be able to filter products by typing in a search bar.

#### Scenario: Filter matches

- GIVEN the user types "zapatilla" in the search bar
- WHEN there are products with "zapatilla" in their title
- THEN only matching products are displayed

#### Scenario: No matches

- GIVEN the user types a search term that matches no product titles
- WHEN the filter runs
- THEN the system MUST display "No se encontraron productos"

#### Scenario: Empty search restores full list

- GIVEN the user has typed a search term and sees filtered results
- WHEN they clear the search input
- THEN the full product list is restored

#### Scenario: Case-insensitive search

- GIVEN the user types "ZAPATILLA" (uppercase)
- WHEN filtering products
- THEN products with "zapatilla" in the title still match

### Requirement: Pagination

The product catalog MUST paginate results, displaying 8 products per page.

#### Scenario: Navigation between pages

- GIVEN the product catalog has 20 products
- WHEN the user clicks page 2 on the pagination control
- THEN products 9 through 16 are displayed

#### Scenario: Single page hides pagination

- GIVEN the product catalog has 5 products (fewer than 8)
- WHEN the products are loaded
- THEN pagination controls MUST NOT be shown

#### Scenario: Search resets pagination

- GIVEN the user is on page 3 of the catalog
- WHEN they type a search term
- THEN the view resets to page 1
