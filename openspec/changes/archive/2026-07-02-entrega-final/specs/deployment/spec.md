# Deployment Specification

## Purpose

Configure the project for deployment to GitHub Pages. The build MUST set the correct `base` path so that assets, routes, and API calls work from a sub-path URL (e.g., `https://<user>.github.io/<repo>/`). A deploy script MUST push the built output to the `gh-pages` branch.

## Requirements

### Requirement: Vite Base Path

The Vite configuration MUST set `base` to the repository name prefixed with a slash.

#### Scenario: Base configured for sub-path

- GIVEN the project is deployed to `https://<user>.github.io/tp-final/`
- WHEN `vite.config.js` is read
- THEN `base` is set to `"/tp-final/"`

#### Scenario: Development mode unaffected

- GIVEN the developer runs `npm run dev`
- WHEN the Vite dev server starts
- THEN the app loads from `/` without the base prefix, as expected for local development

### Requirement: Build Output

`npm run build` MUST produce a deployable `dist/` directory with all assets.

#### Scenario: Successful build

- GIVEN the source code is valid
- WHEN `npm run build` is executed
- THEN a `dist/` directory is created containing `index.html`, JavaScript bundles, CSS files, and assets with correct relative paths

#### Scenario: Build fails on errors

- GIVEN the source code has a syntax error or missing import
- WHEN `npm run build` is executed
- THEN the build MUST fail with an error message AND `dist/` MUST NOT be created or updated

### Requirement: Deploy Script

The project MUST include an `npm run deploy` script that publishes the `dist/` folder to the `gh-pages` branch using the `gh-pages` package.

#### Scenario: Successful deploy

- GIVEN the project has been built and `dist/` exists
- WHEN `npm run deploy` is executed
- THEN the contents of `dist/` are pushed to the `gh-pages` branch of the repository

### Requirement: Routing Works from Sub-path

The React Router app MUST work correctly when served from a sub-path like `/tp-final/`.

#### Scenario: Client-side routing works

- GIVEN the app is deployed at `https://<user>.github.io/tp-final/`
- WHEN the user navigates to `https://<user>.github.io/tp-final/productos`
- THEN the Productos page renders correctly WITHOUT a 404 from GitHub Pages

#### Scenario: Page refresh on sub-route

- GIVEN the user is on `https://<user>.github.io/tp-final/producto/abc123`
- WHEN they refresh the page
- THEN the product detail page still renders correctly (GitHub Pages redirects to index.html)
