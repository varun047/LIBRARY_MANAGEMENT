"""Flask web application for Library Management System."""
from flask import Flask, request, jsonify
from flask_cors import CORS
from app import LibraryManagementSystem

app = Flask(__name__)
CORS(app)

# Initialize the library system
lms = LibraryManagementSystem()


# ===== BOOK ENDPOINTS =====
@app.route('/api/books', methods=['POST'])
def add_book():
    """Add a new book."""
    try:
        data = request.json
        success = lms.add_book(
            data['book_id'],
            data['title'],
            data['author'],
            data['isbn'],
            data['publication_year'],
            data.get('copies_available', 1),
            data.get('copies_total', 1)
        )
        return jsonify({
            'success': success,
            'message': 'Book added successfully' if success else 'Book ID already exists'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@app.route('/api/books', methods=['GET'])
def get_books():
    """Get all books."""
    books = lms.book_manager.get_all_books()
    return jsonify([{
        'book_id': b.book_id,
        'title': b.title,
        'author': b.author,
        'isbn': b.isbn,
        'available': b.copies_available,
        'total': b.copies_total
    } for b in books])


@app.route('/api/books/<book_id>', methods=['GET'])
def get_book(book_id):
    """Get a specific book."""
    book = lms.book_manager.get_book(book_id)
    if not book:
        return jsonify({'error': 'Book not found'}), 404
    return jsonify({
        'book_id': book.book_id,
        'title': book.title,
        'author': book.author,
        'isbn': book.isbn,
        'available': book.copies_available,
        'total': book.copies_total
    })


@app.route('/api/books/search/title', methods=['GET'])
def search_by_title():
    """Search books by title."""
    title = request.args.get('q', '')
    if not title:
        return jsonify({'error': 'Search query required'}), 400
    books = lms.book_manager.search_by_title(title)
    return jsonify([{
        'book_id': b.book_id,
        'title': b.title,
        'author': b.author,
        'available': b.copies_available
    } for b in books])


@app.route('/api/books/search/author', methods=['GET'])
def search_by_author():
    """Search books by author."""
    author = request.args.get('q', '')
    if not author:
        return jsonify({'error': 'Search query required'}), 400
    books = lms.book_manager.search_by_author(author)
    return jsonify([{
        'book_id': b.book_id,
        'title': b.title,
        'author': b.author,
        'available': b.copies_available
    } for b in books])


@app.route('/api/books/<book_id>', methods=['DELETE'])
def delete_book(book_id):
    """Delete a book."""
    success = lms.book_manager.remove_book(book_id)
    return jsonify({
        'success': success,
        'message': 'Book deleted' if success else 'Book not found'
    }, 404 if not success else 200)


# ===== USER ENDPOINTS =====
@app.route('/api/users', methods=['POST'])
def register_user():
    """Register a new user."""
    try:
        data = request.json
        success = lms.register_user(
            data['user_id'],
            data['name'],
            data['email'],
            data['phone']
        )
        return jsonify({
            'success': success,
            'message': 'User registered successfully' if success else 'User ID already exists'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@app.route('/api/users', methods=['GET'])
def get_users():
    """Get all users."""
    users = lms.user_manager.get_all_users()
    return jsonify([{
        'user_id': u.user_id,
        'name': u.name,
        'email': u.email,
        'phone': u.phone,
        'borrowed_books': u.get_borrowed_books_count(),
        'outstanding_fines': u.outstanding_fines
    } for u in users])


@app.route('/api/users/<user_id>', methods=['GET'])
def get_user_dashboard(user_id):
    """Get user dashboard."""
    dashboard = lms.get_user_dashboard(user_id)
    if not dashboard:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(dashboard)


@app.route('/api/users/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    """Delete a user."""
    success = lms.user_manager.deregister_user(user_id)
    return jsonify({
        'success': success,
        'message': 'User deleted' if success else 'User not found'
    }, 404 if not success else 200)


# ===== BORROWING ENDPOINTS =====
@app.route('/api/borrow', methods=['POST'])
def borrow_book():
    """Borrow a book."""
    try:
        data = request.json
        success = lms.borrow_book(data['user_id'], data['book_id'])
        return jsonify({
            'success': success,
            'message': 'Book borrowed successfully' if success else 'Failed to borrow book'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@app.route('/api/return', methods=['POST'])
def return_book():
    """Return a book."""
    try:
        data = request.json
        success = lms.return_book(data['user_id'], data['book_id'])
        return jsonify({
            'success': success,
            'message': 'Book returned successfully' if success else 'Failed to return book'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


# ===== STATISTICS ENDPOINTS =====
@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    """Get library statistics."""
    stats = lms.get_library_statistics()
    return jsonify(stats)


@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    """Get all transactions."""
    transactions = lms.transactions
    return jsonify([{
        'transaction_id': t.transaction_id,
        'user_id': t.user_id,
        'type': t.transaction_type.value,
        'book_id': t.book_id,
        'timestamp': t.timestamp.isoformat()
    } for t in transactions])


# ===== HEALTH CHECKS =====
@app.route('/api/health', methods=['GET'])
def health():
    """Health check."""
    return jsonify({'status': 'healthy', 'service': 'Library Management System'})


@app.route('/', methods=['GET'])
def index():
    """API information."""
    return jsonify({
        'service': 'Library Management System API',
        'version': '1.0.0',
        'endpoints': {
            'books': '/api/books',
            'users': '/api/users',
            'borrow': '/api/borrow',
            'return': '/api/return',
            'statistics': '/api/statistics',
            'health': '/api/health'
        }
    })


# Error handler
@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return jsonify({'error': 'Endpoint not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors."""
    return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    print("=" * 60)
    print("Library Management System - Web API")
    print("=" * 60)
    print("Starting Flask server on http://localhost:5000")
    print("\nAPI Documentation:")
    print("  GET  /              - API info")
    print("  GET  /api/health    - Health check")
    print("  POST /api/books     - Add book")
    print("  GET  /api/books     - Get all books")
    print("  GET  /api/books/<id> - Get book by ID")
    print("  POST /api/users     - Register user")
    print("  GET  /api/users     - Get all users")
    print("  POST /api/borrow    - Borrow book")
    print("  POST /api/return    - Return book")
    print("  GET  /api/statistics - Library stats")
    print("=" * 60)
    app.run(debug=True, port=5000, host='0.0.0.0')
