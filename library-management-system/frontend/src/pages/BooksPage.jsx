import { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout';
import { addBook, fetchBooks } from '../services/api.js';

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    book_id: '',
    title: '',
    author: '',
    isbn: '',
    publication_year: '',
    copies_available: '1',
    copies_total: '1'
  });

  function loadBooks() {
    fetchBooks()
      .then(setBooks)
      .catch(() => setError('Could not load books data.'));
  }

  useEffect(() => {
    loadBooks();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      const result = await addBook({
        ...form,
        publication_year: Number(form.publication_year),
        copies_available: Number(form.copies_available),
        copies_total: Number(form.copies_total)
      });

      if (!result.success) {
        setError(result.message || 'Could not add book.');
        return;
      }

      setSuccess(result.message || 'Book added successfully.');
      setForm({
        book_id: '',
        title: '',
        author: '',
        isbn: '',
        publication_year: '',
        copies_available: '1',
        copies_total: '1'
      });
      loadBooks();
    } catch {
      setError('Could not add book. Please check your input.');
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return books;
    }
    return books.filter((book) =>
      [book.book_id, book.title, book.author, book.isbn].some((v) => String(v).toLowerCase().includes(q))
    );
  }, [books, query]);

  return (
    <Layout activePage="books">
      <div className="container">
        <div className="glass-panel p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h2 className="mb-0">Add New Book</h2>
            <span className="text-soft">Create inventory records from this page</span>
          </div>
          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-4"><label className="form-label">Book ID</label><input className="form-control form-control-modern" value={form.book_id} onChange={(e) => setForm({ ...form, book_id: e.target.value })} required /></div>
            <div className="col-md-4"><label className="form-label">Title</label><input className="form-control form-control-modern" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
            <div className="col-md-4"><label className="form-label">Author</label><input className="form-control form-control-modern" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required /></div>
            <div className="col-md-4"><label className="form-label">ISBN</label><input className="form-control form-control-modern" value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} required /></div>
            <div className="col-md-4"><label className="form-label">Publication Year</label><input type="number" className="form-control form-control-modern" value={form.publication_year} onChange={(e) => setForm({ ...form, publication_year: e.target.value })} required /></div>
            <div className="col-md-2"><label className="form-label">Available</label><input type="number" min="0" className="form-control form-control-modern" value={form.copies_available} onChange={(e) => setForm({ ...form, copies_available: e.target.value })} required /></div>
            <div className="col-md-2"><label className="form-label">Total</label><input type="number" min="1" className="form-control form-control-modern" value={form.copies_total} onChange={(e) => setForm({ ...form, copies_total: e.target.value })} required /></div>
            <div className="col-12 d-flex gap-2">
              <button className="btn btn-neon" type="submit"><i className="fa-solid fa-plus me-1" />Add Book</button>
              <button className="btn btn-soft" type="button" onClick={() => setForm({ book_id: '', title: '', author: '', isbn: '', publication_year: '', copies_available: '1', copies_total: '1' })}>Reset</button>
            </div>
          </form>
        </div>
        <div className="glass-panel p-4">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h2 className="mb-0">Books Inventory</h2>
            <div className="d-flex align-items-center gap-2">
              <input className="form-control form-control-modern" placeholder="Search books..." value={query} onChange={(e) => setQuery(e.target.value)} />
              <span className="badge rounded-pill text-bg-dark-subtle">{filtered.length} Records</span>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-modern align-middle mb-0">
              <thead><tr><th>ID</th><th>Title</th><th>Author</th><th>ISBN</th><th>Available</th><th>Total</th></tr></thead>
              <tbody>
                {filtered.length === 0 && <tr><td colSpan={6} className="text-center text-soft py-4">No books found.</td></tr>}
                {filtered.map((book) => (
                  <tr key={book.book_id}>
                    <td>{book.book_id}</td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.isbn}</td>
                    <td>{book.available}</td>
                    <td>{book.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
