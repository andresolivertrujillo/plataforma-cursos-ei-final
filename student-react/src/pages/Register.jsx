import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateName, validateEmail, validatePassword, validateForm } from '../utils/validators';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError('');

    const errors = validateForm(form, {
      name: validateName,
      email: validateEmail,
      password: validatePassword,
    });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setApiError(err.message);
      // Si el backend devuelve errores de validacion por campo, los mostramos tambien
      if (err.fieldErrors) {
        const mapped = {};
        err.fieldErrors.forEach((fe) => { mapped[fe.campo] = fe.msg; });
        setFieldErrors((prev) => ({ ...prev, ...mapped }));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card form-card">
      <h2>Crear cuenta</h2>
      {apiError && <p className="error">{apiError}</p>}
      <form onSubmit={handleSubmit} noValidate>
        <label>Nombre
          <input name="name" value={form.name} onChange={onChange} />
          {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
        </label>
        <label>Correo
          <input type="email" name="email" value={form.email} onChange={onChange} />
          {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
        </label>
        <label>Contrasena (min. 6)
          <input type="password" name="password" value={form.password} onChange={onChange} />
          {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
        </label>
        <button type="submit" disabled={loading}>{loading ? 'Creando...' : 'Registrarme'}</button>
      </form>
      <p>Ya tienes cuenta? <Link to="/login">Ingresa</Link></p>
    </div>
  );
}
