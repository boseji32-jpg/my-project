import uvicorn
import os
import sys
from pathlib import Path

# Add the backend directory to the Python path
backend_path = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_path))

def run_backend():
    """Run the FastAPI backend server"""
    print("Starting Patient Profile Management Backend Server...")
    print("Backend will be available at http://localhost:8000")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_dirs=[str(backend_path)],
    )

if __name__ == "__main__":
    run_backend()