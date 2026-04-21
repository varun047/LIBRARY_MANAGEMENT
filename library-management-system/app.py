"""
Library Management System - Main Application
A comprehensive system for managing library books, users, and transactions.
"""

from models.book import Book
from models.user import User
from models.admin import Admin
from models.transaction import Transaction, TransactionType
from controllers.book_manager import BookManager
from controllers.user_manager import UserManager
from controllers.admin_manager import AdminManager
from utils.database import Database
from utils.authentication import Authentication


class LibraryManagementSystem:
    """Main library management system."""
    
    def __init__(self):
        """Initialize the Library Management System."""
        self.book_manager = BookManager()
        self.user_manager = UserManager()
        self.admin_manager = AdminManager()
        self.database = Database()
        self.authentication = Authentication()
        self.transactions = []
    
    def add_book(
        self,
        book_id: str,
        title: str,
        author: str,
        isbn: str,
        publication_year: int,
        copies_available: int = 1,
        copies_total: int = 1
    ) -> bool:
        """Add a new book to the library."""
        book = Book(
            book_id=book_id,
            title=title,
            author=author,
            isbn=isbn,
            publication_year=publication_year,
            copies_available=copies_available,
            copies_total=copies_total
        )
        return self.book_manager.add_book(book)
    
    def register_user(
        self,
        user_id: str,
        name: str,
        email: str,
        phone: str
    ) -> bool:
        """Register a new user."""
        user = User(
            user_id=user_id,
            name=name,
            email=email,
            phone=phone
        )
        return self.user_manager.register_user(user)
    
    def borrow_book(self, user_id: str, book_id: str) -> bool:
        """
        Borrow a book for a user.
        
        Returns:
            True if book borrowed successfully, False otherwise
        """
        user = self.user_manager.get_user(user_id)
        book = self.book_manager.get_book(book_id)
        
        if not user or not book:
            return False
        
        if book.borrow_book():
            user.add_borrowed_book(book_id)
            transaction = Transaction(
                transaction_id=f"TXN_{len(self.transactions)+1}",
                user_id=user_id,
                transaction_type=TransactionType.BORROW,
                book_id=book_id
            )
            self.transactions.append(transaction)
            return True
        return False
    
    def return_book(self, user_id: str, book_id: str) -> bool:
        """
        Return a book.
        
        Returns:
            True if book returned successfully, False otherwise
        """
        user = self.user_manager.get_user(user_id)
        book = self.book_manager.get_book(book_id)
        
        if not user or not book:
            return False
        
        if user.remove_borrowed_book(book_id):
            book.return_book()
            transaction = Transaction(
                transaction_id=f"TXN_{len(self.transactions)+1}",
                user_id=user_id,
                transaction_type=TransactionType.RETURN,
                book_id=book_id
            )
            self.transactions.append(transaction)
            return True
        return False
    
    def get_user_dashboard(self, user_id: str) -> dict:
        """Get user dashboard information."""
        user = self.user_manager.get_user(user_id)
        if not user:
            return {}
        
        return {
            'user_id': user.user_id,
            'name': user.name,
            'email': user.email,
            'borrowed_books': user.get_borrowed_books_count(),
            'outstanding_fines': user.outstanding_fines,
            'membership_date': user.membership_date.isoformat()
        }
    
    def get_library_statistics(self) -> dict:
        """Get overall library statistics."""
        books = self.book_manager.get_all_books()
        available_books = self.book_manager.get_available_books()
        users = self.user_manager.get_all_users()
        
        total_copies = sum(book.copies_total for book in books)
        total_available = sum(book.copies_available for book in books)
        total_borrowed = total_copies - total_available
        
        return {
            'total_books_unique': len(books),
            'total_copies': total_copies,
            'available_copies': total_available,
            'borrowed_copies': total_borrowed,
            'registered_users': len(users),
            'total_transactions': len(self.transactions)
        }
    
    def save_to_database(self) -> bool:
        """Save system state to database."""
        return self.database.save()
    
    def load_from_database(self) -> bool:
        """Load system state from database."""
        return self.database.load()


def main():
    """Main entry point."""
    print("=" * 60)
    print("Welcome to Library Management System")
    print("=" * 60)
    
    # Initialize system
    lms = LibraryManagementSystem()
    
    # Add sample books
    print("\nAdding sample books...")
    lms.add_book("B001", "Python Programming", "Guido van Rossum", "978-0134685991", 2019, 3, 3)
    lms.add_book("B002", "Clean Code", "Robert Martin", "978-0132350884", 2008, 2, 2)
    lms.add_book("B003", "Design Patterns", "Gang of Four", "978-0201633610", 1994, 1, 1)
    
    # Register sample users
    print("Registering sample users...")
    lms.register_user("U001", "John Doe", "john@example.com", "555-0001")
    lms.register_user("U002", "Jane Smith", "jane@example.com", "555-0002")
    
    # Perform transactions
    print("\nPerforming transactions...")
    lms.borrow_book("U001", "B001")
    lms.borrow_book("U001", "B002")
    lms.borrow_book("U002", "B003")
    
    # Display statistics
    print("\n" + "=" * 60)
    print("Library Statistics:")
    print("=" * 60)
    stats = lms.get_library_statistics()
    for key, value in stats.items():
        print(f"{key}: {value}")
    
    # Display user dashboard
    print("\n" + "=" * 60)
    print("User Dashboards:")
    print("=" * 60)
    for user_id in ["U001", "U002"]:
        dashboard = lms.get_user_dashboard(user_id)
        print(f"\nUser: {dashboard['name']}")
        print(f"  Borrowed Books: {dashboard['borrowed_books']}")
        print(f"  Outstanding Fines: ${dashboard['outstanding_fines']:.2f}")
    
    print("\n" + "=" * 60)
    print("System initialized successfully!")
    print("=" * 60)


if __name__ == "__main__":
    main()
