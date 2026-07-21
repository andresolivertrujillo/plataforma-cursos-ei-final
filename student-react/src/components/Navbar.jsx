import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <Link to="/" className="brand">EduPlatform</Link>
      <div className="nav-links">
        <Link to="/">Catalogo</Link>
        {user ? (
          <>
            <Link to="/mis-inscripciones">Mis inscripciones</Link>
            <span className="user-name">Hola, {user.name}</span>
            <button onClick={() => { logout(); navigate('/login'); }}>Salir</button>
          </>
        ) : (
          <>
            <Link to="/login">Ingresar</Link>
            <Link to="/register">Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
}
