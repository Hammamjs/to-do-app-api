# To-Do App API

This project is a backend API for a To-Do application. It provides endpoints to manage tasks, including creating, updating, deleting, and retrieving tasks. The API is designed to be efficient, scalable, and easy to integrate with a frontend application.

## Features

- User authentication and authorization.
- CRUD operations for tasks.
- Support for task prioritization and categorization.
- RESTful API design.
- Error handling and validation.

## Tools and Technologies Used

- **Node.js**: A JavaScript runtime for building scalable server-side applications.
- **Express.js**: A web framework for Node.js to simplify API development.
- **MongoDB**: A NoSQL database for storing tasks and user data.
- **Mongoose**: An Object Data Modeling (ODM) library for MongoDB and Node.js.
- **JWT (JSON Web Tokens)**: For user authentication and secure API access.
- **dotenv**: For managing environment variables.
- **Postman**: For testing and documenting API endpoints.
- **Git**: Version control system to track changes in the codebase.

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in a `.env` file.
4. Start the development server:
   ```bash
   npm run dev
   ```

## Folder Structure

- `src/`: Contains the main application code.
  - `controllers/`: Handles the logic for each API endpoint.
  - `models/`: Defines the data models.
  - `routes/`: Contains route definitions.
  - `middlewares/`: Includes middleware for authentication and error handling.
- `tests/`: Contains test cases for the API.

## 🔐 Authentication Routes — /api/v2/auth

| Method | Endpoint          | Description                             |
| ------ | ----------------- | --------------------------------------- |
| POST   | `/signup`         | Register a new user (`signupValidator`) |
| POST   | `/login`          | Log in an existing user                 |
| POST   | `/logout`         | Log out the current user                |
| POST   | `/forgotPassword` | Request password reset code             |
| POST   | `/verifyCode`     | Verify password reset code              |
| PUT    | `/resetPassword`  | Reset password using code               |

## ✅ Task Routes — /api/v2/tasks

| Method | Endpoint               | Middleware & Description                          |
| ------ | ---------------------- | ------------------------------------------------- |
| GET    | `/:id`                 | Protected, Get a single task (`getTaskValidator`) |
| PUT    | `/:id`                 | Update task (`updateTaskValidator`)               |
| DELETE | `/:id`                 | Protected, Delete task (`deleteTaskValidator`)    |
| PUT    | `/:id/status/ongoing`  | Mark task as ongoing (`allowedTo('user')`)        |
| PUT    | `/:id/status/complete` | Mark task as complete (`allowedTo('user')`)       |
| USE    | `/:userId/tasks`       | Nested task routes by user ID                     |

## 👤 User Routes — /api/v2/users

| Method | Endpoint          | Middleware & Description                  |
| ------ | ----------------- | ----------------------------------------- |
| GET    | `/`               | Admin only – Get all users                |
| POST   | `/`               | Create a new user (`createUserValidator`) |
| GET    | `/deactivate`     | Get deactivated users                     |
| GET    | `/:id`            | Get specific user (`getUserValidator`)    |
| PUT    | `/:id`            | Update user (`updateUserValidator`)       |
| DELETE | `/:id`            | Delete user (`deleteUserValidator`)       |
| PUT    | `/:id/deactivate` | Deactivate a user                         |
| POST   | `/:id/activate`   | Activate a user                           |

## ❌ Fallback Route

If a non-existent endpoint is accessed:

```bash
ALL /api/v2/*
```

Responds with:

```text
{
  "error": "Can't find this route: /api/v2/invalid-path"
}
```

Handled via:

```text
app.all('*', (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 404));
});
```

## 📁 Base Route Setup (Express)

```text
app.use('/api/v2/users', userRoutes);
app.use('/api/v2/tasks', tasksRoutes);
app.use('/api/v2/auth', authRoutes);
```

## 🔐 Security & Authentication

| Package                                                                          | Description                                  |
| -------------------------------------------------------------------------------- | -------------------------------------------- |
| [`bcrypt`](https://www.npmjs.com/package/bcrypt)                                 | Library for hashing passwords securely.      |
| [`cookie-parser`](https://www.npmjs.com/package/cookie-parser)                   | Parse cookies from HTTP requests.            |
| [`cors`](https://www.npmjs.com/package/cors)                                     | Enable Cross-Origin Resource Sharing (CORS). |
| [`express-mongo-sanitize`](https://www.npmjs.com/package/express-mongo-sanitize) | Prevent NoSQL injection attacks.             |
| [`express-rate-limit`](https://www.npmjs.com/package/express-rate-limit)         | Rate limiting middleware to prevent abuse.   |
| [`xss-filters`](https://www.npmjs.com/package/xss-filters)                       | Sanitize output to prevent XSS attacks.      |
| [`jsonwebtoken`](https://www.npmjs.com/package/jsonwebtoken)                     | Create and verify JSON Web Tokens (JWT).     |

## 🚀 Express & Middleware

| Package                                                                        | Description                                              |
| ------------------------------------------------------------------------------ | -------------------------------------------------------- |
| [`express`](https://www.npmjs.com/package/express)                             | Fast, minimalist web framework for Node.js.              |
| [`express-async-handler`](https://www.npmjs.com/package/express-async-handler) | Simplify error handling in async Express routes.         |
| [`express-validator`](https://www.npmjs.com/package/express-validator)         | Middleware for validating and sanitizing request inputs. |
| [`morgan`](https://www.npmjs.com/package/morgan)                               | HTTP request logger middleware for debugging.            |

## 🛢️ Database

| Package                                              | Description                          |
| ---------------------------------------------------- | ------------------------------------ |
| [`mongoose`](https://www.npmjs.com/package/mongoose) | MongoDB object modeling for Node.js. |

## ✉️ Email & Communication

| Package                                                  | Description                              |
| -------------------------------------------------------- | ---------------------------------------- |
| [`nodemailer`](https://www.npmjs.com/package/nodemailer) | Module to send emails from Node.js apps. |

## 🕒 Utilities

| Package                                            | Description                                            |
| -------------------------------------------------- | ------------------------------------------------------ |
| [`dotenv`](https://www.npmjs.com/package/dotenv)   | Load environment variables from `.env` file.           |
| [`luxon`](https://www.npmjs.com/package/luxon)     | Powerful date/time library (alternative to Moment.js). |
| [`slugify`](https://www.npmjs.com/package/slugify) | Generate URL-friendly slugs from strings.              |

## 🧪 Testing

| Package                                                | Description                              |
| ------------------------------------------------------ | ---------------------------------------- |
| [`supertest`](https://www.npmjs.com/package/supertest) | Test HTTP endpoints easily with Node.js. |
