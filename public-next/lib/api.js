function resolveApiUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (!configuredUrl) {
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:4000/api';
    }

    throw new Error(
      'NEXT_PUBLIC_API_URL es obligatoria en producción. Configúrala con la URL pública del backend.'
    );
  }

  if (!/^https?:\/\//i.test(configuredUrl)) {
    throw new Error('NEXT_PUBLIC_API_URL debe comenzar con http:// o https://.');
  }

  try {
    new URL(configuredUrl);
  } catch {
    throw new Error('NEXT_PUBLIC_API_URL debe contener una URL HTTP(S) válida.');
  }

  return configuredUrl.replace(/\/+$/, '');
}

const API_URL = resolveApiUrl();

// Trae todos los cursos. revalidate: 60 => ISR (regenera cada 60s).
export async function getCourses() {
  try {
    const res = await fetch(`${API_URL}/courses`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    // Si la API no responde durante el build, devuelve lista vacia
    return [];
  }
}

// Detalle de un curso.
export async function getCourse(id) {
  try {
    const res = await fetch(`${API_URL}/courses/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
