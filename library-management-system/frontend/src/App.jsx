import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import BooksPage from './pages/BooksPage';
import UsersPage from './pages/UsersPage';
import TransactionsPage from './pages/TransactionsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/books" element={<BooksPage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/transactions" element={<TransactionsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
