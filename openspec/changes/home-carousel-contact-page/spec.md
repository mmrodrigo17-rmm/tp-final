# Spec: Home Carousel + Contact Page

## home-carousel

### Functional Requirements

| ID | Requirement |
|----|-------------|
| HC-1 | The home page MUST render a React-Bootstrap `<Carousel>` at the top showing up to 4 randomly selected products from the Firestore `productos` collection. |
| HC-2 | Products MUST be fetched via `getDocs(collection(db, 'productos'))` on mount. |
| HC-3 | Exactly 4 random products MUST be selected using Fisher-Yates shuffle before rendering; if fewer than 4 exist, all available products SHALL be displayed. |
| HC-4 | `<ItemListContainer />` MUST render below the carousel on the same page. |
| HC-5 | The carousel MUST include indicators and prev/next arrow controls. |
| HC-6 | Each slide MUST display product image (with `object-fit: cover`), title, and caption. |
| HC-7 | Products without an `image` field MUST fall back to a placeholder. |
| HC-8 | The page MUST set `<Helmet>` with a descriptive title for SEO. |

### Non-functional Requirements

| ID | Requirement |
|----|-------------|
| HC-N1 | The carousel wrapper MUST use styled-components for fixed height with no layout shift between slides. |
| HC-N2 | All slides MUST maintain consistent height regardless of image aspect ratio. |
| HC-N3 | A `<Spinner>` MUST be shown while Firestore data loads; on error the carousel section MUST be hidden gracefully. |

### Scenarios

#### Happy: Products loaded
- GIVEN the user navigates to `/`
- WHEN Firestore returns 4 or more products
- THEN a 4-slide carousel appears above the grid with navigation controls

#### Edge: Fewer than 4 products
- GIVEN the user navigates to `/`
- WHEN Firestore returns 2 products
- THEN 2 slides render without error or empty slides

#### Edge: Product with no image
- GIVEN a fetched product lacks the `image` field
- WHEN its slide renders
- THEN a placeholder image is shown instead

#### Error: Firestore unavailable
- GIVEN the user navigates to `/`
- WHEN the Firestore read fails
- THEN the carousel area is not rendered (grid unaffected)

---

## contact-form

### Functional Requirements

| ID | Requirement |
|----|-------------|
| CF-1 | The system MUST provide a route `/contacto` that renders a contact form. |
| CF-2 | The form MUST include fields: nombre (text), email (email), asunto (text), mensaje (textarea). |
| CF-3 | Validation: nombre is required, email is required and MUST match email format, mensaje is required. |
| CF-4 | Invalid fields MUST display inline error messages below the field. |
| CF-5 | On valid submission: a `<Alert variant="success">` MUST display "Mensaje enviado con éxito" and the form MUST reset to empty. |
| CF-6 | The Nav MUST include a "Contacto" link pointing to `/contacto`, visible to all users (authenticated or anonymous). |
| CF-7 | The page MUST set `<Helmet>` with a descriptive title. |

### Non-functional Requirements

| ID | Requirement |
|----|-------------|
| CF-N1 | Form layout MUST use React-Bootstrap components: Container, Row, Col, Form, Button, Alert. |
| CF-N2 | The form MUST be responsive: single column on mobile, two columns (nombre + email) on desktop via Row/Col. |
| CF-N3 | Submission logs data via `console.log` and shows a success Alert — no backend call. |

### Scenarios

#### Happy: Valid submission
- GIVEN the user fills all fields with valid data
- WHEN they click "Enviar"
- THEN a success Alert appears with "Mensaje enviado con éxito"
- AND the form resets to its initial state

#### Error: All fields empty
- GIVEN the user submits with all fields empty
- THEN inline errors appear for nombre, email, and mensaje
- AND the form is NOT submitted

#### Error: Invalid email format
- GIVEN the user enters "invalido" in the email field
- WHEN they submit
- THEN an email-format error is shown
- AND the form is NOT submitted

#### Nav visibility
- GIVEN any user (authenticated or anonymous)
- WHEN viewing the navigation bar
- THEN a "Contacto" link is present and navigates to `/contacto`

---

## product-catalog (Modified)

### MODIFIED Requirements

The route `/` now renders `<Home />` (carousel + `<ItemListContainer />`) instead of `<ItemListContainer />` alone. All existing product-catalog behavior (Firestore fetching, search, pagination) is unchanged.

#### Scenario: Route differentiation
- GIVEN the user navigates to `/`
- THEN the carousel and product grid are both shown
- WHEN they navigate to `/productos`
- THEN only the product grid is shown (no carousel)

---

## Acceptance Criteria

- [ ] Home page shows a carousel with random products before the product grid
- [ ] Carousel arrows and indicators function correctly
- [ ] Carousel handles fewer than 4 products without errors
- [ ] `/contacto` route renders a form with client-side validation
- [ ] Valid submission shows a success Alert and resets the form
- [ ] "Contacto" link is visible in the Nav for all users
- [ ] Both pages set SEO `<Helmet>` with descriptive titles
- [ ] `npm run build` passes without errors
