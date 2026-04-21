"""Admin model for library management system."""
from datetime import datetime
from typing import Optional


class Admin:
    """Represents an admin user in the library."""
    
    def __init__(
        self,
        admin_id: str,
        name: str,
        email: str,
        role: str = "librarian",
        hire_date: Optional[datetime] = None
    ):
        """
        Initialize an Admin object.
        
        Args:
            admin_id: Unique identifier for the admin
            name: Admin's full name
            email: Admin's email address
            role: Admin's role (librarian, manager, etc.)
            hire_date: Date admin was hired
        """
        self.admin_id = admin_id
        self.name = name
        self.email = email
        self.role = role
        self.hire_date = hire_date or datetime.now()
        self.is_active = True
    
    def deactivate(self) -> None:
        """Deactivate the admin account."""
        self.is_active = False
    
    def activate(self) -> None:
        """Activate the admin account."""
        self.is_active = True
    
    def __repr__(self) -> str:
        return f"Admin(id={self.admin_id}, name='{self.name}', role='{self.role}')"
