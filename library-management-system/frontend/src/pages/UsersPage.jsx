import { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout';
import { fetchUsers, registerUser } from '../services/api.js';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    user_id: '',
    name: '',
    email: '',
    phone: ''
  });

  function loadUsers() {
    fetchUsers()
      .then(setUsers)
      .catch(() => setError('Could not load users data.'));
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      const result = await registerUser(form);
      if (!result.success) {
        setError(result.message || 'Could not register user.');
        return;
      }

      setSuccess(result.message || 'User registered successfully.');
      setForm({ user_id: '', name: '', email: '', phone: '' });
      loadUsers();
    } catch {
      setError('Could not register user. Please check your input.');
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return users;
    }
    return users.filter((user) =>
      [user.user_id, user.name, user.email, user.phone].some((v) => String(v).toLowerCase().includes(q))
    );
  }, [users, query]);

  return (
    <Layout activePage="users">
      <div className="container">
        <div className="glass-panel p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h2 className="mb-0">Register Student</h2>
            <span className="text-soft">Add new library members directly from this page</span>
          </div>
          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-3"><label className="form-label">User ID</label><input className="form-control form-control-modern" value={form.user_id} onChange={(e) => setForm({ ...form, user_id: e.target.value })} required /></div>
            <div className="col-md-3"><label className="form-label">Full Name</label><input className="form-control form-control-modern" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div className="col-md-3"><label className="form-label">Email</label><input type="email" className="form-control form-control-modern" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
            <div className="col-md-3"><label className="form-label">Phone</label><input className="form-control form-control-modern" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /></div>
            <div className="col-12 d-flex gap-2">
              <button className="btn btn-neon" type="submit"><i className="fa-solid fa-user-plus me-1" />Add Student</button>
              <button className="btn btn-soft" type="button" onClick={() => setForm({ user_id: '', name: '', email: '', phone: '' })}>Reset</button>
            </div>
          </form>
        </div>
        <div className="glass-panel p-4">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h2 className="mb-0">Students</h2>
            <div className="d-flex align-items-center gap-2">
              <input className="form-control form-control-modern" placeholder="Search users..." value={query} onChange={(e) => setQuery(e.target.value)} />
              <span className="badge rounded-pill text-bg-dark-subtle">{filtered.length} Records</span>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-modern align-middle mb-0">
              <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Borrowed</th><th>Outstanding Fines</th></tr></thead>
              <tbody>
                {filtered.length === 0 && <tr><td colSpan={6} className="text-center text-soft py-4">No students found.</td></tr>}
                {filtered.map((u) => (
                  <tr key={u.user_id}>
                    <td>{u.user_id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.phone}</td>
                    <td>{u.borrowed_books}</td>
                    <td>${Number(u.outstanding_fines).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
