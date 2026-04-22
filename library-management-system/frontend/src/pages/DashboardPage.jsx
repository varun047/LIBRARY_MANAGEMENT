import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { fetchStatistics, fetchTransactions } from '../services/api.js';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([fetchStatistics(), fetchTransactions()])
      .then(([statistics, txns]) => {
        setStats(statistics);
        setTransactions(txns.slice(-5).reverse());
      })
      .catch(() => setError('Could not load dashboard data.'));
  }, []);

  return (
    <Layout activePage="dashboard">
      <div className="container fade-in-up">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="hero-glass p-4 p-md-5 mb-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <h2 className="mb-2">Admin Dashboard</h2>
              <p className="text-soft mb-0">Monitor inventory, circulation, registrations, and overdue performance.</p>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <Link className="btn btn-neon" to="/books">
                <i className="fa-solid fa-plus me-1" />
                Manage Books
              </Link>
              <Link className="btn btn-soft" to="/transactions">
                <i className="fa-solid fa-arrow-right-arrow-left me-1" />
                Issued Records
              </Link>
            </div>
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-6 col-xl-3">
            <div className="showcase-card pastel-mint p-4 h-100">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-soft mb-1">Total Books</p>
                  <h3 className="mb-0">{stats?.total_books_unique ?? 0}</h3>
                </div>
                <i className="fa-solid fa-book icon-chip" />
              </div>
            </div>
          </div>
          <div className="col-md-6 col-xl-3">
            <div className="showcase-card pastel-sky p-4 h-100">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-soft mb-1">Issued Books</p>
                  <h3 className="mb-0">{stats?.borrowed_copies ?? 0}</h3>
                </div>
                <i className="fa-solid fa-book-open icon-chip" />
              </div>
            </div>
          </div>
          <div className="col-md-6 col-xl-3">
            <div className="showcase-card pastel-lavender p-4 h-100">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-soft mb-1">Students Registered</p>
                  <h3 className="mb-0">{stats?.registered_users ?? 0}</h3>
                </div>
                <i className="fa-solid fa-user-graduate icon-chip" />
              </div>
            </div>
          </div>
          <div className="col-md-6 col-xl-3">
            <div className="showcase-card pastel-peach p-4 h-100">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-soft mb-1">Overdue Books</p>
                  <h3 className="mb-0">{Math.max(0, transactions.filter((txn) => txn.type === 'borrow').length - (stats?.borrowed_copies ?? 0))}</h3>
                </div>
                <i className="fa-solid fa-clock icon-chip" />
              </div>
            </div>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-xl-8">
            <div className="glass-panel p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">Recent Issued Books</h4>
                <Link className="btn btn-sm btn-soft" to="/transactions">
                  View All
                </Link>
              </div>
              <div className="table-responsive">
                <table className="table table-modern align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Book</th>
                      <th>Student</th>
                      <th>Issued Date</th>
                      <th>Due Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center text-soft py-4">No recent issued books available.</td>
                      </tr>
                    )}
                    {transactions.slice(0, 8).map((item) => (
                      <tr key={item.transaction_id}>
                        <td>{item.book_id}</td>
                        <td>{item.user_id}</td>
                        <td>{new Date(item.timestamp).toLocaleDateString()}</td>
                        <td>-</td>
                        <td>
                          <span className={`badge ${item.type === 'borrow' ? 'badge-soft-warning' : 'badge-soft-success'}`}>
                            {item.type === 'borrow' ? 'Issued' : 'Returned'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-xl-4">
            <div className="glass-panel p-4 h-100">
              <h4 className="mb-3">Quick Actions</h4>
              <div className="d-grid gap-2">
                <Link className="btn btn-soft text-start" to="/books"><i className="fa-solid fa-plus me-2" />Add / Manage Books</Link>
                <Link className="btn btn-soft text-start" to="/users"><i className="fa-solid fa-users me-2" />View Students</Link>
                <Link className="btn btn-soft text-start" to="/register"><i className="fa-solid fa-user-plus me-2" />Register New Student</Link>
                <Link className="btn btn-soft text-start" to="/transactions"><i className="fa-solid fa-arrow-right-arrow-left me-2" />Issue / Return Records</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
