# Responsive Layout Specification

## Purpose

Provide a responsive layout that adapts to mobile and desktop viewports. The navigation bar MUST collapse into a hamburger menu on screens smaller than 768px. Admin users MUST see a "Dashboard" link. The search bar and cart icon with item count MUST be visible in the Nav. The layout MUST use React-Bootstrap Container/Row/Col for the grid system and styled-components for footer styling.

## Requirements

### Requirement: Responsive Navigation

The Nav bar MUST collapse into a hamburger menu on viewports below 768px.

#### Scenario: Desktop viewport

- GIVEN the viewport width is >= 768px
- WHEN the Nav renders
- THEN all navigation links are visible horizontally

#### Scenario: Mobile viewport — menu collapsed

- GIVEN the viewport width is < 768px
- WHEN the Nav renders
- THEN only the brand/logo and hamburger toggle icon are visible

#### Scenario: Mobile viewport — menu expanded

- GIVEN the viewport width is < 768px AND the hamburger icon was clicked
- WHEN the toggle activates
- THEN the navigation links appear in a vertical dropdown/menu

#### Scenario: Mobile viewport — close on link click

- GIVEN the mobile menu is expanded
- WHEN the user clicks any navigation link
- THEN the menu collapses automatically

### Requirement: Conditional Admin Link

The Nav MUST show a "Dashboard" link only when the current user is an admin.

#### Scenario: Admin sees Dashboard link

- GIVEN the logged-in user is `admin@gmail.com`
- WHEN the Nav renders
- THEN a link labeled "Dashboard" pointing to `/dashboard` is visible

#### Scenario: Non-admin does not see Dashboard link

- GIVEN the logged-in user is NOT the admin
- WHEN the Nav renders
- THEN the "Dashboard" link MUST NOT appear

### Requirement: Search Bar in Nav

The search bar MUST be part of the Nav component and visible on all pages.

#### Scenario: Search bar renders

- GIVEN the user is on any page
- WHEN the Nav renders
- THEN an input field for search is visible

#### Scenario: Search input updates catalog

- GIVEN the user is on the products page
- WHEN they type in the search bar
- THEN the product catalog filters results in real-time

### Requirement: Cart Icon with Count

The Nav MUST display a cart icon with the current item count from CartContext.

#### Scenario: Empty cart

- GIVEN the cart is empty
- WHEN the Nav renders
- THEN the cart icon shows a count of 0

#### Scenario: Items in cart

- GIVEN the cart has 3 items
- WHEN the Nav renders
- THEN the cart icon shows a count of 3

### Requirement: Bootstrap Grid Layout

The app layout MUST use React-Bootstrap Container, Row, and Col components for responsive structure.

#### Scenario: Three-column desktop layout

- GIVEN the viewport width is >= 992px
- WHEN the product catalog renders
- THEN products are displayed in a 3-column or 4-column grid

#### Scenario: Single-column mobile layout

- GIVEN the viewport width is < 576px
- WHEN the product catalog renders
- THEN products are displayed in a single column

### Requirement: Styled Footer

The Footer MUST be implemented with styled-components.

#### Scenario: Footer renders

- GIVEN the app loads on any page
- WHEN the Layout renders
- THEN a Footer is visible at the bottom with styled-components theming (background, text color, padding)
