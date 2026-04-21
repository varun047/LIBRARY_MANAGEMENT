"""Book manager controller for library management system."""
from typing import Dict, List, Optional
from models.book import Book


class BookManager:
    """Manages all book-related operations."""
    
    def __init__(self):
        """Initialize the BookManager."""
        self.books: Dict[str, Book] = {}
    
    def add_book(self, book: Book) -> bool:
        """
        Add a new book to the library.
        
        Args:
            book: Book object to add
            
        Returns:
            True if added successfully, False if book ID already exists
        """
        if book.book_id not in self.books:
            self.books[book.book_id] = book
            return True
        return False
    
    def remove_book(self, book_id: str) -> bool:
        """
        Remove a book from the library.
        
        Args:
            book_id: ID of the book to remove
            
        Returns:
            True if removed successfully, False if book not found
        """
        if book_id in self.books:
            del self.books[book_id]
            return True
        return False
    
    def get_book(self, book_id: str) -> Optional[Book]:
        """Get a book by ID."""
        return self.books.get(book_id)
    
    def search_by_title(self, title: str) -> List[Book]:
        """Search books by title (partial match)."""
        title_lower = title.lower()
        return [book for book in self.books.values() 
                if title_lower in book.title.lower()]
    
    def search_by_author(self, author: str) -> List[Book]:
        """Search books by author (partial match)."""
        author_lower = author.lower()
        return [book for book in self.books.values() 
                if author_lower in book.author.lower()]
    
    def search_by_isbn(self, isbn: str) -> Optional[Book]:
        """Search books by ISBN."""
        for book in self.books.values():
            if book.isbn == isbn:
                return book
        return None
    
    def get_available_books(self) -> List[Book]:
        """Get all books with available copies."""
        return [book for book in self.books.values() 
                if book.is_available()]
    
    def get_all_books(self) -> List[Book]:
        """Get all books in the library."""
        return list(self.books.values())
    
    def update_book(self, book_id: str, **kwargs) -> bool:
        """
        Update book properties.
        
        Args:
            book_id: ID of the book to update
            **kwargs: Properties to update
            
        Returns:
            True if updated successfully, False if book not found
        """
        if book_id not in self.books:
            return False
        
        book = self.books[book_id]
        for key, value in kwargs.items():
            if hasattr(book, key):
                setattr(book, key, value)
        return True
