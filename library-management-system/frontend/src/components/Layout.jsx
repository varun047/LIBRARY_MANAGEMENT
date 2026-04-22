import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '@theme-toggles/react/css/Classic.css';
import { Classic } from '@theme-toggles/react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: 'bi-speedometer2' },
  { to: '/books', label: 'Books', icon: 'bi-book' },
  { to: '/users', label: 'Users', icon: 'bi-people' },
  { to: '/transactions', label: 'Issued Books', icon: 'bi-arrow-left-right' }
];

export default function Layout({ title, subtitle, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('lms-theme');
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('lms-theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }

  return (
    <div className="app-shell">
      <div className="app-bg" />

      <aside className="sidebar-shell d-none d-lg-flex">
        <div className="sidebar-brand">
          <span className="brand-dot" />
          <div>
            <h1 className="brand-title mb-0">LibrarySaaS</h1>
            <p className="brand-subtext mb-0">Education Suite</p>
          </div>
        </div>

        <nav className="sidebar-links">{navItems.map(renderNav)}</nav>

        <div className="sidebar-footer">
          <span className="status-pill">
            <i className="bi bi-shield-check me-1" />
            Secure API Connected
          </span>
        </div>
      </aside>

      {mobileOpen && (
        <div className="mobile-overlay d-lg-none" onClick={() => setMobileOpen(false)}>
          <aside className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="sidebar-brand px-3 pt-3">
              <span className="brand-dot" />
              <div>
                <h2 className="brand-title mb-0">LibrarySaaS</h2>
                <p className="brand-subtext mb-0">Education Suite</p>
              </div>
            </div>
            <nav className="sidebar-links p-3">{navItems.map((item) => renderNav(item, () => setMobileOpen(false)))}</nav>
          </aside>
        </div>
      )}

      <main className="app-content">
        <header className="top-nav glass-card fluid-card top-nav-card">
          <button
            className="btn btn-icon d-lg-none"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            <i className="bi bi-list" />
          </button>

          <div className="search-wrap ms-0 ms-lg-2 flex-grow-1">
            <i className="bi bi-search" />
            <input className="form-control" placeholder="Search books, users, transactions..." />
          </div>

          <div className="top-actions">
            <Classic
              className="theme-toggle-react"
              duration={750}
              aria-label="Toggle theme"
              title="Toggle theme"
              toggled={theme === 'dark'}
              toggle={() => toggleTheme()}
            />
            <button className="btn btn-icon-soft" aria-label="Notifications">
              <i className="bi bi-bell" />
            </button>
            <span className="avatar-chip">AD</span>
          </div>
        </header>

        <section className="content-inner">
          <div className="page-title-wrap">
            <h2 className="section-title">{title}</h2>
            <p className="section-subtitle mb-0">{subtitle}</p>
          </div>

          {children}
        </section>

        <footer className="app-footer px-4 py-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
            <small className="text-muted">Library Management SaaS Panel</small>
            <small className="text-muted">React (Vite) frontend + Flask API backend</small>
          </div>
        </footer>
      </main>
    </div>
  );
}

function renderNav(item, onClick) {
  return (
    <NavLink
      key={item.to}
      to={item.to}
      end={item.to === '/'}
      onClick={onClick}
      className={({ isActive }) => `side-link iridescent ${isActive ? 'active' : ''}`}
    >
      <span className="drop-shadow" aria-hidden="true" />
      <i className={`bi ${item.icon}`} />
      <span>{item.label}</span>
    </NavLink>
  );
}
