import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';

// Protege rutas: si no hay sesion, redirige al login
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner label="Verificando sesion..." />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
