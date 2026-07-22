// Indicador de carga reutilizable para peticiones a la API
export default function Spinner({ label = 'Cargando...' }) {
  return (
    <div className="spinner-wrap" role="status" aria-live="polite">
      <span className="spinner" />
      <span className="spinner-label">{label}</span>
    </div>
  );
}
