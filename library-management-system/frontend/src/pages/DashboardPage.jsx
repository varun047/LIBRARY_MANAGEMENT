import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import { fetchStatistics, fetchTransactions } from '../lib/api';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([fetchStatistics(), fetchTransactions()])
      .then(([statistics, txns]) => {
        setStats(statistics);
        setTransactions(txns.slice(-5).reverse());
      })
      .catch(() => setError('Could not load dashboard data.'));
  }, []);

  const columns = [
    { key: 'transaction_id', label: 'Txn ID' },
    { key: 'user_id', label: 'User' },
    { key: 'book_id', label: 'Book' },
    {
      key: 'type',
      label: 'Type',
      render: (value) => <span className="badge badge-soft text-uppercase">{value}</span>
    },
    {
      key: 'timestamp',
      label: 'Time',
      render: (value) => new Date(value).toLocaleString()
    }
  ];

  return (
    <Layout title="Dashboard" subtitle="Overview of books, users, and active circulation.">
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard icon="bi-collection" label="Unique Books" value={stats?.total_books_unique ?? '--'} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard icon="bi-journal-check" label="Available Copies" value={stats?.available_copies ?? '--'} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard icon="bi-people" label="Registered Users" value={stats?.registered_users ?? '--'} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard icon="bi-arrow-left-right" label="Transactions" value={stats?.total_transactions ?? '--'} />
        </div>
      </div>

      <section className="card-elevated p-3 p-md-4">
        <div className="panel-header">
          <h3 className="h5 mb-0">Recent Issued/Returned Activity</h3>
        </div>
        <DataTable columns={columns} rows={transactions} emptyMessage="No transaction data yet." />
      </section>
    </Layout>
  );
}
