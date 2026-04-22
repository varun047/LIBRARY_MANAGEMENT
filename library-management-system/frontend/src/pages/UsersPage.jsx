import { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import SearchBar from '../components/SearchBar';
import { fetchUsers, registerUser } from '../lib/api';

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

  const columns = [
    { key: 'user_id', label: 'User ID' },
    { key: 'name', label: 'Name' },
    {
      key: 'role',
      label: 'Role',
      render: (value) => <span className="badge badge-role rounded-pill">{(value || 'Member').toString()}</span>
    },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'borrowed_books', label: 'Borrowed' },
    {
      key: 'outstanding_fines',
      label: 'Outstanding Fines',
      render: (value) => `$${Number(value).toFixed(2)}`
    }
  ];

  return (
    <Layout title="Users" subtitle="Member records, loans, and pending fines.">
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <section className="glass-card fluid-card welcome-banner mb-4">
        <div>
          <p className="banner-eyebrow mb-2">Student Management</p>
          <h3 className="banner-title mb-2">Manage Memberships with Confidence</h3>
          <p className="banner-text mb-0">
            Register new members, monitor contact records, and keep account details organized in one place.
          </p>
        </div>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <span className="badge text-bg-light border">Total Members: {users.length}</span>
          <span className="badge text-bg-light border">Filtered: {filtered.length}</span>
        </div>
      </section>

      <section className="card-elevated p-3 p-md-4 mb-4">
        <div className="panel-header">
          <div>
            <h3 className="h5 mb-1">Register New User</h3>
            <p className="text-muted mb-0">Create a library profile with contact information.</p>
          </div>
        </div>
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-12 col-md-3">
            <input className="form-control" placeholder="User ID" value={form.user_id} onChange={(e) => setForm({ ...form, user_id: e.target.value })} required />
          </div>
          <div className="col-12 col-md-3">
            <input className="form-control" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="col-12 col-md-3">
            <input type="email" className="form-control" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="col-12 col-md-3">
            <input className="form-control" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          </div>
          <div className="col-12">
            <button className="btn btn-primary" type="submit">
              <i className="bi bi-person-plus me-1" />
              Register User
            </button>
          </div>
        </form>
      </section>

      <section className="card-elevated p-3 p-md-4">
        <div className="panel-header">
          <div>
            <h3 className="h5 mb-1">Users Directory</h3>
            <p className="text-muted mb-0">Search members by ID, name, email, or phone.</p>
          </div>
          <SearchBar value={query} onChange={setQuery} placeholder="Search by ID, name, email, or phone" />
        </div>
        <DataTable columns={columns} rows={filtered} emptyMessage="No users match this search." />
      </section>
    </Layout>
  );
}
