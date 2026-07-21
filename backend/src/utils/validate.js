import { validationResult } from 'express-validator';

// Middleware que corta la peticion si express-validator encontro errores
export function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Errores de validacion',
      errors: errors.array().map((e) => ({ campo: e.path, msg: e.msg })),
    });
  }
  next();
}
