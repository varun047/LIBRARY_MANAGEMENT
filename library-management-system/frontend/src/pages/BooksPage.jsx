import { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import SearchBar from '../components/SearchBar';
import { addBook, fetchBooks } from '../lib/api.js';

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

  const columns = [
    { key: 'book_id', label: 'Book ID' },
    { key: 'title', label: 'Title' },
    { key: 'author', label: 'Author' },
    { key: 'isbn', label: 'ISBN' },
    {
      key: 'available',
      label: 'Available',
      render: (value, row) => {
        const available = Number(value || 0);
        const total = Number(row.total || 0);
        const cls = available > 0 ? 'badge badge-available rounded-pill' : 'badge badge-issued rounded-pill';
        return <span className={cls}>{available}</span>;
      }
    },
    { key: 'total', label: 'Total' }
  ];

  return (
    <Layout title="Books" subtitle="Inventory, availability, and title management.">
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <section className="glass-card fluid-card welcome-banner mb-4">
        <div>
          <p className="banner-eyebrow mb-2">Catalog Workspace</p>
          <h3 className="banner-title mb-2">Build and Manage Your Library Collection</h3>
          <p className="banner-text mb-0">
            Add titles, track availability, and maintain a clean searchable catalog for students and staff.
          </p>
        </div>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <span className="badge text-bg-light border">Total Records: {books.length}</span>
          <span className="badge text-bg-light border">Filtered View: {filtered.length}</span>
        </div>
      </section>

      <section className="card-elevated p-3 p-md-4 mb-4">
        <div className="panel-header">
          <div>
            <h3 className="h5 mb-1">Add New Book</h3>
            <p className="text-muted mb-0">Create a new inventory entry with complete metadata.</p>
          </div>
        </div>
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-12 col-md-4">
            <input className="form-control" placeholder="Book ID" value={form.book_id} onChange={(e) => setForm({ ...form, book_id: e.target.value })} required />
          </div>
          <div className="col-12 col-md-4">
            <input className="form-control" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="col-12 col-md-4">
            <input className="form-control" placeholder="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required />
          </div>
          <div className="col-12 col-md-4">
            <input className="form-control" placeholder="ISBN" value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} required />
          </div>
          <div className="col-12 col-md-4">
            <input type="number" className="form-control" placeholder="Publication Year" value={form.publication_year} onChange={(e) => setForm({ ...form, publication_year: e.target.value })} required />
          </div>
          <div className="col-6 col-md-2">
            <input type="number" className="form-control" min="0" placeholder="Available" value={form.copies_available} onChange={(e) => setForm({ ...form, copies_available: e.target.value })} required />
          </div>
          <div className="col-6 col-md-2">
            <input type="number" className="form-control" min="1" placeholder="Total" value={form.copies_total} onChange={(e) => setForm({ ...form, copies_total: e.target.value })} required />
          </div>
          <div className="col-12">
            <button className="btn btn-primary" type="submit">
              <i className="bi bi-plus-circle me-1" />
              Add Book
            </button>
          </div>
        </form>
      </section>

      <section className="card-elevated p-3 p-md-4">
        <div className="panel-header">
          <div>
            <h3 className="h5 mb-1">Books Catalog</h3>
            <p className="text-muted mb-0">Search by ID, title, author, or ISBN.</p>
          </div>
          <SearchBar value={query} onChange={setQuery} placeholder="Search by ID, title, author, or ISBN" />
        </div>
        <DataTable columns={columns} rows={filtered} emptyMessage="No books match this search." />
      </section>
    </Layout>
  );
}
