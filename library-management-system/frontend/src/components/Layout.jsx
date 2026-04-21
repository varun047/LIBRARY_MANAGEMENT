import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: 'bi-speedometer2' },
  { to: '/books', label: 'Books', icon: 'bi-book' },
  { to: '/users', label: 'Users', icon: 'bi-people' },
  { to: '/transactions', label: 'Issued Books', icon: 'bi-arrow-left-right' }
];

export default function Layout({ title, subtitle, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-shell">
      <div className="app-bg" />
      <header className="top-nav">
        <div className="container-fluid px-3 px-md-4 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-icon d-lg-none"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation"
            >
              <i className="bi bi-list" />
            </button>
            <h1 className="brand-title mb-0">
              <i className="bi bi-journal-richtext me-2" />
              Library Admin
            </h1>
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="status-pill d-none d-md-inline-flex">
              <i className="bi bi-shield-check me-1" />
              System Online
            </span>
            <span className="avatar-chip">AD</span>
          </div>
        </div>
      </header>

      <div className="container-fluid px-0">
        <div className="row g-0">
          <aside className="col-lg-2 d-none d-lg-block sidebar-shell">
            <nav className="sidebar-links p-3">{navItems.map(renderNav)}</nav>
          </aside>

          {mobileOpen && (
            <div className="mobile-overlay d-lg-none" onClick={() => setMobileOpen(false)}>
              <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
                <nav className="sidebar-links p-3">{navItems.map((item) => renderNav(item, () => setMobileOpen(false)))}</nav>
              </div>
            </div>
          )}

          <main className="col-12 col-lg-10 app-content">
            <div className="content-inner">
              <div className="mb-4">
                <h2 className="section-title">{title}</h2>
                <p className="section-subtitle mb-0">{subtitle}</p>
              </div>
              {children}
            </div>
            <footer className="app-footer px-4 py-3">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
                <small className="text-muted">Library Management System Admin Panel</small>
                <small className="text-muted">React frontend with Flask API backend</small>
              </div>
            </footer>
          </main>
        </div>
      </div>
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
      className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}
    >
      <i className={`bi ${item.icon}`} />
      <span>{item.label}</span>
    </NavLink>
  );
}
