import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, managerOnly = false }) {
  const { account } = useAuth();

  if (!account) return <Navigate to="/sign-in" replace />;
  if (managerOnly && account.role !== 'MANAGER') return <Navigate to="/" replace />;

  return children;
}
