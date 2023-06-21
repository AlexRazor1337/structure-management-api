## Description

This is a small server app built with Node.js and TypeScript using NestJS, TypeORM, and PostgreSQL. The app allows for simple management operations of an organization's user structure. It supports three user roles: Administrator, Boss, and Regular user.

The app provides the following REST API endpoints:

1. Register user: Allows users to register and create an account.
2. Authenticate as a user: Provides user authentication functionality.
3. Get list of users: Returns a list of users based on the user's role and hierarchy:
   - Administrator can see all users.
   - Boss can see herself and all subordinates recursively.
   - Regular user can only see herself.
4. Change user's boss: Enables a boss to change the boss of her subordinates.

## How to run

1. Install Dependencies: Run the following command in the terminal to install the required dependencies using PNPM(can be used interchangeably with NPM) package manager:
```bash
$ pnpm install
```

2. Start Docker Containers for the DB: Execute the following command in the terminal to start the PostgreSQL Docker containers in the background:
```bash
docker-compose up -d
```

3. Create a `.env` file in the root directory of the project and fill it with the following environment variables:
```bash
DB_NAME=structure-managment
DB_USERNAME=admin
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
APP_PORT=3000
JWT_SECRET=secret
JWT_EXPIRATION_TIME=15m
JWT_SECRET_REFRESH=secret2
JWT_EXPIRATION_TIME_REFRESH=1d
DB_LOGGING=false
```

4. Database Migration: Run the migration command to set up the database by executing the following command in the terminal:
```bash
pnpm run migrate:up
```

5. Start the Application: Start the application by running the following command in the terminal:
```bash
pnpm run start
```
The application should now be running and ready to accept requests.

## How to use?

The application is a REST API that can be used to manage a list of users.
User routes require JWT Bearer token authentication. The token can be obtained by logging in using the `/auth/login` endpoint.

The following endpoints are available:
- Auth:
  - POST /auth/login
    ```
    {
      "email": "test@mail.com",
      "password": "password"
    }
    ```
  - POST /auth/register
    ```
    {
      "email": "test@mail.com",
      "password": "password",
      "role": "USER",
      "bossId": 1,
    }
    ```
    
    `role` can take the following values: `USER`, `ADMIN`, `BOSS`.
  - POST /auth/refresh
    ```
    {
      "refreshToken": "jwt_refresh_token"
    }
    ```
- User (requires authentication):
  - GET /user  
    Returns the list of users base on the current user's role.
  - PATCH /user/:id
    ```
    {
      "bossId": 1
    }
    ```
    
    Updates user boss with the given boss id.
