// Manejador central de errores: respuestas HTTP coherentes
export function notFound(req, res, next) {
  res.status(404).json({ message: `Ruta no encontrada: ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  console.error(err);

  // Error de clave duplicada de Mongo (ej. email o inscripcion repetida)
  if (err.code === 11000) {
    return res.status(409).json({ message: 'El registro ya existe (dato duplicado)' });
  }
  // Error de validacion de Mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: 'Datos invalidos', errors });
  }
  // Identificador de MongoDB con formato invalido (ej. /api/courses/abc123)
  if (err.name === 'CastError') {
    return res.status(400).json({ message: `Identificador invalido: ${err.value}` });
  }

  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Error interno del servidor' });
}
