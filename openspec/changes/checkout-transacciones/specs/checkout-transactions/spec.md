# Checkout Transactions Specification

## Purpose

Enable users to complete purchases: clicking "Finalizar Compra" creates a Firestore transaction document with denormalized item data, clears the cart, and provides feedback. Double-click protection prevents duplicate submissions.

## Requirements

### Requirement: Checkout Flow

The system MUST create a Firestore transaction document when an authenticated user clicks "Finalizar Compra" with items in the cart.

#### Scenario: Successful checkout

- GIVEN the user has items in the cart and is logged in
- WHEN they click "Finalizar Compra"
- THEN a document is created in the `transacciones` collection
- AND the cart is cleared
- AND a success Alert is displayed

#### Scenario: Empty cart checkout prevented

- GIVEN the user has an empty cart
- WHEN they click "Finalizar Compra"
- THEN nothing is written to Firestore
- AND an error Alert is shown indicating the cart is empty

### Requirement: Data Model

Each transaction document MUST store denormalized snapshots of purchased items, total amount, status, timestamps, and user identification.

#### Scenario: Transaction document structure

- GIVEN a completed checkout
- WHEN the transaction is inspected in Firestore
- THEN it contains `items[]` with denormalized copies (title, price, quantity at purchase time)
- AND `total` as a number
- AND `status` set to "completada"
- AND a `createdAt` server timestamp
- AND `userId` plus `userEmail` from the authenticated user

### Requirement: Error Handling

If the Firestore write fails, the system MUST preserve the cart and allow the user to retry.

#### Scenario: Network failure preserves cart

- GIVEN the user clicks "Finalizar Compra"
- WHEN the Firestore write fails
- THEN the cart is NOT cleared
- AND an error Alert is displayed
- AND the user can click "Finalizar Compra" to retry

### Requirement: Double-Click Prevention

The "Finalizar Compra" button MUST be disabled on click and show a spinner while the operation is in progress.

#### Scenario: Button disabled during checkout

- GIVEN the user clicks "Finalizar Compra"
- WHEN the Firestore write is in progress
- THEN the button is disabled AND shows a spinner
- AND clicking it again has no effect

#### Scenario: Button re-enabled on failure

- GIVEN the user clicks "Finalizar Compra"
- WHEN the Firestore write fails
- THEN the button is re-enabled AND the spinner is removed
- AND the user can retry
