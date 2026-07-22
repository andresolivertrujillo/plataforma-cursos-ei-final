const REQUEST_TIMEOUT_MS = 8000;

export class ApiError extends Error {
  constructor(message, { code, status = null, path }) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.path = path;
  }
}

function resolveApiUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (!configuredUrl) {
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:4000/api';
    }

    throw new ApiError(
      'La configuracion publica de la API no esta disponible.',
      { code: 'CONFIGURATION_ERROR', path: '' }
    );
  }

  if (!/^https?:\/\//i.test(configuredUrl)) {
    throw new ApiError(
      'La configuracion publica de la API no es valida.',
      { code: 'CONFIGURATION_ERROR', path: '' }
    );
  }

  try {
    new URL(configuredUrl);
  } catch {
    throw new ApiError(
      'La configuracion publica de la API no es valida.',
      { code: 'CONFIGURATION_ERROR', path: '' }
    );
  }

  return configuredUrl.replace(/\/+$/, '');
}

const API_URL = resolveApiUrl();

async function requestApi(path) {
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    const timedOut = error?.name === 'TimeoutError' || error?.name === 'AbortError';
    throw new ApiError(
      timedOut
        ? 'La API tardo demasiado en responder.'
        : 'No fue posible conectar con la API.',
      { code: timedOut ? 'TIMEOUT' : 'NETWORK_ERROR', path }
    );
  }

  if (!response.ok) {
    throw new ApiError(
      'La API no pudo completar la solicitud.',
      { code: 'HTTP_ERROR', status: response.status, path }
    );
  }

  try {
    return await response.json();
  } catch {
    throw new ApiError(
      'La API devolvio una respuesta no valida.',
      { code: 'INVALID_JSON', status: response.status, path }
    );
  }
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isCourse(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    isNonEmptyString(value._id) &&
    isNonEmptyString(value.title) &&
    isNonEmptyString(value.description) &&
    isNonEmptyString(value.category) &&
    isNonEmptyString(value.instructor) &&
    Number.isFinite(value.credits) &&
    Number.isFinite(value.capacity) &&
    Number.isFinite(value.price) &&
    typeof value.active === 'boolean'
  );
}

function invalidData(path) {
  return new ApiError(
    'La API devolvio datos con una estructura inesperada.',
    { code: 'INVALID_DATA', path }
  );
}

// Trae todos los cursos. Los errores se propagan para que ISR conserve la version previa.
export async function getCourses() {
  const path = '/courses';
  const data = await requestApi(path);

  if (!Array.isArray(data) || !data.every(isCourse)) {
    throw invalidData(path);
  }

  return data;
}

// Devuelve null exclusivamente cuando la API confirma que el curso no existe.
export async function getCourse(id) {
  const path = `/courses/${encodeURIComponent(id)}`;

  try {
    const data = await requestApi(path);
    if (!isCourse(data)) {
      throw invalidData(path);
    }
    return data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}
