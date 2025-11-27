import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError

# Test database creation first
try:
    db_path = os.path.abspath("patients.db")
    print(f"Database path: {db_path}")
    
    engine = create_engine(f"sqlite:///{db_path}", connect_args={"check_same_thread": False})
    connection = engine.connect()
    print("Database connection successful")
    connection.close()
    
    # If this works, try importing main
    print("Now testing import of main module...")
    from main import app
    print("Import successful!")
    
except SQLAlchemyError as e:
    print(f"SQLAlchemy Error: {e}")
except Exception as e:
    print(f"General Error: {e}")
    import traceback
    traceback.print_exc()