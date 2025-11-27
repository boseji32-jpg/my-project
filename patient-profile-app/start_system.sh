#!/bin/bash

# Startup script for Patient Profile Management System
# Starts both backend and frontend servers

echo "==============================================="
echo "Patient Profile Management System - Startup"
echo "==============================================="

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

        # Use netstat as an alternative to find processes on the port
        if command -v netstat >/dev/null 2>&1; then
            local pids=$(netstat -tulpn 2>/dev/null | grep :$port | awk '{print $7}' | cut -d'/' -f1 | grep -o '[0-9]*')
            if [ ! -z "$pids" ]; then
                echo "💥 Found processes on port $port: $pids (using netstat)"
                kill -9 $pids 2>/dev/null
                echo "✅ Processes on port $port killed (using netstat)"
            else
                echo "✅ No processes found on port $port (using netstat)"
            fi
        else
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
                pkill -f "react-scripts" 2>/dev/null || true
                echo "✅ Killed processes potentially using port $port (fallback method)"
            fi
        fi
    fi
}

# Function to ensure ports are free
ensure_ports_free() {
    echo "🔒 Ensuring required ports are free..."
    kill_port_processes 8000  # Backend port
    kill_port_processes 3000  # Frontend port
    sleep 2  # Give some time for ports to be released
}

# Function to start backend
start_backend() {
    echo "🚀 Starting Backend Server..."

    # Change to backend directory and activate virtual environment
    cd /home/bose/patient-profile-app/backend
    source venv/bin/activate

    # Start backend server in the background and capture PID
    nohup python -m uvicorn main:app --host 0.0.0.0 --port 8000 > backend.log 2>&1 &
    BACKEND_PID=$!
    echo "✅ Backend server started with PID: $BACKEND_PID"

    # Save PID to file for later use
    echo $BACKEND_PID > backend.pid
    echo "✅ Backend PID saved to backend.pid file"

    # Go back to main directory
    cd /home/bose/patient-profile-app
}

# Function to start frontend
start_frontend() {
    echo "🌐 Starting Frontend Server..."

    # Change to frontend directory
    cd /home/bose/patient-profile-app/frontend

    # Clean any potential lock files or cache that might interfere
    rm -f .port.lock 2>/dev/null || true
    rm -rf .react* 2>/dev/null || true

    # Use PORT environment variable but allow automatic fallback to another port
    # The FORCE_ENV variable can help ensure auto port selection happens automatically
    export PORT=3000
    export CHOKIDAR_USEPOLLING=true
    export GENERATE_SOURCEMAP=false
    export BROWSER=none  # Disable browser auto-opening
    export WDS_SOCKET_PORT=0  # Disable WebSocket connection
    export DANGEROUSLY_DISABLE_HOST_CHECK=true  # Allow external connections
    export SUGGEST=true  # Enable suggestions including port suggestions

    # Start the frontend service - CRA will automatically find a free port if 3000 is busy
    # We'll use nohup but also ensure the process has proper stdin to handle prompts
    nohup sh -c 'npx react-scripts start' < /dev/null > frontend.log 2>&1 &

    # Wait for the process to start
    sleep 5

    # Find the actual PID of the node process for the frontend
    FRONTEND_PID=$(pgrep -f "react-scripts start" | head -n1)
    if [ -z "$FRONTEND_PID" ]; then
        # Try to find any node process that might be the frontend server
        FRONTEND_PID=$(pgrep -f "node.*react-scripts" | head -n1)
    fi

    if [ -n "$FRONTEND_PID" ]; then
        echo "✅ Frontend server started with PID: $FRONTEND_PID"

        # Save PID to file for later use
        echo $FRONTEND_PID > frontend.pid
        echo "✅ Frontend PID saved to frontend.pid file"

        # Wait a bit more to allow for port selection if needed
        sleep 5

        # Determine which port is actually being used
        if command -v lsof >/dev/null 2>&1; then
            ACTUAL_PORT=$(lsof -i -P -n | grep $FRONTEND_PID | grep LISTEN | head -n1 | awk '{print $9}' | sed 's/.*://')
            if [ -n "$ACTUAL_PORT" ] && [ "$ACTUAL_PORT" != "3000" ]; then
                echo "ℹ️  Frontend is running on port $ACTUAL_PORT (auto-selected)"
                echo "ℹ️  Access the application at http://localhost:$ACTUAL_PORT"
            else
                echo "ℹ️  Frontend is running on port 3000"
            fi
        else
            echo "ℹ️  Frontend should be running on port 3000 or auto-selected alternative"
        fi
    else
        # If we still can't get the PID, try a different approach
        echo "⚠️ Could not determine frontend PID, but process should be running"
        echo "   Check frontend/frontend.log for details"
        # Show the last few lines of the log to see what happened
        tail -n 10 frontend.log
    fi

    # Go back to main directory
    cd /home/bose/patient-profile-app
}

# Function to stop both servers
stop_servers() {
    echo "🛑 Stopping all servers..."

    # Stop backend gracefully if PID file exists
    if [ -f "backend/backend.pid" ]; then
        BACKEND_PID=$(cat backend/backend.pid)
        if kill -0 $BACKEND_PID 2>/dev/null; then
            kill $BACKEND_PID
            echo "✅ Backend server stopped (PID: $BACKEND_PID)"
        fi
        rm backend/backend.pid
    fi

    # Stop frontend gracefully if PID file exists
    if [ -f "frontend/frontend.pid" ]; then
        FRONTEND_PID=$(cat frontend/frontend.pid)
        if kill -0 $FRONTEND_PID 2>/dev/null; then
            kill $FRONTEND_PID
            echo "✅ Frontend server stopped (PID: $FRONTEND_PID)"
        fi
        rm frontend/frontend.pid
    fi

    # Force kill any remaining processes on our ports
    ensure_ports_free

    echo "✅ All servers stopped"
}

# Main script logic
case "$1" in
    start)
        # Ensure ports are free before starting
        ensure_ports_free
        start_backend
        sleep 3  # Give backend time to start
        start_frontend
        echo "✅ Both servers are now running!"
        echo "   - Backend: http://localhost:8000"
        echo "   - Frontend: http://localhost:3000"
        echo ""
        echo "📋 To check the servers, run: $0 status"
        echo "📋 To stop the servers, run: $0 stop"
        ;;
    stop)
        stop_servers
        ;;
    restart)
        # Ensure ports are free before restarting
        ensure_ports_free
        stop_servers
        sleep 2
        $0 start
        ;;
    status)
        echo "🔍 Checking server status..."
        if [ -f "backend/backend.pid" ]; then
            BACKEND_PID=$(cat backend/backend.pid)
            if kill -0 $BACKEND_PID 2>/dev/null; then
                echo "✅ Backend server is running (PID: $BACKEND_PID)"
                echo "   Backend logs: backend/backend.log"
            else
                echo "❌ Backend server is not running"
            fi
        else
            echo "❓ Backend server status unknown - no PID file found"
        fi

        if [ -f "frontend/frontend.pid" ]; then
            FRONTEND_PID=$(cat frontend/frontend.pid)
            if kill -0 $FRONTEND_PID 2>/dev/null; then
                echo "✅ Frontend server is running (PID: $FRONTEND_PID)"

                # Determine which port the frontend is actually using
                if command -v lsof >/dev/null 2>&1; then
                    ACTUAL_PORT=$(lsof -i -P -n | grep $FRONTEND_PID | grep LISTEN | head -n1 | awk '{print $9}' | sed 's/.*://')
                    if [ -n "$ACTUAL_PORT" ]; then
                        echo "   Frontend URL: http://localhost:$ACTUAL_PORT"
                    else
                        echo "   Frontend URL: http://localhost:3000 (default, may be running on different port)"
                    fi
                else
                    echo "   Frontend URL: http://localhost:3000 (default)"
                fi
                echo "   Frontend logs: frontend/frontend.log"
            else
                echo "❌ Frontend server is not running"
            fi
        else
            echo "❓ Frontend server status unknown - no PID file found"
        fi
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status}"
        echo ""
        echo "Commands:"
        echo "  start   - Start both backend and frontend servers"
        echo "  stop    - Stop both servers"
        echo "  restart - Restart both servers"
        echo "  status  - Check status of both servers"
        echo ""
        echo "After starting:"
        echo "  - Access the application at http://localhost:3000"
        echo "  - Backend API available at http://localhost:8000"
        exit 1
        ;;
esac