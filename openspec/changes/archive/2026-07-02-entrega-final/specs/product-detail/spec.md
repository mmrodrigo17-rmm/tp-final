# Product Detail Specification

## Purpose

Display full product information on a dedicated detail page. The page MUST show title, price, description, image, stock, and category. It MUST include an "Add to Cart" button and handle loading and not-found states.

## Requirements

### Requirement: Display Product Details

The product detail page MUST render all product fields from Firestore.

#### Scenario: Product exists

- GIVEN the user navigates to `/product/:id` where the product exists in Firestore
- WHEN the product data is loaded
- THEN the page displays: title, price, description, image, stock quantity, and category name

#### Scenario: Loading state

- GIVEN the user navigates to a product detail page
- WHILE Firestore is fetching the product
- THEN a spinner MUST be displayed

#### Scenario: Product not found

- GIVEN the user navigates to `/product/:id` where the product does NOT exist or was deleted
- WHEN Firestore returns no document
- THEN the system MUST display "Producto no encontrado" with a link back to the catalog

#### Scenario: Invalid product ID

- GIVEN the user navigates to `/product/invalid-id-format`
- WHEN the Firestore query fails
- THEN the system MUST display an error message "Error al cargar el producto"

### Requirement: Add to Cart

The product detail page MUST provide an "Add to Cart" button that uses the existing CartContext.

#### Scenario: Add available product to cart

- GIVEN the user is viewing a product with stock > 0
- WHEN they click "Agregar al Carrito"
- THEN the product is added to the cart AND a visual confirmation is shown (e.g., button text changes briefly)

#### Scenario: Add product with zero stock

- GIVEN the user is viewing a product with stock = 0
- WHEN the page renders
- THEN the "Agregar al Carrito" button MUST be disabled AND the text "Sin stock" is displayed

### Requirement: Stock Display

The product detail MUST clearly show the available stock.

#### Scenario: Low stock warning

- GIVEN the user is viewing a product with stock between 1 and 5
- WHEN the page renders
- THEN the stock value MUST be displayed with a visual indicator (e.g., highlighted text or icon) suggesting low availability

#### Scenario: Adequate stock

- GIVEN the user is viewing a product with stock > 5
- WHEN the page renders
- THEN the stock value is displayed normally
