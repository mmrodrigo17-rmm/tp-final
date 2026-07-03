# User Authentication Specification

## Purpose

Replace simulated auth with Firebase Authentication. Users MUST register and login with email/password. The system MUST persist sessions across page reloads via `onAuthStateChanged`. The admin user (`admin@gmail.com` / `1234`) MUST be detected and granted access to protected admin routes.

## Requirements

### Requirement: User Registration

The system MUST allow a new user to register with email and password via Firebase Authentication.

#### Scenario: Successful registration

- GIVEN a user is on the Register page with a valid email and a password of at least 6 characters
- WHEN they submit the registration form
- THEN the account is created in Firebase Auth AND the user is automatically logged in AND redirected to the home page

#### Scenario: Duplicate email registration

- GIVEN a user submits a registration form with an email that already exists in Firebase Auth
- WHEN they submit the form
- THEN the system MUST display an error message "El correo ya está registrado" AND NOT create a duplicate account

#### Scenario: Weak password

- GIVEN a user submits a registration form with a password shorter than 6 characters
- WHEN they submit the form
- THEN the system MUST display an error message indicating the password is too weak AND NOT create the account

### Requirement: User Login

The system MUST authenticate existing users with email and password via Firebase Auth.

#### Scenario: Successful login

- GIVEN a registered user is on the Login page
- WHEN they enter correct email and password and submit
- THEN the user is authenticated AND redirected to the home page

#### Scenario: Wrong password

- GIVEN a registered user is on the Login page
- WHEN they enter a correct email but incorrect password
- THEN the system MUST display an error message "Contraseña incorrecta" AND remain on the Login page

#### Scenario: Non-existent email

- GIVEN a user is on the Login page
- WHEN they enter an email that is not registered
- THEN the system MUST display an error message "No hay una cuenta con este correo" AND remain on the Login page

### Requirement: Persistent Session

The system MUST use `onAuthStateChanged` to restore the authenticated user on page reload.

#### Scenario: Session persists across reload

- GIVEN a logged-in user refreshes the page or navigates away and back
- WHEN the app initializes
- THEN `onAuthStateChanged` fires with the current user AND the app shows the authenticated state without requiring re-login

#### Scenario: No session on fresh visit

- GIVEN an unauthenticated user visits the app for the first time
- WHEN `onAuthStateChanged` fires
- THEN the user is `null` AND the app shows public navigation (Login/Register links)

### Requirement: Admin Detection

The system MUST identify the user with email `admin@gmail.com` as an admin.

#### Scenario: Admin logs in

- GIVEN a user with email `admin@gmail.com` and password `1234` logs in
- WHEN authentication succeeds
- THEN the system MUST set an `isAdmin` flag on the auth context AND navigation MUST show the "Dashboard" link

#### Scenario: Non-admin user logs in

- GIVEN a user with any other email logs in
- WHEN authentication succeeds
- THEN the `isAdmin` flag MUST be `false` AND the "Dashboard" link MUST NOT appear in navigation

### Requirement: Logout

The system MUST allow an authenticated user to log out.

#### Scenario: Successful logout

- GIVEN a logged-in user clicks the logout button
- WHEN the Firebase sign-out completes
- THEN the user is returned to the Login page AND navigation reverts to unauthenticated state
