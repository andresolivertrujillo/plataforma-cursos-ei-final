'use client';

import Link from 'next/link';

export default function CursosError({ reset }) {
  return (
    <div className="container">
      <div className="card state-card" role="alert">
        <h1>No pudimos cargar la informacion</h1>
        <p className="muted">Intenta nuevamente en unos momentos.</p>
        <div className="state-actions">
          <button type="button" className="action-button" onClick={() => reset()}>
            Intentar nuevamente
          </button>
          <Link href="/cursos">Volver al catalogo</Link>
        </div>
      </div>
    </div>
  );
}
