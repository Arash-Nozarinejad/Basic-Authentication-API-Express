# Basic Authentication API

__Tools:__

- Backend & Language: Node.js (Latest LTS), Express.js, TypeScript
- Database & ORM: PostgreSQL, Prisma
- Security & Auth: JWT for session tokens, bcrypt for password hashing
- Middleware: cors for cross-origin requests
- Testing: Jest (unit tests)
- Documentation: OpenAPI (Swagger) for API documentation

__Process:__

1. Installed ExpressJS, TypesScript, Prisma, JWT, bcrypt, cors, ...,  created the PostgreSQL database and the subsequent schema in schema.prisma
2. Defined Register and Login DTOs (Data Transfer Objects) as well as the AuthResponse type. _auth.types.ts_
3. Defined the register and login functionalities. _auth.controller.ts_
4. Define the authenticate middleware for tokens. _auth.middleware.ts_
5. Defined the /register, /login, /me routes. _auth.routes.ts_
6. Defined the error middleware. _error.middleware.ts_
7. Defined the port and routes for the index.ts file. _index.ts_

