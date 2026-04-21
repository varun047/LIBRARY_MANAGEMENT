# Library Management System

A comprehensive Python application for managing library operations including books, users, borrowing transactions, and fines.

## Features

- **Book Management**: Add, remove, search, and track books and availability
- **User Management**: Register users, track borrowed books and outstanding fines
- **Admin Management**: Manage library administrators and their roles
- **Borrowing System**: Track book borrowing and returns with due dates
- **Fine System**: Automatic fine calculation for overdue books
- **Authentication**: User login and password management
- **Transaction Tracking**: Complete audit trail of all library transactions
- **Database**: File-based JSON database for data persistence

## Project Structure

```
library-management-system/
├── models/                 # Data models
│   ├── book.py            # Book model
│   ├── user.py            # User model
│   ├── admin.py           # Admin model
│   ├── transaction.py     # Transaction model
│   └── __init__.py
├── controllers/            # Business logic
│   ├── book_manager.py    # Book operations
│   ├── user_manager.py    # User operations
│   ├── admin_manager.py   # Admin operations
│   └── __init__.py
├── utils/                 # Utility functions
│   ├── database.py        # Database operations
│   ├── authentication.py  # Authentication
│   └── __init__.py
├── app.py                 # Main application (CLI mode)
├── web_app.py             # Flask REST API server
├── requirements.txt       # Project dependencies
├── README.md             # Project documentation
├── API_GUIDE.md          # API endpoint reference
├── .env.example          # Environment variables template
└── .gitignore
```

## Installation

1. Navigate to the project directory:
```bash
cd library-management-system
```

2. Create and activate a virtual environment:
```bash
python -m venv .venv
.venv\Scripts\activate  # Windows
# or
source .venv/bin/activate  # Linux/Mac
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

### Option 1: CLI Mode (Console Application)

Run the demo application:
```bash
python app.py
```

This runs a sample workflow demonstrating all core functionality.

### Option 2: REST API Mode (Web Server)

Start the Flask development server:
```bash
python web_app.py
```

Server runs at `http://localhost:5000`

See [API_GUIDE.md](API_GUIDE.md) for complete API documentation.

### Basic Operations

```python
from app import LibraryManagementSystem

# Initialize system
lms = LibraryManagementSystem()

# Add a book
lms.add_book("B001", "Python Programming", "Guido van Rossum", 
             "978-0134685991", 2019, copies_available=3, copies_total=3)

# Register a user
lms.register_user("U001", "John Doe", "john@example.com", "555-0001")

# Borrow a book
lms.borrow_book("U001", "B001")

# Get library statistics
stats = lms.get_library_statistics()
print(stats)
```

## Models

### Book
- book_id: Unique identifier
- title: Book title
- author: Author name
- isbn: ISBN number
- publication_year: Year published
- copies_available: Number of available copies
- copies_total: Total copies in library

### User
- user_id: Unique identifier
- name: Full name
- email: Email address
- phone: Phone number
- membership_date: Date joined
- borrowed_books: List of borrowed book IDs
- outstanding_fines: Total fines owed

### Admin
- admin_id: Unique identifier
- name: Full name
- email: Email address
- role: Admin role (librarian, manager, etc.)
- hire_date: Date hired
- is_active: Account status

### Transaction
- transaction_id: Unique identifier
- user_id: Associated user
- transaction_type: BORROW, RETURN, or FINE_PAYMENT
- book_id: Associated book (if applicable)
- amount: Amount involved (for fines)
- timestamp: When transaction occurred
- due_date: Due date (for borrows)

## Controllers

### BookManager
- add_book()
- remove_book()
- get_book()
- search_by_title()
- search_by_author()
- search_by_isbn()
- get_available_books()
- get_all_books()
- update_book()

### UserManager
- register_user()
- deregister_user()
- get_user()
- search_by_name()
- search_by_email()
- get_all_users()
- get_users_with_outstanding_fines()
- update_user()

### AdminManager
- add_admin()
- remove_admin()
- get_admin()
- get_all_admins()
- get_active_admins()
- deactivate_admin()
- activate_admin()
- update_admin()

## Configuration

Configuration can be adjusted in individual module files:
- Borrow period: 14 days (in `transaction.py`)
- Database path: `library_data.json` (in `utils/database.py`)

## Future Enhancements

- [ ] Web interface with Flask
- [ ] Email notifications for due dates
- [ ] Advanced search and filtering
- [ ] Bulk import/export functionality
- [ ] Reporting and analytics
- [ ] SMS notifications
- [ ] Mobile app
- [ ] API endpoint documentation

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For support, please open an issue in the repository.
