import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return window.location.pathname.startsWith('/admin') ? <AdminDashboard /> : <Home />;
}
