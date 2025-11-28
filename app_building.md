



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

The application uses JWT (JSON Web Tokens) for authentication. Passwords are hashed before storage. After login, the JWT token is stored in localStorage and used fo[siva@E-5CG1420RHG patient-profile-app

  I have successfully created and verified the complete Patient Profile Management System with the following components and functionality:

  🧪 Comprehensive Testing Results:
  ✅ Backend API: All endpoints working (signup, login, patient CRUD operations)
  ✅ Database: SQLite database created and functioning with proper data persistence
  ✅ Authentication: JWT token system working correctly
  ✅ Frontend: React application compiles and runs without errors
  ✅ Integration: All components working together seamlessly

  📁 System Components Created:
   1. Backend (/backend/ directory)
      - FastAPI application with authentication
      - SQLAlchemy ORM with SQLite
      - JWT token-based security
      - Patient CRUD operations

   2. Frontend (/frontend/ directory)
      - React/TypeScript application
      - Bootstrap-styled UI
      - Authentication context
      - Patient management forms

   3. Scripts (in main directory)
      - start_system.sh - Complete startup/shutdown script
      - test_system.sh - Comprehensive verification script
      - run_backend.py - Backend startup utility
      - start_app.sh & stop_app.sh - Legacy startup scripts

   4. Documentation
      - README.md - Main project documentation
      - OPERATIONS.md - System operations guide

  🚀 Key Features Verified:
   - User signup and authentication
   - Patient profile creation, viewing, editing, and deletion
   - Database persistence with proper user isolation
   - Responsive web interface
   - Proper error handling and validation

  📊 Final Database State:
   - Database file: patients.db (exists and accessible)
   - Tables: users and patients (properly created)
   - Sample data: 3 users and 1 patient (from our tests)

  The Patient Profile Management System is now fully operational and ready for immediate use. The system includes all necessary scripts for starting, stopping, and
  testing the application, along with comprehensive documentation for ongoing operations.

> how to run the script

✦ To run the Patient Profile Management System, you can use the startup script I created. Here's how:

  Running the System

  1. Using the Startup Script (Recommended)

  From the main project directory:

   1 cd ~/patient-profile-app
   2 ./start_system.sh start
ss
  This will:
   - Start the backend server on port 8000
   - Start the frontend server on port 3000
   - Both servers will run in the background

  2. Check System Status

   1 ./start_system.sh status

  3. Access the Application
   - Frontend UI: Open your browser and go to http://localhost:3000
   - Backend API: Available at http://localhost:8000
   - API Docs: Visit http://localhost:8000/docs for API documentation

  4. Stopping the System

   1 ./start_system.sh stop

  5. Alternative: Manual Start
  If you prefer to start manually:

  Backend (Terminal 1):

   1 cd ~/patient-profile-app/backend
   2 source venv/bin/activate
   3 python -m uvicorn main:app --host 0.0.0.0 --port 8000

  Frontend (Terminal 2):

   1 cd ~/patient-profile-app/frontend
   2 npm start

  6. Running Tests
  To verify all components are working:

   1 ./test_system.sh

  7. System Operations

   1 ./start_system.sh [start|stop|restart|status]

  After starting, access the application at http://localhost:3000 in your browser to begin using the Patient Profile Management System.

  The system is fully configured and ready to use with authentication, patient management, and all features working properly!

> 