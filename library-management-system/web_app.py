"""Flask web application for Library Management System."""
import os
import re
from functools import wraps
from pathlib import Path
from flask import Flask, request, jsonify, send_from_directory, render_template, redirect, url_for, session
from flask_cors import CORS
from app import LibraryManagementSystem

BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIST = BASE_DIR / 'frontend' / 'dist'

app = Flask(__name__, static_folder='static', template_folder='templates')
app.config['SECRET_KEY'] = 'librarypro-dev-secret-key'

# Comma-separated allow-list. Example:
# CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
cors_allowed_origins = [
    origin.strip() for origin in os.getenv('CORS_ALLOWED_ORIGINS', '').split(',') if origin.strip()
]
if not cors_allowed_origins:
    cors_allowed_origins = [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:3000',
        'http://127.0.0.1:3000'
    ]

CORS(
    app,
    resources={r"/*": {"origins": cors_allowed_origins}},
    supports_credentials=True,
    methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allow_headers=['Content-Type', 'Authorization', 'X-Requested-With'],
    expose_headers=['Content-Type']
)

# Initialize the library system
lms = LibraryManagementSystem()


def get_request_data() -> dict:
    """Return JSON body or form payload as a dictionary."""
    if request.is_json:
        return request.get_json(silent=True) or {}
    return request.form.to_dict() if request.form else {}


def build_dashboard_context() -> dict:
    """Prepare dashboard data for Jinja templates."""
    stats = lms.get_library_statistics()
    recent = list(lms.transactions)[-8:]

    recent_issued_books = []
    for txn in reversed(recent):
        user = lms.user_manager.get_user(txn.user_id)
        book = lms.book_manager.get_book(txn.book_id) if txn.book_id else None
        status = 'Overdue' if txn.transaction_type.value == 'borrow' and txn.is_overdue() else 'Issued'
        recent_issued_books.append({
            'book_id': txn.book_id,
            'book_title': book.title if book else txn.book_id,
            'user_id': txn.user_id,
            'student_name': user.name if user else txn.user_id,
            'issued_date': txn.timestamp.strftime('%Y-%m-%d'),
            'due_date': txn.due_date.strftime('%Y-%m-%d') if txn.due_date else '-',
            'status': status
        })

    overdue_books = sum(
        1 for txn in lms.transactions
        if txn.transaction_type.value == 'borrow' and txn.is_overdue()
    )

    return {
        'total_books': stats.get('total_books_unique', 0),
        'issued_books': stats.get('borrowed_copies', 0),
        'students_registered': stats.get('registered_users', 0),
        'overdue_books': overdue_books,
        'recent_issued_books': recent_issued_books
    }


def prefers_json() -> bool:
    """Return True when the current request expects a JSON response."""
    if request.path.startswith('/api'):
        return True
    best = request.accept_mimetypes.best_match(['application/json', 'text/html'])
    return best == 'application/json' and request.accept_mimetypes[best] > request.accept_mimetypes['text/html']


def validate_registration_form(form: dict) -> str:
    """Validate registration payload and return an error message when invalid."""
    user_id = form.get('user_id', '').strip()
    name = form.get('name', '').strip()
    email = form.get('email', '').strip()
    phone = form.get('phone', '').strip()

    if not user_id or not name or not email or not phone:
        return 'All fields are required.'
    if len(user_id) < 3:
        return 'User ID must be at least 3 characters.'
    if len(name) < 2:
        return 'Full name must be at least 2 characters.'
    if not re.fullmatch(r'[^@\s]+@[^@\s]+\.[^@\s]+', email):
        return 'Please enter a valid email address.'
    if not re.fullmatch(r'[0-9+\-()\s]{7,20}', phone):
        return 'Please enter a valid phone number.'
    return ''


def is_authenticated() -> bool:
    """Return True if current browser session is authenticated."""
    return bool(session.get('is_authenticated'))


def login_required_page(view_func):
    """Require an authenticated session for HTML pages."""
    @wraps(view_func)
    def wrapper(*args, **kwargs):
        if not is_authenticated():
            return redirect(url_for('login_page', next=request.path))
        return view_func(*args, **kwargs)
    return wrapper


@app.context_processor
def inject_auth_context():
    """Expose auth state to all Jinja templates."""
    return {
        'is_authenticated': is_authenticated(),
        'current_identity': session.get('identity', '')
    }


# ===== FLASK PAGES =====
@app.route('/', methods=['GET'])
def home_page():
    """Render marketing-style home page."""
    stats = lms.get_library_statistics()
    return render_template(
        'home.html',
        total_books=stats.get('total_books_unique', 0),
        issued_books=stats.get('borrowed_copies', 0),
        students_registered=stats.get('registered_users', 0),
        total_transactions=stats.get('total_transactions', 0)
    )


@app.route('/dashboard', methods=['GET'])
@login_required_page
def dashboard_page():
    """Render admin dashboard page."""
    return render_template('dashboard.html', **build_dashboard_context())


@app.route('/books', methods=['GET', 'POST'])
@login_required_page
def books_page():
    """Render books page and handle add-book form submissions."""
    success_message = ''
    error_message = ''

    if request.method == 'POST':
        data = get_request_data()
        required_fields = ['book_id', 'title', 'author', 'isbn', 'publication_year']
        missing = [field for field in required_fields if not str(data.get(field, '')).strip()]

        if missing:
            message = f"Missing required fields: {', '.join(missing)}"
            if request.is_json or prefers_json():
                return jsonify({'success': False, 'error': message}), 400
            error_message = message
        else:
            try:
                success = lms.add_book(
                    str(data['book_id']).strip(),
                    str(data['title']).strip(),
                    str(data['author']).strip(),
                    str(data['isbn']).strip(),
                    int(data['publication_year']),
                    int(data.get('copies_available', 1)),
                    int(data.get('copies_total', 1))
                )

                if request.is_json or prefers_json():
                    return jsonify({
                        'success': success,
                        'message': 'Book added successfully' if success else 'Book ID already exists'
                    }, 200 if success else 409)

                if success:
                    success_message = 'Book added successfully.'
                else:
                    error_message = 'Book ID already exists.'
            except Exception as e:
                if request.is_json or prefers_json():
                    return jsonify({'success': False, 'error': str(e)}), 400
                error_message = str(e)

    books = lms.book_manager.get_all_books()
    return render_template('books.html', books=books, success_message=success_message, error_message=error_message)


@app.route('/users', methods=['GET', 'POST'])
@login_required_page
def users_page():
    """Render users page and handle user creation."""
    success_message = ''
    error_message = ''
    form_values = {'user_id': '', 'name': '', 'email': '', 'phone': ''}

    if request.method == 'POST':
        data = get_request_data()
        form_values = {
            'user_id': str(data.get('user_id', '')).strip(),
            'name': str(data.get('name', '')).strip(),
            'email': str(data.get('email', '')).strip(),
            'phone': str(data.get('phone', '')).strip(),
        }
        validation_error = validate_registration_form(form_values)
        if validation_error:
            if request.is_json or prefers_json():
                return jsonify({'success': False, 'error': validation_error}), 400
            error_message = validation_error
        else:
            try:
                success = lms.register_user(
                    form_values['user_id'],
                    form_values['name'],
                    form_values['email'],
                    form_values['phone']
                )
                if request.is_json or prefers_json():
                    return jsonify({
                        'success': success,
                        'message': 'User registered successfully' if success else 'User ID already exists'
                    }, 200 if success else 409)
                if success:
                    success_message = 'Student registered successfully.'
                    form_values = {'user_id': '', 'name': '', 'email': '', 'phone': ''}
                else:
                    error_message = 'User ID already exists.'
            except Exception as e:
                if request.is_json or prefers_json():
                    return jsonify({'success': False, 'error': str(e)}), 400
                error_message = str(e)

    users = lms.user_manager.get_all_users()
    return render_template(
        'users.html',
        users=users,
        success_message=success_message,
        error_message=error_message,
        form_values=form_values
    )


@app.route('/transactions', methods=['GET', 'POST'])
@login_required_page
def transactions_page():
    """Render transactions page and handle borrow/return actions."""
    success_message = ''
    error_message = ''
    form_values = {'user_id': '', 'book_id': '', 'action': 'borrow'}

    if request.method == 'POST':
        data = get_request_data()
        action = str(data.get('action', 'borrow')).strip().lower()
        user_id = str(data.get('user_id', '')).strip()
        book_id = str(data.get('book_id', '')).strip()
        form_values = {'user_id': user_id, 'book_id': book_id, 'action': action}

        if action not in ('borrow', 'return'):
            message = 'Invalid action. Choose borrow or return.'
            if request.is_json or prefers_json():
                return jsonify({'success': False, 'error': message}), 400
            error_message = message
        elif not user_id or not book_id:
            message = 'User ID and Book ID are required.'
            if request.is_json or prefers_json():
                return jsonify({'success': False, 'error': message}), 400
            error_message = message
        else:
            success = lms.borrow_book(user_id, book_id) if action == 'borrow' else lms.return_book(user_id, book_id)
            message = 'Book borrowed successfully.' if action == 'borrow' else 'Book returned successfully.'
            fail_message = 'Failed to borrow book.' if action == 'borrow' else 'Failed to return book.'

            if request.is_json or prefers_json():
                return jsonify({'success': success, 'message': message if success else fail_message}), (200 if success else 400)

            if success:
                success_message = message
                form_values = {'user_id': '', 'book_id': '', 'action': action}
            else:
                error_message = fail_message

    users = lms.user_manager.get_all_users()
    books = lms.book_manager.get_all_books()
    return render_template(
        'transactions.html',
        transactions=list(reversed(lms.transactions)),
        success_message=success_message,
        error_message=error_message,
        form_values=form_values,
        users=users,
        books=books
    )


@app.route('/register', methods=['GET', 'POST'])
def register_page():
    """Render register page and handle simple user registration."""
    success_message = ''
    error_message = ''
    form_values = {'user_id': '', 'name': '', 'email': '', 'phone': ''}

    if request.method == 'POST':
        form_values = {
            'user_id': request.form.get('user_id', '').strip(),
            'name': request.form.get('name', '').strip(),
            'email': request.form.get('email', '').strip(),
            'phone': request.form.get('phone', '').strip(),
        }
        error_message = validate_registration_form(form_values)
        if not error_message:
            try:
                success = lms.register_user(
                    form_values['user_id'],
                    form_values['name'],
                    form_values['email'],
                    form_values['phone']
                )
                if success:
                    success_message = 'Registration successful. You can now login.'
                    form_values = {'user_id': '', 'name': '', 'email': '', 'phone': ''}
                else:
                    error_message = 'User ID already exists.'
            except Exception as exc:
                error_message = f'Failed to register user: {exc}'

    return render_template(
        'register.html',
        success_message=success_message,
        error_message=error_message,
        form_values=form_values
    )


# ===== BOOK ENDPOINTS =====
@app.route('/api/books', methods=['POST'])
def add_book():
    """Add a new book."""
    try:
        data = get_request_data()
        success = lms.add_book(
            data['book_id'],
            data['title'],
            data['author'],
            data['isbn'],
            int(data['publication_year']),
            int(data.get('copies_available', 1)),
            int(data.get('copies_total', 1))
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
        data = get_request_data()
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
@app.route('/borrow', methods=['POST'])
def borrow_book():
    """Borrow a book."""
    try:
        data = get_request_data()
        success = lms.borrow_book(data['user_id'], data['book_id'])
        return jsonify({
            'success': success,
            'message': 'Book borrowed successfully' if success else 'Failed to borrow book'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@app.route('/api/return', methods=['POST'])
@app.route('/return', methods=['POST'])
def return_book():
    """Return a book."""
    try:
        data = get_request_data()
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


@app.route('/api', methods=['GET'])
def api_index():
    """API information."""
    return jsonify({
        'service': 'Library Management System API',
        'version': '1.0.0',
        'endpoints': {
            'books': '/api/books',
            'books_alias': '/books',
            'users': '/api/users',
            'users_alias': '/users',
            'borrow': '/api/borrow',
            'borrow_alias': '/borrow',
            'return': '/api/return',
            'return_alias': '/return',
            'statistics': '/api/statistics',
            'health': '/api/health'
        }
    })


@app.route('/login', methods=['GET', 'POST'])
def login_page():
    """Render login page and handle basic form submission."""
    error_message = ''
    identity_value = ''

    next_path = request.args.get('next', '/dashboard')

    if request.method == 'POST':
        identity = request.form.get('identity', '').strip()
        password = request.form.get('password', '').strip()
        next_path = request.form.get('next', '/dashboard')
        identity_value = identity

        if not identity or not password:
            error_message = 'Please enter email/username and password.'
        elif len(password) < 4:
            error_message = 'Password must be at least 4 characters.'
        else:
            session['is_authenticated'] = True
            session['identity'] = identity
            if not next_path.startswith('/'):
                next_path = '/dashboard'
            return redirect(next_path)

    return render_template(
        'login.html',
        error_message=error_message,
        identity_value=identity_value,
        next_path=next_path
    )


@app.route('/logout', methods=['POST'])
def logout_page():
    """Clear auth session and return to home."""
    session.clear()
    return redirect(url_for('home_page'))


@app.route('/app', defaults={'path': ''})
@app.route('/app/<path:path>')
def serve_react_app(path):
    """Serve React SPA bundle under /app when available."""
    if path.startswith('api'):
        return jsonify({'error': 'Endpoint not found'}), 404

    if FRONTEND_DIST.exists():
        target = FRONTEND_DIST / path
        if path and target.exists() and target.is_file():
            return send_from_directory(str(FRONTEND_DIST), path)
        return send_from_directory(str(FRONTEND_DIST), 'index.html')

    return jsonify({
        'service': 'Library Management System API',
        'frontend': 'React app not built yet',
        'hint': 'Run: cd frontend && npm install && npm run build'
    })


@app.route('/assets/<path:path>')
def serve_react_assets(path):
    """Serve built React static assets for /app entry."""
    assets_dir = FRONTEND_DIST / 'assets'
    if assets_dir.exists():
        return send_from_directory(str(assets_dir), path)
    return jsonify({'error': 'Frontend assets not found'}), 404


# Error handler
@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    if prefers_json():
        return jsonify({'error': 'Endpoint not found'}), 404
    return render_template('404.html'), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors."""
    if prefers_json():
        return jsonify({'error': 'Internal server error'}), 500
    return render_template('500.html'), 500


if __name__ == '__main__':
    print("=" * 60)
    print("Library Management System - Web API")
    print("=" * 60)
    print("Starting Flask server on http://localhost:5000")
    print("\nAPI Documentation:")
    print("  GET  /              - Flask home page")
    print("  GET  /login         - Login page")
    print("  GET  /dashboard     - Admin dashboard")
    print("  GET  /app           - React frontend (optional)")
    print("  GET  /api           - API info")
    print("  GET  /api/health    - Health check")
    print("  POST /api/books     - Add book")
    print("  POST /books         - Add book (alias)")
    print("  GET  /api/books     - Get all books")
    print("  GET  /api/books/<id> - Get book by ID")
    print("  POST /api/users     - Register user")
    print("  POST /users         - Register user (alias)")
    print("  GET  /api/users     - Get all users")
    print("  POST /api/borrow    - Borrow book")
    print("  POST /borrow        - Borrow book (alias)")
    print("  POST /api/return    - Return book")
    print("  POST /return        - Return book (alias)")
    print("  GET  /api/statistics - Library stats")
    print("=" * 60)
    app.run(debug=True, port=5000, host='0.0.0.0')
