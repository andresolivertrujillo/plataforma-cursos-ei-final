import Link from 'next/link';
import { getCourse, getCourses } from '@/lib/api';

// Genera las paginas estaticas de cada curso en el build (SSG)
export async function generateStaticParams() {
  const courses = await getCourses();
  return courses.map((c) => ({ id: c._id }));
}

export const revalidate = 60;

export default async function CursoDetalle({ params }) {
  const course = await getCourse(params.id);
  if (!course) {
    return (
      <div className="container">
        <Link href="/cursos" className="back">&larr; Volver</Link>
        <p>Curso no encontrado.</p>
      </div>
    );
  }
  return (
    <div className="container">
      <Link href="/cursos" className="back">&larr; Volver al catalogo</Link>
      <div className="card">
        <span className="badge">{course.category}</span>
        <h1>{course.title}</h1>
        <p>{course.description}</p>
        <ul className="muted">
          <li>Docente: {course.instructor}</li>
          <li>Creditos: {course.credits}</li>
          <li>Precio: {course.price > 0 ? `S/ ${course.price}` : 'Gratuito'}</li>
        </ul>
        <p className="muted">
          Para inscribirte, ingresa al <strong>portal del estudiante</strong>.
        </p>
      </div>
    </div>
  );
}
