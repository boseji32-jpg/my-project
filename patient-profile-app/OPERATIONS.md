# Patient Profile Management System - Operations Guide

## System Overview
This application provides a complete patient profile management solution with:
- FastAPI backend with user authentication
- React frontend with responsive UI
- SQLite database for data persistence
- JWT-based authentication system

## Quick Start

### Method 1: Using the startup script (Recommended)
```bash
# Start both servers
./start_system.sh start

# Check status
./start_system.sh status

# Stop servers
./start_system.sh stop

# Restart servers
./start_system.sh restart
```

### Method 2: Manual start
```bash
# Terminal 1: Start backend
cd patient-profile-app/backend
source venv/bin/activate
python -m uvicorn main:app --host 0.0.0.0 --port 8000

# Terminal 2: Start frontend  
cd patient-profile-app/frontend
npm start
```

## System Access
- **Frontend UI**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Available API Endpoints

### Authentication
- `POST /users/signup` - Create new user account
- `POST /users/login` - Login and get JWT token
- `POST /users/logout` - Logout

### Patient Management (requires authentication)
- `GET /patients/` - Get all patients for current user
- `POST /patients/` - Create new patient
- `GET /patients/{id}` - Get specific patient
- `PUT /patients/{id}` - Update specific patient
- `DELETE /patients/{id}` - Delete specific patient

## System Architecture

### Backend (Python/FastAPI)
- User authentication with JWT tokens
- Password hashing with bcrypt
- SQLite database with SQLAlchemy ORM
- Pydantic models for request/response validation

### Frontend (React/TypeScript)
- Bootstrap-based responsive UI
- Authentication context management
- Patient CRUD operations
- Form validation and error handling

## Testing the System

A comprehensive test script is available:
```bash
# Run all system tests
./test_system.sh
```

This script tests:
- Backend API connectivity
- User signup/login/logout
- Patient CRUD operations
- Database connectivity
- Authentication flow

## Database
- SQLite database file: `patients.db` (created automatically)
- Database is created in the backend directory
- Each user's data is isolated by user ID

## Troubleshooting

### Common Issues
1. **Port already in use**: Kill existing processes with `pkill -f uvicorn` or `pkill -f react-scripts`
2. **Frontend proxy errors**: These are normal if backend isn't running on port 8000
3. **Permission errors**: Ensure all scripts are executable with `chmod +x`

### Health Checks
- Backend: `curl http://localhost:8000/docs`
- Frontend: Access http://localhost:3000 in browser
- API endpoints: See documentation at http://localhost:8000/docs

## Stopping the System
Always stop servers properly:
```bash
./start_system.sh stop
```

This ensures no zombie processes remain and the database is properly closed.

## Production Notes
- For production, consider using a more robust database like PostgreSQL
- Use environment variables for sensitive configuration
- Implement proper logging and monitoring
- Set up HTTPS for secure communication