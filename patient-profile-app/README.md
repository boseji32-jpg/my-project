# Patient Profile Management System

This application allows you to manage patient profiles with a FastAPI backend and React frontend. The system includes user authentication to ensure data privacy.   

## Features

- User authentication (signup, login, logout)
- Add new patient profiles
- View all patient profiles
- Edit existing patient profiles
- Delete patient profiles
- SQLite database for data persistence

## Technology Stack

- Backend: FastAPI, SQLAlchemy, SQLite
- Frontend: React, TypeScript
- Authentication: JWT tokens with password hashing
- Communication: REST API with JSON

## Prerequisites

- Python 3.8+
- Node.js and npm
- pip (Python package manager)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd patient-profile-app/backend
   ```

2. Install the required Python packages:
   ```
   pip install -r requirements.txt
   ```

3. Start the FastAPI server:
   ```
   python ../run_backend.py
   ```
   Or alternatively:
   ```
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

The backend API will be available at `http://localhost:8000`

Authentication API endpoints:
- `POST /users/signup` - Create a new user account
- `POST /users/login` - Login to existing account
- `POST /users/logout` - Logout (client-side token removal)

Patient API endpoints (require authentication):
- `GET /patients/` - Get all patients for authenticated user
- `POST /patients/` - Create a new patient for authenticated user
- `GET /patients/{id}` - Get a specific patient for authenticated user
- `PUT /patients/{id}` - Update a specific patient for authenticated user
- `DELETE /patients/{id}` - Delete a specific patient for authenticated user      

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd patient-profile-app/frontend
   ```

2. Install the required npm packages:
   ```
   npm install
   ```

3. Start the React development server:
   ```
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## Usage

1. Ensure the backend server is running on port 8000
2. Start the React frontend on port 3000
3. Access the application at `http://localhost:3000`
4. Sign up for an account or log in if you already have one
5. Use the form to add new patients or edit existing ones
6. The patient list will update automatically after each action
7. You can log out using the logout button in the header

## Project Structure

```
patient-profile-app/
├── backend/
│   ├── main.py          # FastAPI application with authentication
│   └── requirements.txt # Python dependencies
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # React components (login, signup, etc.)
│   │   ├── context/     # Authentication context
│   │   └── types.ts     # TypeScript type definitions
├── run_backend.py       # Backend startup script
├── start_app.sh         # Script to start both servers
├── stop_app.sh          # Script to stop both servers
└── README.md           # This file
```

## Database

The application uses SQLite for simplicity. The database file (`patients.db`) will be created automatically in the backend directory when you first run the application. Each user has their own set of patient profiles.

## Authentication

The application uses JWT (JSON Web Tokens) for authentication. Passwords are hashed before storage. After login, the JWT token is stored in localStorage and used for authenticating API requests to protected endpoints.