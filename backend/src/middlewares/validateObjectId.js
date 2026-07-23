import mongoose from 'mongoose';

// Corta la peticion con 400 si el parametro de ruta no es un ObjectId valido.
// Uso: router.get('/:id', validateObjectId('id'), controller)
export function validateObjectId(paramName = 'id') {
  return (req, res, next) => {
    const value = req.params[paramName];
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return res.status(400).json({ message: `Identificador invalido: ${value}` });
    }
    next();
  };
}
