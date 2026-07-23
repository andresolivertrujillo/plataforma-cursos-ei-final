import Link from 'next/link';

export default function CursoNotFound() {
  return (
    <div className="container">
      <div className="card state-card">
        <h1>Curso no encontrado</h1>
        <p className="muted">El curso solicitado no existe o ya no esta disponible.</p>
        <Link href="/cursos">Volver al catalogo</Link>
      </div>
    </div>
  );
}
