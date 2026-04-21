"""Admin manager controller for library management system."""
from typing import Dict, List, Optional
from models.admin import Admin


class AdminManager:
    """Manages all admin-related operations."""
    
    def __init__(self):
        """Initialize the AdminManager."""
        self.admins: Dict[str, Admin] = {}
    
    def add_admin(self, admin: Admin) -> bool:
        """
        Add a new admin.
        
        Args:
            admin: Admin object to add
            
        Returns:
            True if added successfully, False if admin ID already exists
        """
        if admin.admin_id not in self.admins:
            self.admins[admin.admin_id] = admin
            return True
        return False
    
    def remove_admin(self, admin_id: str) -> bool:
        """
        Remove an admin.
        
        Args:
            admin_id: ID of the admin to remove
            
        Returns:
            True if removed successfully, False if admin not found
        """
        if admin_id in self.admins:
            del self.admins[admin_id]
            return True
        return False
    
    def get_admin(self, admin_id: str) -> Optional[Admin]:
        """Get an admin by ID."""
        return self.admins.get(admin_id)
    
    def get_all_admins(self) -> List[Admin]:
        """Get all admins."""
        return list(self.admins.values())
    
    def get_active_admins(self) -> List[Admin]:
        """Get all active admins."""
        return [admin for admin in self.admins.values() 
                if admin.is_active]
    
    def deactivate_admin(self, admin_id: str) -> bool:
        """Deactivate an admin account."""
        admin = self.get_admin(admin_id)
        if admin:
            admin.deactivate()
            return True
        return False
    
    def activate_admin(self, admin_id: str) -> bool:
        """Activate an admin account."""
        admin = self.get_admin(admin_id)
        if admin:
            admin.activate()
            return True
        return False
    
    def update_admin(self, admin_id: str, **kwargs) -> bool:
        """
        Update admin properties.
        
        Args:
            admin_id: ID of the admin to update
            **kwargs: Properties to update
            
        Returns:
            True if updated successfully, False if admin not found
        """
        if admin_id not in self.admins:
            return False
        
        admin = self.admins[admin_id]
        for key, value in kwargs.items():
            if hasattr(admin, key) and not key.startswith('_'):
                setattr(admin, key, value)
        return True
