import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    apiFetch(`/courses/${id}`)
      .then(setCourse)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleEnroll() {
    setMsg('');
    setError('');
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'student') {
      navigate('/acceso-denegado');
      return;
    }
    setEnrolling(true);
    try {
      await apiFetch('/enrollments', { method: 'POST', auth: true, body: { courseId: id } });
      setMsg('Inscripcion realizada con exito.');
    } catch (err) {
      setError(err.message);
    } finally {
      setEnrolling(false);
    }
  }

  if (loading) return <Spinner label="Cargando curso..." />;
  if (error && !course) return <p className="error">{error}</p>;
  if (!course) return null;

  return (
    <div className="card detail-card">
      <span className="badge">{course.category}</span>
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      <ul>
        <li><strong>Docente:</strong> {course.instructor}</li>
        <li><strong>Creditos:</strong> {course.credits}</li>
        <li><strong>Cupos:</strong> {course.capacity}</li>
        <li><strong>Precio:</strong> {course.price > 0 ? `S/ ${course.price}` : 'Gratuito'}</li>
      </ul>
      {msg && <p className="success">{msg}</p>}
      {error && <p className="error">{error}</p>}
      <div className="actions-row">
        {user && user.role !== 'student' ? (
          <Link to="/acceso-denegado" className="btn-link">Portal exclusivo para estudiantes</Link>
        ) : (
          <button onClick={handleEnroll} disabled={enrolling}>
            {enrolling ? 'Inscribiendo...' : 'Inscribirme'}
          </button>
        )}
        {msg && <Link to="/mis-inscripciones" className="btn-link">Ver mis inscripciones</Link>}
      </div>
    </div>
  );
}
