# Stoodius Backend Server

This is the backend server for the Stoodius application, built with Node.js, Express.js, and SQLite.

## Features

- User authentication (signup/signin)
- Password hashing with bcryptjs
- JWT token-based authentication
- SQLite database for user management
- CORS enabled for frontend communication

## Setup Instructions

1. Install dependencies:
   ```bash
   cd server
   npm install
   ```

2. Configure environment variables:
   - The `.env` file is already created with default values
   - **IMPORTANT**: Change the `JWT_SECRET` in production!

3. Start the server:
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

4. The server will run on `http://localhost:5000`

## API Endpoints

### Authentication

- **POST** `/api/auth/signup` - Create a new user account
  - Body: `{ fullName, email, password }`
  - Returns: JWT token and user info

- **POST** `/api/auth/signin` - Sign in to existing account
  - Body: `{ email, password }`
  - Returns: JWT token and user info

- **GET** `/api/auth/verify` - Verify JWT token
  - Headers: `Authorization: Bearer <token>`
  - Returns: User info

- **GET** `/api/health` - Health check endpoint

## Database Schema

### Users Table
- `id` - INTEGER (Primary Key, Auto-increment)
- `full_name` - TEXT
- `email` - TEXT (Unique)
- `password` - TEXT (Hashed)
- `created_at` - DATETIME
- `updated_at` - DATETIME

## Security Notes

- Passwords are hashed using bcryptjs with salt rounds
- JWT tokens expire after 7 days (configurable)
- CORS is enabled for cross-origin requests
- Email validation on signup
- Password minimum length: 6 characters
