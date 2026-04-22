import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loader from '../components/Loader.jsx';
import { fetchStatistics } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Layout from '../components/Layout.jsx';

export default function HomePage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchStatistics().then(setStats).catch(() => setError('Could not load live snapshot.'));
  }, []);

  return (
    <Layout activePage="home">
      <section className="container">
        <div className="hero-glass p-4 p-md-5 mb-4">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <span className="badge text-bg-dark-subtle mb-3 px-3 py-2 rounded-pill">Modern Library Operations</span>
              <h1 className="display-5 fw-bold mb-3 hero-title">Manage Your Library With Premium Simplicity</h1>
              <p className="lead text-soft mb-4">
                Track books, issued records, student registrations, and overdue activity through a professional dashboard designed for modern institutions.
              </p>
              <div className="d-flex flex-wrap gap-2">
                {isAuthenticated ? (
                  <>
                    <Link className="btn btn-neon btn-lg" to="/dashboard">
                      <i className="fa-solid fa-chart-line me-2" />
                      Go to Dashboard
                    </Link>
                    <Link className="btn btn-soft btn-lg" to="/books">
                      <i className="fa-solid fa-book me-2" />
                      Manage Books
                    </Link>
                  </>
                ) : (
                  <>
                    <Link className="btn btn-neon btn-lg" to="/login">
                      <i className="fa-solid fa-right-to-bracket me-2" />
                      Login
                    </Link>
                    <Link className="btn btn-outline-light btn-lg" to="/register">
                      <i className="fa-solid fa-user-plus me-2" />
                      Register
                    </Link>
                    <Link className="btn btn-soft btn-lg" to="/dashboard">
                      <i className="fa-solid fa-chart-line me-2" />
                      View Dashboard
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="col-lg-5">
              <div className="glass-panel p-4 h-100">
                <h5 className="mb-3">Live Snapshot</h5>
                {!stats && !error ? (
                  <Loader label="Loading..." />
                ) : (
                  <div className="d-grid gap-2">
                    <div className="d-flex justify-content-between">
                      <span className="text-soft">Total Books</span>
                      <strong>{stats?.total_books_unique ?? 0}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-soft">Issued Books</span>
                      <strong>{stats?.borrowed_copies ?? 0}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-soft">Students Registered</span>
                      <strong>{stats?.registered_users ?? 0}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-soft">Transactions</span>
                      <strong>{stats?.total_transactions ?? 0}</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <section className="container mb-4">
          <div className="alert alert-danger mb-0">{error}</div>
        </section>
      )}

      <section className="container mb-4">
        <div className="row g-3">
          <div className="col-md-6 col-xl-3">
            <div className="showcase-card pastel-mint h-100 p-4">
              <i className="fa-solid fa-book icon-chip mb-3" />
              <h5>Book Inventory</h5>
              <p className="text-soft mb-0">Track availability and catalog details in real time.</p>
            </div>
          </div>
          <div className="col-md-6 col-xl-3">
            <div className="showcase-card pastel-sky h-100 p-4">
              <i className="fa-solid fa-arrow-right-arrow-left icon-chip mb-3" />
              <h5>Issue &amp; Return</h5>
              <p className="text-soft mb-0">Manage circulation flow with quick and clear actions.</p>
            </div>
          </div>
          <div className="col-md-6 col-xl-3">
            <div className="showcase-card pastel-lavender h-100 p-4">
              <i className="fa-solid fa-user-graduate icon-chip mb-3" />
              <h5>Student Records</h5>
              <p className="text-soft mb-0">Maintain member data and borrowing insights efficiently.</p>
            </div>
          </div>
          <div className="col-md-6 col-xl-3">
            <div className="showcase-card pastel-peach h-100 p-4">
              <i className="fa-solid fa-clock icon-chip mb-3" />
              <h5>Overdue Alerts</h5>
              <p className="text-soft mb-0">Surface delays early and improve return compliance.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mb-4">
        <div className="glass-panel p-4 p-md-5">
          <div className="row g-4 align-items-center">
            <div className="col-lg-6">
              <h3 className="mb-3">Why Choose LibraryPro?</h3>
              <ul className="feature-list">
                <li><i className="fa-solid fa-check" /> Premium SaaS-inspired interface for better productivity</li>
                <li><i className="fa-solid fa-check" /> End-to-end tracking for books, users, and transactions</li>
                <li><i className="fa-solid fa-check" /> Built with Flask + Jinja for lightweight deployment</li>
                <li><i className="fa-solid fa-check" /> Responsive design for desktop, tablet, and mobile staff use</li>
              </ul>
            </div>
            <div className="col-lg-6">
              <div className="row g-3">
                <div className="col-6">
                  <div className="stat-counter glass-mini p-3 text-center">
                    <h3 className="counter">{stats?.total_books_unique ?? 0}</h3>
                    <p className="mb-0 text-soft">Books</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="stat-counter glass-mini p-3 text-center">
                    <h3 className="counter">{stats?.registered_users ?? 0}</h3>
                    <p className="mb-0 text-soft">Students</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="stat-counter glass-mini p-3 text-center">
                    <h3 className="counter">{stats?.borrowed_copies ?? 0}</h3>
                    <p className="mb-0 text-soft">Issued</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="stat-counter glass-mini p-3 text-center">
                    <h3 className="counter">{stats?.total_transactions ?? 0}</h3>
                    <p className="mb-0 text-soft">Transactions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
