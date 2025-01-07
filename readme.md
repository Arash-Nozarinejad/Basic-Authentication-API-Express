# Summary of the Basic Login API

This API implements a basic user authentication system with the following functionalities:

## User Registration (POST /api/auth/register)

- Accepts `email`, `password`, and optional `name` from the request body.
- Checks if a user with the provided email already exists.
- Hashes the password using `bcrypt`.
- Creates a new user in the database using Prisma.
- Returns a JWT token generated using `jsonwebtoken` along with the user's data.

## User Login (POST /api/auth/login)

- Accepts `email` and `password` from the request body.
- Checks if a user with the provided email exists in the database.
- Verifies the provided password against the hashed password using `bcrypt`.
- Generates a JWT token using `jsonwebtoken`.
- Returns the token and the authenticated user's data.

## Authenticated User Information (GET /api/auth/me)

- Protected route requiring a valid JWT token in the `Authorization` header.
- Decodes and verifies the token using `jsonwebtoken`.
- Fetches the user data from the database using Prisma.
- Returns the authenticated user's information.

---

## Tools and Technologies Used

### Node.js and Express.js

- Framework for handling HTTP requests and routing.

### Prisma ORM

- Used for database interactions, including creating and querying users.

### bcrypt

- For hashing passwords during registration and verifying them during login.

### jsonwebtoken (JWT)

- For generating, signing, and verifying tokens to handle user authentication.

### dotenv

- For securely managing environment variables such as `DATABASE_URL` and `JWT_SECRET`.

### Supertest (Testing)

- For making HTTP requests to the API endpoints during tests.

### Jest (Testing)

- For writing and running test cases.

### PostgreSQL

- The database used to store user information.

### Express Middleware

- Custom middleware for:
  - **Token Authentication**: Verifies the validity of JWT tokens for protected routes.
  - **Error Handling**: Logs and returns a generic 500 Internal Server Error response for unhandled errors.

### TypeScript

- For static typing and defining interfaces for request and response payloads.

---

## High-Level Steps to Recreate the API

### 1. Initialize the Project

- Set up a Node.js project with `npm init -y` and install required dependencies (`express`, `prisma`, `bcrypt`, `jsonwebtoken`, etc.).

### 2. Set Up Prisma

- Configure the database connection in `prisma/schema.prisma`.
- Define the `User` model and run `npx prisma migrate` to create the database schema.

### 3. Create Middleware

- Implement an authentication middleware using `jsonwebtoken` to verify tokens.
- Implement an error-handling middleware.

### 4. Develop Controllers

- **Register Controller**:
  - Validate input, hash passwords, create users in the database, and return a JWT token.
- **Login Controller**:
  - Validate input, verify user credentials, and return a JWT token.

### 5. Define Routes

- Create routes for registration, login, and fetching the authenticated user's profile.
- Protect the `/me` route with the authentication middleware.

### 6. Testing

- Write tests using `jest` and `supertest` to verify the behavior of all routes.
- Ensure tests cover valid and invalid inputs, duplicate users, and token verification.

### 7. Start the Server

- Set up Express with CORS, JSON parsing, routes, and error handling.
- Start the server on a specified port.
