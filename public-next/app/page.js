import Link from 'next/link';

// Pagina de inicio publica (estatica)
export default function Home() {
  return (
    <>
      <header className="hero">
        <h1>EduPlatform</h1>
        <p>Descubre y conoce nuestros cursos. Inscribete en el portal del estudiante.</p>
        <Link href="/cursos" className="btn">Ver catalogo de cursos</Link>
      </header>
      <div className="container">
        <h2>Sobre la plataforma</h2>
        <p className="muted">
          Este es el sitio publico construido con Next.js. El catalogo se genera con
          renderizado en servidor / regeneracion incremental (ISR) consumiendo la API.
        </p>
      </div>
    </>
  );
}
