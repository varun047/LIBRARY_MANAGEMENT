import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Layout from '../components/Layout.jsx';

export default function LoginPage() {
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(identity.trim(), password);
      if (!result.success) {
        setError(result.message || 'Invalid credentials.');
        return;
      }

      if (remember) {
        localStorage.setItem('lms-auth-user', identity.trim());
      }

      const nextPath = location.state?.from?.pathname || '/dashboard';
      navigate(nextPath, { replace: true });
    } catch {
      setError('Could not sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout activePage="login">
      <div className="container">
        <div className="glass-panel p-4 p-md-5 mx-auto" style={{ maxWidth: '560px' }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="mb-0">Admin Login</h2>
            <span className="text-soft">Secure access to your dashboard</span>
          </div>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-12">
              <label className="form-label">Email / Username</label>
              <input className="form-control form-control-modern" type="text" value={identity} onChange={(event) => setIdentity(event.target.value)} required />
            </div>
            <div className="col-12">
              <label className="form-label">Password</label>
              <input className="form-control form-control-modern" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            </div>
            <div className="col-12 d-flex justify-content-between align-items-center">
              <div className="form-check">
                <input id="remember" className="form-check-input" type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
                <label className="form-check-label" htmlFor="remember">Remember me</label>
              </div>
              <Link to="/register" className="text-decoration-none small">Need an account?</Link>
            </div>
            <div className="col-12 d-grid mt-2">
              <button className="btn btn-neon" type="submit" disabled={loading}>{loading ? 'Signing In...' : 'Sign In'}</button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
