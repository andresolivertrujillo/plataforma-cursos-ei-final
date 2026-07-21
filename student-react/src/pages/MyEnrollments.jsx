import { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';

export default function MyEnrollments() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      const data = await apiFetch('/enrollments/mine', { auth: true });
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function cancel(id) {
    try {
      await apiFetch(`/enrollments/${id}`, { method: 'DELETE', auth: true });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      <h1>Mis inscripciones</h1>
      {error && <p className="error">{error}</p>}
      {items.length === 0 && <p>Aun no tienes inscripciones.</p>}
      <div className="grid">
        {items.map((e) => (
          <div key={e._id} className="card course-card">
            <h3>{e.course?.title || 'Curso eliminado'}</h3>
            <p className="muted">Estado: {e.status}</p>
            {e.course && <p>{e.course.category} - {e.course.credits} creditos</p>}
            {e.status === 'inscrito' && (
              <button className="danger" onClick={() => cancel(e._id)}>Cancelar</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
