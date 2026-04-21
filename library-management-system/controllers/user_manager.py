"""User manager controller for library management system."""
from typing import Dict, List, Optional
from models.user import User


class UserManager:
    """Manages all user-related operations."""
    
    def __init__(self):
        """Initialize the UserManager."""
        self.users: Dict[str, User] = {}
    
    def register_user(self, user: User) -> bool:
        """
        Register a new user.
        
        Args:
            user: User object to register
            
        Returns:
            True if registered successfully, False if user ID already exists
        """
        if user.user_id not in self.users:
            self.users[user.user_id] = user
            return True
        return False
    
    def deregister_user(self, user_id: str) -> bool:
        """
        Remove a user from the system.
        
        Args:
            user_id: ID of the user to remove
            
        Returns:
            True if removed successfully, False if user not found
        """
        if user_id in self.users:
            del self.users[user_id]
            return True
        return False
    
    def get_user(self, user_id: str) -> Optional[User]:
        """Get a user by ID."""
        return self.users.get(user_id)
    
    def search_by_name(self, name: str) -> List[User]:
        """Search users by name (partial match)."""
        name_lower = name.lower()
        return [user for user in self.users.values() 
                if name_lower in user.name.lower()]
    
    def search_by_email(self, email: str) -> Optional[User]:
        """Search user by email."""
        for user in self.users.values():
            if user.email == email:
                return user
        return None
    
    def get_all_users(self) -> List[User]:
        """Get all registered users."""
        return list(self.users.values())
    
    def get_users_with_outstanding_fines(self) -> List[User]:
        """Get all users with outstanding fines."""
        return [user for user in self.users.values() 
                if user.outstanding_fines > 0]
    
    def update_user(self, user_id: str, **kwargs) -> bool:
        """
        Update user properties.
        
        Args:
            user_id: ID of the user to update
            **kwargs: Properties to update
            
        Returns:
            True if updated successfully, False if user not found
        """
        if user_id not in self.users:
            return False
        
        user = self.users[user_id]
        for key, value in kwargs.items():
            if hasattr(user, key) and not key.startswith('_'):
                setattr(user, key, value)
        return True
