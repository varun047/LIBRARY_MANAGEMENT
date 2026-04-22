import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';

export default function NotFound() {
  return (
    <Layout activePage="home">
      <div className="container">
        <div className="glass-panel p-5 text-center mx-auto" style={{ maxWidth: '560px' }}>
          <h1 className="display-5 mb-2">404</h1>
          <h2 className="h4 mb-2">Page Not Found</h2>
          <p className="text-soft mb-4">The page you requested does not exist in the React app routes.</p>
          <Link className="btn btn-neon" to="/">Back to Home</Link>
        </div>
      </div>
    </Layout>
  );
}
