#!/bin/bash

# Script to start both backend and frontend servers with port cleanup

echo "Starting Patient Profile Management Application..."

# Function to kill processes using specific ports
kill_port_processes() {
    local port=$1
    echo "🔍 Checking for processes using port $port..."

    # Find and kill processes using the specified port using lsof if available
    if command -v lsof >/dev/null 2>&1; then
        local pids=$(lsof -ti:$port 2>/dev/null)
        if [ ! -z "$pids" ]; then
            echo "💥 Found processes on port $port: $pids"
            kill -9 $pids 2>/dev/null
            echo "✅ Processes on port $port killed"
        else
            echo "✅ No processes found on port $port"
        fi
    else
        # Fallback: attempt to kill common server processes that might be using these ports
        echo "⚠️ lsof not found, using fallback method for port $port"
        echo "💡 Tip: Install lsof for more reliable port cleanup: sudo apt-get install lsof (Ubuntu/Debian)"

        # Kill any Python processes that might be running uvicorn on the backend port
        if [ "$port" -eq 8000 ]; then
            pkill -f "uvicorn.*:8000" 2>/dev/null || true
            pkill -f "python.*8000" 2>/dev/null || true
            echo "✅ Killed processes potentially using port $port (fallback method)"
        fi

        # Kill any Node.js processes that might be for the frontend development server
        if [ "$port" -eq 3000 ]; then
            pkill -f "node.*3000" 2>/dev/null || true
            pkill -f "webpack.*3000" 2>/dev/null || true
            pkill -f "react.*3000" 2>/dev/null || true
            echo "✅ Killed processes potentially using port $port (fallback method)"
        fi
    fi
}

# Ensure ports are free before starting
echo "🔒 Ensuring required ports are free..."
kill_port_processes 8000  # Backend port
kill_port_processes 3000  # Frontend port
sleep 2  # Give some time for ports to be released

# Start backend server in the background
echo "Starting backend server..."
cd backend
python ../run_backend.py &
BACKEND_PID=$!
cd ..

# Start frontend server in the background
echo "Starting frontend server..."
cd frontend
npm start &
FRONTEND_PID=$!

# Store process IDs for later use
echo $BACKEND_PID > backend_pid.txt
echo $FRONTEND_PID > frontend_pid.txt

echo "Application started!"
echo "Backend server running at http://localhost:8000"
echo "Frontend server running at http://localhost:3000"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID