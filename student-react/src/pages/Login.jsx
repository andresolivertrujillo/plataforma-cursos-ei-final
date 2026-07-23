import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword, validateForm } from '../utils/validators';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError('');

    const errors = validateForm(
      { email, password },
      { email: validateEmail, password: validatePassword }
    );
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const authenticatedUser = await login(email, password);
      navigate(authenticatedUser.role === 'student' ? '/' : '/acceso-denegado', { replace: true });
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card form-card">
      <h2>Iniciar sesion</h2>
      {apiError && <p className="error">{apiError}</p>}
      <form onSubmit={handleSubmit} noValidate>
        <label>Correo
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
        </label>
        <label>Contrasena
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
        </label>
        <button type="submit" disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</button>
      </form>
      <p>No tienes cuenta? <Link to="/register">Registrate</Link></p>
    </div>
  );
}
