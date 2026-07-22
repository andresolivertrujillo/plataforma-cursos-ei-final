import Link from 'next/link';
import { getCourses } from '@/lib/api';

// Server Component: los datos se obtienen en el servidor (SSR/ISR)
export const revalidate = 60;

export default async function CursosPage() {
  const courses = await getCourses();
  return (
    <div className="container">
      <Link href="/" className="back">&larr; Inicio</Link>
      <h1>Catalogo de cursos</h1>
      {courses.length === 0 && <p className="muted">No hay cursos disponibles.</p>}
      <div className="grid">
        {courses.map((c) => (
          <div key={c._id} className="card">
            <span className="badge">{c.category}</span>
            <h3>{c.title}</h3>
            <p className="muted">{c.description}</p>
            <p className="muted">Docente: {c.instructor}</p>
            <Link href={`/cursos/${c._id}`}>Ver detalle &rarr;</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
