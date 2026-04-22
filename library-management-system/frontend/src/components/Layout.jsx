import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import ThemeToggle from './ThemeToggle.jsx';

export default function Layout({ children, activePage = 'home' }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <>
      <div className="site-bg-glow" />

      <nav className="navbar navbar-expand-lg navbar-dark app-navbar sticky-top">
        <div className="container">
          <Link className="navbar-brand brand-mark" to="/">
            <i className="fa-solid fa-book-open-reader me-2" />
            LibraryPro
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className={`navbar-collapse ${mobileOpen ? 'd-block mt-2' : 'd-none d-lg-block'}`}>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center gap-lg-1">
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/">
                  Home
                </NavLink>
              </li>
              {isAuthenticated && (
                <>
                  <li className="nav-item">
                    <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/dashboard">
                      Dashboard
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/books">
                      Books
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/users">
                      Students
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/transactions">
                      Issued
                    </NavLink>
                  </li>
                  <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                    <span className="badge rounded-pill text-bg-dark-subtle px-3 py-2">{(user || 'ADMIN').toUpperCase()}</span>
                  </li>
                  <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                    <button className="btn btn-sm btn-outline-light nav-pill" type="button" onClick={handleLogout}>
                      <i className="fa-solid fa-right-from-bracket me-1" />
                      Logout
                    </button>
                  </li>
                </>
              )}
              {!isAuthenticated && (
                <>
                  <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                    <Link className="btn btn-sm btn-outline-light nav-pill" to="/register">
                      <i className="fa-solid fa-user-plus me-1" />
                      Register
                    </Link>
                  </li>
                  <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                    <Link className="btn btn-sm btn-neon nav-pill" to="/login">
                      <i className="fa-solid fa-right-to-bracket me-1" />
                      Login
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-3">
        <div className="topbar-shell">
          <div className="topbar-icon">
            <ThemeToggle />
          </div>
          <nav className="topbar-nav" aria-label="Secondary navigation">
            <NavLink className={({ isActive }) => `topbar-link ${isActive || activePage === 'home' ? 'active' : ''}`} to="/">
              Overview
            </NavLink>
            {isAuthenticated && (
              <>
                <NavLink className={({ isActive }) => `topbar-link ${isActive ? 'active' : ''}`} to="/books">
                  Catalog
                </NavLink>
                <NavLink className={({ isActive }) => `topbar-link ${isActive ? 'active' : ''}`} to="/users">
                  Students
                </NavLink>
                <NavLink className={({ isActive }) => `topbar-link ${isActive ? 'active' : ''}`} to="/transactions">
                  Circulation
                </NavLink>
              </>
            )}
          </nav>
          <div className="topbar-actions" />
        </div>
      </div>

      <main className="py-4">{children}</main>

      <footer className="app-footer mt-4">
        <div className="container py-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
          <span>LibraryPro Management System</span>
          <span className="text-soft">React Frontend + Flask API</span>
        </div>
      </footer>
    </>
  );
}
