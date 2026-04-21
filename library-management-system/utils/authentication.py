"""Authentication utilities for library management system."""
import hashlib
from typing import Dict, Optional


class Authentication:
    """Handles user authentication."""
    
    def __init__(self):
        """Initialize the Authentication system."""
        self.credentials: Dict[str, str] = {}
        self.logged_in_users: Dict[str, str] = {}
    
    def hash_password(self, password: str) -> str:
        """
        Hash a password using SHA-256.
        
        Args:
            password: Password to hash
            
        Returns:
            Hashed password
        """
        return hashlib.sha256(password.encode()).hexdigest()
    
    def register_user(self, user_id: str, password: str) -> bool:
        """
        Register a user with a password.
        
        Args:
            user_id: User ID
            password: User password
            
        Returns:
            True if registered successfully, False if user already exists
        """
        if user_id not in self.credentials:
            self.credentials[user_id] = self.hash_password(password)
            return True
        return False
    
    def authenticate(self, user_id: str, password: str) -> bool:
        """
        Authenticate a user.
        
        Args:
            user_id: User ID
            password: User password
            
        Returns:
            True if authentication successful
        """
        if user_id in self.credentials:
            return self.credentials[user_id] == self.hash_password(password)
        return False
    
    def login(self, user_id: str, password: str) -> bool:
        """
        Log in a user.
        
        Args:
            user_id: User ID
            password: User password
            
        Returns:
            True if login successful
        """
        if self.authenticate(user_id, password):
            self.logged_in_users[user_id] = user_id
            return True
        return False
    
    def logout(self, user_id: str) -> bool:
        """
        Log out a user.
        
        Args:
            user_id: User ID to log out
            
        Returns:
            True if logout successful
        """
        if user_id in self.logged_in_users:
            del self.logged_in_users[user_id]
            return True
        return False
    
    def is_logged_in(self, user_id: str) -> bool:
        """Check if a user is logged in."""
        return user_id in self.logged_in_users
    
    def change_password(self, user_id: str, old_password: str, new_password: str) -> bool:
        """
        Change a user's password.
        
        Args:
            user_id: User ID
            old_password: Current password
            new_password: New password
            
        Returns:
            True if password changed successfully
        """
        if self.authenticate(user_id, old_password):
            self.credentials[user_id] = self.hash_password(new_password)
            return True
        return False
