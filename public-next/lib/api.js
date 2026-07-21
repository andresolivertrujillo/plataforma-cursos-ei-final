const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

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
