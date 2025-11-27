#!/bin/bash

# Script to stop both backend and frontend servers with port cleanup

echo "Stopping Patient Profile Management Application..."

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

# Stop backend gracefully if PID file exists
if [ -f "backend/backend.pid" ]; then
    BACKEND_PID=$(cat backend/backend.pid)
    if kill -0 $BACKEND_PID 2>/dev/null; then
        kill $BACKEND_PID
        echo "✅ Backend server stopped (PID: $BACKEND_PID)"
    else
        echo "❌ Backend server not running or PID file invalid"
    fi
    rm backend/backend.pid
else
    echo "❓ Backend PID file not found"
fi

# Stop frontend gracefully if PID file exists
if [ -f "frontend/frontend.pid" ]; then
    FRONTEND_PID=$(cat frontend/frontend.pid)
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        kill $FRONTEND_PID
        echo "✅ Frontend server stopped (PID: $FRONTEND_PID)"
    else
        echo "❌ Frontend server not running or PID file invalid"
    fi
    rm frontend/frontend.pid
else
    echo "❓ Frontend PID file not found"
fi

# Force kill any remaining processes on our ports
echo "🔒 Ensuring required ports are completely free..."
kill_port_processes 8000  # Backend port
kill_port_processes 3000  # Frontend port

echo "✅ Application stopped!"