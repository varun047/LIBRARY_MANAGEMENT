import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api.js';
import Layout from '../components/Layout.jsx';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ user_id: '', name: '', email: '', phone: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const result = await registerUser(form);
      if (!result.success) {
        setError(result.message || result.error || 'Registration failed.');
        return;
      }
      setSuccess(result.message || 'Registration successful.');
      setTimeout(() => navigate('/login'), 700);
    } catch (err) {
      setError(err.message || 'Could not register user.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout activePage="register">
      <div className="container">
        <div className="glass-panel p-4 p-md-5 mx-auto" style={{ maxWidth: '760px' }}>
          <h2 className="mb-2">Student Registration</h2>
          <p className="text-soft">Create a new student account for library access.</p>
          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-6"><label className="form-label">User ID</label><input className="form-control form-control-modern" required value={form.user_id} onChange={(event) => setForm({ ...form, user_id: event.target.value })} /></div>
            <div className="col-md-6"><label className="form-label">Full Name</label><input className="form-control form-control-modern" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></div>
            <div className="col-md-6"><label className="form-label">Email</label><input type="email" className="form-control form-control-modern" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></div>
            <div className="col-md-6"><label className="form-label">Phone</label><input className="form-control form-control-modern" required value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></div>
            <div className="col-12 d-flex gap-2">
              <button className="btn btn-neon" type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
              <Link to="/login" className="btn btn-soft">Go to Login</Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
