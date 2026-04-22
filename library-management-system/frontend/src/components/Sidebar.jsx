import { NavLink } from 'react-router-dom';
import { useEffect } from 'react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
  { to: '/books', label: 'Books', icon: 'bi-book' },
  { to: '/users', label: 'Users', icon: 'bi-people' },
  { to: '/transactions', label: 'Issued Books', icon: 'bi-arrow-left-right' }
];

export default function Sidebar({ mobile = false, onNavigate }) {
  useEffect(() => {
    const navButton = document.querySelector('.iridescent');
    if (!navButton) {
      return undefined;
    }

    const addTimer = window.setTimeout(() => {
      navButton.classList.add('shine');
    }, 500);

    const removeTimer = window.setTimeout(() => {
      navButton.classList.remove('shine');
    }, 3000);

    return () => {
      window.clearTimeout(addTimer);
      window.clearTimeout(removeTimer);
      navButton.classList.remove('shine');
    };
  }, []);

  return (
    <>
      <div className={`sidebar-brand ${mobile ? 'px-3 pt-3' : ''}`}>
        <span className="brand-dot" />
        <div>
          <h1 className="brand-title mb-0">LibraryPro</h1>
          <p className="brand-subtext mb-0">Education Suite</p>
        </div>
      </div>

      <nav className={`sidebar-links ${mobile ? 'p-3' : ''}`}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) => `side-link iridescent ${isActive ? 'active' : ''}`}
          >
            <span className="drop-shadow" aria-hidden="true" />
            <i className={`bi ${item.icon}`} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {!mobile && (
        <div className="sidebar-footer">
          <span className="status-pill">
            <i className="bi bi-shield-check me-1" />
            Secure API Connected
          </span>
        </div>
      )}
    </>
  );
}
