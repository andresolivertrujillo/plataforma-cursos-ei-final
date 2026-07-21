import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card form-card">
      <h2>Crear cuenta</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Nombre
          <input name="name" value={form.name} onChange={onChange} required />
        </label>
        <label>Correo
          <input type="email" name="email" value={form.email} onChange={onChange} required />
        </label>
        <label>Contrasena (min. 6)
          <input type="password" name="password" value={form.password} onChange={onChange} minLength={6} required />
        </label>
        <button type="submit" disabled={loading}>{loading ? 'Creando...' : 'Registrarme'}</button>
      </form>
      <p>Ya tienes cuenta? <Link to="/login">Ingresa</Link></p>
    </div>
  );
}
