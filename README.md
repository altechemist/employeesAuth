# Employee Management API

## Overview

This API provides a set of endpoints for managing employee records and user authentication in a Firebase-powered backend. It includes functionalities for CRUD operations on employee data, user registration, login, and password reset.

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Endpoints](#endpoints)
  - [Employee Management](#employee-management)
  - [User Authentication](#user-authentication)
- [Error Handling](#error-handling)
- [License](#license)

---

## Features

- CRUD operations on employee records stored in Firebase Firestore.
- Employee image uploads to Firebase Storage.
- User registration, login, and password reset using Firebase Authentication.
- Error handling for invalid inputs and Firebase errors.

---

## Technologies Used

- Node.js
- Express.js
- Firebase Firestore
- Firebase Authentication
- Firebase Storage

---

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your Firebase project and obtain configuration details.
4. Create a `firebase.js` file in the `config` directory and configure Firebase:
   ```javascript
   const { initializeApp } = require("firebase/app");
   const { getFirestore } = require("firebase/firestore");
   const { getAuth } = require("firebase/auth");

   const firebaseConfig = {
     apiKey: "<API_KEY>",
     authDomain: "<AUTH_DOMAIN>",
     projectId: "<PROJECT_ID>",
     storageBucket: "<STORAGE_BUCKET>",
     messagingSenderId: "<MESSAGING_SENDER_ID>",
     appId: "<APP_ID>",
   };

   const app = initializeApp(firebaseConfig);
   const db = getFirestore(app);
   const auth = getAuth(app);

   module.exports = { db, auth };
   ```
5. Run the server:
   ```bash
   npm start
   ```

---

## Environment Variables

Ensure the following environment variables are set:

- `API_KEY`
- `AUTH_DOMAIN`
- `PROJECT_ID`
- `STORAGE_BUCKET`
- `MESSAGING_SENDER_ID`
- `APP_ID`

---

## Endpoints

### Employee Management

| Method | Endpoint               | Description                           |
|--------|------------------------|---------------------------------------|
| GET    | `/employees`           | Get all employees.                   |
| POST   | `/employees`           | Add a new employee.                  |
| GET    | `/employees/:id`       | Get an employee by ID.               |
| PUT    | `/employees/:id`       | Update an employee's details.        |
| DELETE | `/employees`           | Delete an employee by ID.            |

#### Example Request for Adding an Employee
**POST** `/employees`

Request Body:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "idNumber": "123456",
  "eMailAddress": "john.doe@example.com",
  "phoneNumber": "123-456-7890",
  "position": "Manager",
  "file": <binary file>
}
```

---

### User Authentication

| Method | Endpoint               | Description                           |
|--------|------------------------|---------------------------------------|
| POST   | `/auth/register`       | Register a new user.                 |
| POST   | `/auth/login`          | Log in an existing user.             |
| POST   | `/auth/reset-password` | Send a password reset email.         |

#### Example Request for User Registration
**POST** `/auth/register`

Request Body:
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

---

## Error Handling

The API returns structured error messages for invalid inputs, missing data, and Firebase errors.

Example:
```json
{
  "message": "Error adding employee",
  "error": "Missing required fields"
}
```

---

## License

This project is licensed under the MIT License. 

Feel free to modify this README as per your project's specific needs. Let me know if you need any additional sections or examples!
