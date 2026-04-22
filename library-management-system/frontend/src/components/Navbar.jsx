import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import ThemeToggle from './ThemeToggle.jsx';

export default function Navbar({ onMenuClick, searchPlaceholder = 'Search books, users, transactions...' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <header className="top-nav glass-card fluid-card top-nav-card">
      <button className="btn btn-icon d-lg-none" onClick={onMenuClick} aria-label="Toggle navigation">
        <i className="bi bi-list" />
      </button>

      <div className="search-wrap ms-0 ms-lg-2 flex-grow-1">
        <i className="bi bi-search" />
        <input
          className="form-control"
          placeholder={searchPlaceholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <div className="top-actions">
        <ThemeToggle />
        <button className="btn btn-icon-soft" aria-label="Notifications">
          <i className="bi bi-bell" />
        </button>
        <span className="avatar-chip">{(user || 'AD').slice(0, 2).toUpperCase()}</span>
        <button className="btn btn-outline-primary btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
