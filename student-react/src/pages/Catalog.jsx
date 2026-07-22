import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api/client';
import Spinner from '../components/Spinner';

export default function Catalog() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load(q = '') {
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch(`/courses${q ? `?search=${encodeURIComponent(q)}` : ''}`);
      setCourses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h1>Catalogo de cursos</h1>
      <div className="search-bar">
        <input
          placeholder="Buscar por titulo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load(search)}
        />
        <button onClick={() => load(search)} disabled={loading}>Buscar</button>
      </div>
      {loading && <Spinner label="Cargando cursos..." />}
      {!loading && error && <p className="error">{error}</p>}
      {!loading && !error && (
        <div className="grid">
          {courses.map((c) => (
            <div key={c._id} className="card course-card">
              <span className="badge">{c.category}</span>
              <h3>{c.title}</h3>
              <p>{c.description}</p>
              <p className="muted">Docente: {c.instructor} - {c.credits} creditos</p>
              <Link to={`/curso/${c._id}`} className="btn-link">Ver detalle</Link>
            </div>
          ))}
        </div>
      )}
      {!loading && !error && courses.length === 0 && <p>No se encontraron cursos.</p>}
    </div>
  );
}
