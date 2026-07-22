// Cliente centralizado para consumir la API. Adjunta el JWT automaticamente.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Se dispara cuando el backend responde 401 (token ausente/invalido/expirado),
// asi el AuthContext puede cerrar la sesion sin que cada pantalla lo maneje a mano.
function notifyUnauthorized() {
  window.dispatchEvent(new CustomEvent('auth:unauthorized'));
}

export async function apiFetch(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = localStorage.getItem('token');
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    // fetch lanza TypeError cuando no hay red o el backend no responde
    throw new Error('No se pudo conectar con el servidor. Verifica tu conexion e intenta de nuevo.');
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401 && auth) {
      notifyUnauthorized();
    }
    const error = new Error(data.message || 'Ocurrio un error al procesar la solicitud');
    // express-validator devuelve { errors: [{ campo, msg }] } en errores 400 de validacion
    error.fieldErrors = Array.isArray(data.errors) ? data.errors : null;
    error.status = res.status;
    throw error;
  }

  return data;
}
