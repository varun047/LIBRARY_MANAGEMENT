"""Database utilities for library management system."""
import json
from pathlib import Path
from typing import Any, Dict, List


class Database:
    """Simple file-based database for the library system."""
    
    def __init__(self, db_path: str = "library_data.json"):
        """
        Initialize the Database.
        
        Args:
            db_path: Path to the database file
        """
        self.db_path = Path(db_path)
        self.data: Dict[str, Any] = {
            'books': {},
            'users': {},
            'admins': {},
            'transactions': []
        }
        self.load()
    
    def load(self) -> bool:
        """Load data from the database file."""
        if self.db_path.exists():
            try:
                with open(self.db_path, 'r') as f:
                    self.data = json.load(f)
                return True
            except (json.JSONDecodeError, IOError):
                return False
        return True
    
    def save(self) -> bool:
        """Save data to the database file."""
        try:
            self.db_path.parent.mkdir(parents=True, exist_ok=True)
            with open(self.db_path, 'w') as f:
                json.dump(self.data, f, indent=2, default=str)
            return True
        except IOError:
            return False
    
    def get(self, key: str, default: Any = None) -> Any:
        """Get a value from the database."""
        return self.data.get(key, default)
    
    def set(self, key: str, value: Any) -> None:
        """Set a value in the database."""
        self.data[key] = value
    
    def clear(self) -> None:
        """Clear all data from the database."""
        self.data = {
            'books': {},
            'users': {},
            'admins': {},
            'transactions': []
        }
    
    def __repr__(self) -> str:
        return f"Database(path='{self.db_path}')"
