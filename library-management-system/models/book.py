"""Book model for library management system."""
from datetime import datetime
from typing import Optional


class Book:
    """Represents a book in the library."""
    
    def __init__(
        self,
        book_id: str,
        title: str,
        author: str,
        isbn: str,
        publication_year: int,
        copies_available: int = 1,
        copies_total: int = 1
    ):
        """
        Initialize a Book object.
        
        Args:
            book_id: Unique identifier for the book
            title: Title of the book
            author: Author name
            isbn: ISBN number
            publication_year: Year of publication
            copies_available: Number of available copies
            copies_total: Total copies in library
        """
        self.book_id = book_id
        self.title = title
        self.author = author
        self.isbn = isbn
        self.publication_year = publication_year
        self.copies_available = copies_available
        self.copies_total = copies_total
        self.created_at = datetime.now()
    
    def is_available(self) -> bool:
        """Check if at least one copy is available."""
        return self.copies_available > 0
    
    def borrow_book(self) -> bool:
        """Reduce available copies by one."""
        if self.is_available():
            self.copies_available -= 1
            return True
        return False
    
    def return_book(self) -> bool:
        """Increase available copies by one."""
        if self.copies_available < self.copies_total:
            self.copies_available += 1
            return True
        return False
    
    def __repr__(self) -> str:
        return f"Book(id={self.book_id}, title='{self.title}', available={self.copies_available})"
