// Validaciones de formularios en el cliente (feedback inmediato antes de llamar a la API)

export function validateEmail(email) {
  if (!email.trim()) return 'El correo es obligatorio';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return 'Ingresa un correo valido';
  return '';
}

export function validatePassword(password) {
  if (!password) return 'La contrasena es obligatoria';
  if (password.length < 6) return 'La contrasena debe tener al menos 6 caracteres';
  return '';
}

export function validateName(name) {
  if (!name.trim()) return 'El nombre es obligatorio';
  if (name.trim().length < 2) return 'El nombre es demasiado corto';
  return '';
}

// Valida un formulario completo a partir de un mapa { campo: valor } y un mapa { campo: validador }
export function validateForm(values, validators) {
  const errors = {};
  Object.keys(validators).forEach((field) => {
    const message = validators[field](values[field] ?? '');
    if (message) errors[field] = message;
  });
  return errors;
}
