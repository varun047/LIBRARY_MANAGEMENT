import { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout';
import { borrowBook, fetchTransactions, returnBook } from '../services/api.js';
import { fetchBooks, fetchUsers } from '../services/api.js';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [borrowForm, setBorrowForm] = useState({ user_id: '', book_id: '' });
  const [returnForm, setReturnForm] = useState({ user_id: '', book_id: '' });
  const [action, setAction] = useState('borrow');
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);

  function loadTransactions() {
    fetchTransactions()
      .then((data) => setTransactions(data.slice().reverse()))
      .catch(() => setError('Could not load transaction data.'));
  }

  useEffect(() => {
    loadTransactions();
    fetchUsers().then(setUsers).catch(() => undefined);
    fetchBooks().then(setBooks).catch(() => undefined);
  }, []);

  async function handleBorrow(event) {
    event.preventDefault();
    setError('');
    setSuccess('');
    try {
      const result = await borrowBook(borrowForm);
      if (!result.success) {
        setError(result.message || 'Could not borrow book.');
        return;
      }
      setSuccess(result.message || 'Book borrowed successfully.');
      setBorrowForm({ user_id: '', book_id: '' });
      loadTransactions();
    } catch {
      setError('Could not borrow book.');
    }
  }

  async function handleReturn(event) {
    event.preventDefault();
    setError('');
    setSuccess('');
    try {
      const result = await returnBook(returnForm);
      if (!result.success) {
        setError(result.message || 'Could not return book.');
        return;
      }
      setSuccess(result.message || 'Book returned successfully.');
      setReturnForm({ user_id: '', book_id: '' });
      loadTransactions();
    } catch {
      setError('Could not return book.');
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return transactions;
    }
    return transactions.filter((txn) =>
      [txn.transaction_id, txn.user_id, txn.book_id, txn.type].some((v) => String(v).toLowerCase().includes(q))
    );
  }, [transactions, query]);

  return (
    <Layout activePage="transactions">
      <div className="container">
        <div className="glass-panel p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h2 className="mb-0">Issue / Return Book</h2>
            <span className="text-soft">Perform circulation actions directly from this page</span>
          </div>
          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          <form
            className="row g-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (action === 'borrow') {
                handleBorrow(e);
              } else {
                handleReturn(e);
              }
            }}
          >
            <div className="col-md-3">
              <label className="form-label">Action</label>
              <select className="form-select form-control-modern" value={action} onChange={(e) => setAction(e.target.value)}>
                <option value="borrow">Borrow</option>
                <option value="return">Return</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Student</label>
              <select className="form-select form-control-modern" value={borrowForm.user_id} onChange={(e) => { setBorrowForm({ ...borrowForm, user_id: e.target.value }); setReturnForm({ ...returnForm, user_id: e.target.value }); }} required>
                <option value="">Select student</option>
                {users.map((u) => <option key={u.user_id} value={u.user_id}>{u.user_id} - {u.name}</option>)}
              </select>
            </div>
            <div className="col-md-5">
              <label className="form-label">Book</label>
              <select className="form-select form-control-modern" value={borrowForm.book_id} onChange={(e) => { setBorrowForm({ ...borrowForm, book_id: e.target.value }); setReturnForm({ ...returnForm, book_id: e.target.value }); }} required>
                <option value="">Select book</option>
                {books.map((b) => <option key={b.book_id} value={b.book_id}>{b.book_id} - {b.title}</option>)}
              </select>
            </div>
            <div className="col-12 d-flex gap-2">
              <button className="btn btn-neon" type="submit"><i className="fa-solid fa-check me-1" />Submit Action</button>
              <button className="btn btn-soft" type="button" onClick={() => { setBorrowForm({ user_id: '', book_id: '' }); setReturnForm({ user_id: '', book_id: '' }); }}>Reset</button>
            </div>
          </form>
        </div>
        <div className="glass-panel p-4">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h2 className="mb-0">Issued / Return Transactions</h2>
            <div className="d-flex align-items-center gap-2">
              <input className="form-control form-control-modern" placeholder="Search transactions..." value={query} onChange={(e) => setQuery(e.target.value)} />
              <span className="badge rounded-pill text-bg-dark-subtle">{filtered.length} Events</span>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-modern align-middle mb-0">
              <thead><tr><th>ID</th><th>User</th><th>Book</th><th>Type</th><th>Timestamp</th></tr></thead>
              <tbody>
                {filtered.length === 0 && <tr><td colSpan={5} className="text-center text-soft py-4">No transactions found.</td></tr>}
                {filtered.map((txn) => (
                  <tr key={txn.transaction_id}>
                    <td>{txn.transaction_id}</td>
                    <td>{txn.user_id}</td>
                    <td>{txn.book_id}</td>
                    <td><span className={`badge ${txn.type === 'borrow' ? 'badge-soft-warning' : 'badge-soft-success'}`}>{txn.type.toUpperCase()}</span></td>
                    <td>{new Date(txn.timestamp).toLocaleString()}</td>
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
