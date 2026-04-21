import { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import SearchBar from '../components/SearchBar';
import { borrowBook, fetchTransactions, returnBook } from '../lib/api';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [borrowForm, setBorrowForm] = useState({ user_id: '', book_id: '' });
  const [returnForm, setReturnForm] = useState({ user_id: '', book_id: '' });

  function loadTransactions() {
    fetchTransactions()
      .then((data) => setTransactions(data.slice().reverse()))
      .catch(() => setError('Could not load transaction data.'));
  }

  useEffect(() => {
    loadTransactions();
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

  const columns = [
    { key: 'transaction_id', label: 'Txn ID' },
    { key: 'user_id', label: 'User ID' },
    { key: 'book_id', label: 'Book ID' },
    {
      key: 'type',
      label: 'Type',
      render: (value) => <span className="badge badge-soft text-uppercase">{value}</span>
    },
    {
      key: 'timestamp',
      label: 'Timestamp',
      render: (value) => new Date(value).toLocaleString()
    }
  ];

  return (
    <Layout title="Issued Books" subtitle="Borrow and return transaction timeline.">
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <section className="row g-3 mb-4">
        <div className="col-12 col-lg-6">
          <div className="card-elevated p-3 p-md-4 h-100">
            <div className="panel-header">
              <h3 className="h5 mb-0">Borrow Book</h3>
            </div>
            <form className="row g-3" onSubmit={handleBorrow}>
              <div className="col-12">
                <input className="form-control" placeholder="User ID" value={borrowForm.user_id} onChange={(e) => setBorrowForm({ ...borrowForm, user_id: e.target.value })} required />
              </div>
              <div className="col-12">
                <input className="form-control" placeholder="Book ID" value={borrowForm.book_id} onChange={(e) => setBorrowForm({ ...borrowForm, book_id: e.target.value })} required />
              </div>
              <div className="col-12">
                <button className="btn btn-primary" type="submit">Borrow</button>
              </div>
            </form>
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="card-elevated p-3 p-md-4 h-100">
            <div className="panel-header">
              <h3 className="h5 mb-0">Return Book</h3>
            </div>
            <form className="row g-3" onSubmit={handleReturn}>
              <div className="col-12">
                <input className="form-control" placeholder="User ID" value={returnForm.user_id} onChange={(e) => setReturnForm({ ...returnForm, user_id: e.target.value })} required />
              </div>
              <div className="col-12">
                <input className="form-control" placeholder="Book ID" value={returnForm.book_id} onChange={(e) => setReturnForm({ ...returnForm, book_id: e.target.value })} required />
              </div>
              <div className="col-12">
                <button className="btn btn-primary" type="submit">Return</button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="card-elevated p-3 p-md-4">
        <div className="panel-header">
          <h3 className="h5 mb-0">Issued and Returned Books</h3>
          <SearchBar value={query} onChange={setQuery} placeholder="Search by transaction, user, book, or type" />
        </div>
        <DataTable columns={columns} rows={filtered} emptyMessage="No transactions match this search." />
      </section>
    </Layout>
  );
}
