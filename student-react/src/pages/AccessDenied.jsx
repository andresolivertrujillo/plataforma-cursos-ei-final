import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AccessDenied() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  if (user.role === 'student') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="card form-card">
      <h2>Acceso restringido</h2>
      <p>Este portal esta reservado para usuarios con rol de estudiante.</p>
      <p className="muted">Los administradores deben utilizar el panel administrativo.</p>
      <button type="button" onClick={handleLogout}>Cerrar sesion</button>
    </div>
  );
}
