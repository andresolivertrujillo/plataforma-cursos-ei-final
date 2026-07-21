# Decisiones tecnicas

- **Monorepo**: las cuatro apps viven en un solo repositorio para facilitar la
  revision, manteniendo `package.json` y despliegue independientes por carpeta.
- **JWT sin sesiones en servidor**: el backend es stateless; el token viaja en el
  header `Authorization`. Facilita el despliegue en Render (sin estado compartido).
- **Context API en React** (en vez de Redux): el estado global de autenticacion es
  simple; Context API es suficiente y evita boilerplate. Cumple el requisito de
  estado global usado por mas de un componente (Navbar, ProtectedRoute, paginas).
- **Angular standalone components**: se evita `NgModule`; menos boilerplate y es el
  enfoque recomendado desde Angular 17.
- **Next.js App Router con ISR** (`revalidate = 60`) y `generateStaticParams` para el
  detalle: el catalogo publico se sirve rapido y se regenera periodicamente (SSG/ISR).
- **Mongoose** para modelado y validaciones a nivel de esquema.
- **express-validator** para validar entradas en el borde de la API.

## Estrategia de renderizado en Next.js
- `/` : pagina estatica (contenido fijo).
- `/cursos` : Server Component con `revalidate = 60` (ISR): se genera en el servidor y
  se regenera cada 60s.
- `/cursos/[id]` : `generateStaticParams` genera cada curso como HTML estatico (SSG)
  con revalidacion incremental.
