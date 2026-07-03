# SEO Specification

## Purpose

Provide dynamic SEO metadata for every page using React Helmet. Each page MUST set a unique `<title>` and a descriptive `<meta name="description">`. The app MUST wrap in `HelmetProvider` at the root level.

## Requirements

### Requirement: HelmetProvider Wrapping

The application root MUST be wrapped in `HelmetProvider` from `react-helmet-async`.

#### Scenario: Provider renders

- GIVEN the app initializes
- WHEN `main.jsx` or `App.jsx` renders
- THEN the component tree is wrapped in `<HelmetProvider>` and all child components can set helmet values

### Requirement: Dynamic Page Titles

Each page MUST set a unique `<title>` tag via `<Helmet>`.

#### Scenario: Home page title

- GIVEN the user navigates to `/`
- WHEN the page renders
- THEN the document title is "Inicio — Mi Tienda"

#### Scenario: Products page title

- GIVEN the user navigates to `/products`
- WHEN the page renders
- THEN the document title is "Productos — Mi Tienda"

#### Scenario: Product detail title

- GIVEN the user navigates to `/product/:id` for a product named "Zapatilla Nike Air"
- WHEN the page renders
- THEN the document title is "Zapatilla Nike Air — Mi Tienda"

#### Scenario: Cart page title

- GIVEN the user navigates to `/cart`
- WHEN the page renders
- THEN the document title is "Carrito — Mi Tienda"

#### Scenario: Login page title

- GIVEN the user navigates to `/login`
- WHEN the page renders
- THEN the document title is "Iniciar Sesión — Mi Tienda"

#### Scenario: Dashboard page title

- GIVEN the admin navigates to `/dashboard`
- WHEN the page renders
- THEN the document title is "Dashboard — Mi Tienda"

#### Scenario: Register page title

- GIVEN the user navigates to `/register`
- WHEN the page renders
- THEN the document title is "Registro — Mi Tienda"

### Requirement: Meta Description Tags

Each page MUST include a unique `<meta name="description">` tag with a relevant description.

#### Scenario: Home page description

- GIVEN the user navigates to `/`
- WHEN the page renders
- THEN the meta description is "Bienvenido a Mi Tienda — tu tienda online de confianza"

#### Scenario: Product detail description

- GIVEN the user navigates to a product detail page
- WHEN the page renders
- THEN the meta description MUST include the product's own description text

### Requirement: Fallback Title

Pages without an explicit Helmet MUST fall back to a default title.

#### Scenario: Unknown route

- GIVEN the user navigates to a non-existent route
- WHEN the page renders
- THEN the document title is "Mi Tienda"
