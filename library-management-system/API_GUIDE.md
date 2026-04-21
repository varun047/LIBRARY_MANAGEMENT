# Library Management System API

A comprehensive Python REST API for library management using Flask.

## Quick Start

### 1. Install Dependencies
```bash
cd library-management-system
pip install -r requirements.txt
```

### 2. Run the API Server
```bash
python web_app.py
```

Server runs at `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /api/health
```

### Books
```
POST   /api/books              - Add a new book
GET    /api/books              - Get all books
GET    /api/books/<book_id>    - Get book details
GET    /api/books/search/title?q=<query>  - Search by title
GET    /api/books/search/author?q=<query> - Search by author
DELETE /api/books/<book_id>    - Delete a book
```

### Users
```
POST   /api/users              - Register a user
GET    /api/users              - Get all users
GET    /api/users/<user_id>    - Get user dashboard
DELETE /api/users/<user_id>    - Delete a user
```

### Transactions
```
POST /api/borrow               - Borrow a book
POST /api/return               - Return a book
GET  /api/transactions         - Get all transactions
GET  /api/statistics           - Get library statistics
```

## Example Usage

### Add a Book
```bash
curl -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "book_id": "B001",
    "title": "Python Programming",
    "author": "Guido van Rossum",
    "isbn": "978-0134685991",
    "publication_year": 2019,
    "copies_available": 3,
    "copies_total": 3
  }'
```

### Register a User
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "U001",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-0001"
  }'
```

### Borrow a Book
```bash
curl -X POST http://localhost:5000/api/borrow \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "U001",
    "book_id": "B001"
  }'
```

### Get Library Statistics
```bash
curl http://localhost:5000/api/statistics
```

## Project Structure

```
library-management-system/
├── models/                    # Data models
│   ├── book.py
│   ├── user.py
│   ├── admin.py
│   ├── transaction.py
│   └── __init__.py
├── controllers/               # Business logic
│   ├── book_manager.py
│   ├── user_manager.py
│   ├── admin_manager.py
│   └── __init__.py
├── utils/                     # Utilities
│   ├── database.py
│   ├── authentication.py
│   └── __init__.py
├── app.py                     # Core application
├── web_app.py                 # Flask REST API
├── requirements.txt           # Dependencies
├── README.md                  # This file
└── .gitignore
```

## Running Tests

To test the API locally, use the example curls above or use a tool like Postman.

## Features

✅ Book management (add, search, track inventory)  
✅ User registration and dashboard  
✅ Book borrowing with 14-day loan period  
✅ Automatic fine calculation for overdue books  
✅ Complete transaction history  
✅ REST API with CORS support  
✅ JSON file-based database  

## Notes

- Default borrow period: 14 days
- Database file: `library_data.json`
- No external database required (file-based)
- All Python standard library dependencies only (except Flask)

## License

Open source - MIT License
