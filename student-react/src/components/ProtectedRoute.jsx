import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protege rutas: si no hay sesion, redirige al login
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p style={{ padding: 24 }}>Cargando...</p>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
