"""User model for library management system."""
from datetime import datetime
from typing import List, Optional


class User:
    """Represents a regular user in the library."""
    
    def __init__(
        self,
        user_id: str,
        name: str,
        email: str,
        phone: str,
        membership_date: Optional[datetime] = None
    ):
        """
        Initialize a User object.
        
        Args:
            user_id: Unique identifier for the user
            name: User's full name
            email: User's email address
            phone: User's phone number
            membership_date: Date user joined the library
        """
        self.user_id = user_id
        self.name = name
        self.email = email
        self.phone = phone
        self.membership_date = membership_date or datetime.now()
        self.borrowed_books: List[str] = []
        self.outstanding_fines = 0.0
    
    def add_borrowed_book(self, book_id: str) -> None:
        """Add a book to user's borrowed list."""
        if book_id not in self.borrowed_books:
            self.borrowed_books.append(book_id)
    
    def remove_borrowed_book(self, book_id: str) -> bool:
        """Remove a book from user's borrowed list."""
        if book_id in self.borrowed_books:
            self.borrowed_books.remove(book_id)
            return True
        return False
    
    def get_borrowed_books_count(self) -> int:
        """Get count of currently borrowed books."""
        return len(self.borrowed_books)
    
    def add_fine(self, amount: float) -> None:
        """Add a fine to user's account."""
        if amount > 0:
            self.outstanding_fines += amount
    
    def pay_fine(self, amount: float) -> bool:
        """Pay a portion of the outstanding fines."""
        if 0 < amount <= self.outstanding_fines:
            self.outstanding_fines -= amount
            return True
        return False
    
    def __repr__(self) -> str:
        return f"User(id={self.user_id}, name='{self.name}', borrowed={len(self.borrowed_books)})"
