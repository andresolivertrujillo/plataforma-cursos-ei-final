import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch(`/courses/${id}`)
      .then(setCourse)
      .catch((e) => setError(e.message));
  }, [id]);

  async function handleEnroll() {
    setMsg('');
    setError('');
    if (!user) return navigate('/login');
    try {
      await apiFetch('/enrollments', { method: 'POST', auth: true, body: { courseId: id } });
      setMsg('Inscripcion realizada con exito.');
    } catch (err) {
      setError(err.message);
    }
  }

  if (error) return <p className="error">{error}</p>;
  if (!course) return <p>Cargando...</p>;

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
      <button onClick={handleEnroll}>Inscribirme</button>
    </div>
  );
}
