# Plataforma de Gestión de Cursos e Inscripciones

Proyecto integrador full stack — **Programación Web II (Código 30690)** — Evaluación Integral Final.

Aplicación web moderna que articula **TypeScript, Angular, React, Next.js, Node.js, Express y MongoDB**, con autenticación JWT, gestión de estado, despliegue en la nube y controles básicos de seguridad.

---

## 1. Descripción y problema

Las instituciones necesitan una plataforma donde los **estudiantes** puedan consultar un catálogo de cursos e inscribirse, y donde un **administrador** gestione los cursos y usuarios. Este proyecto resuelve ese flujo de principio a fin: registro/login → catálogo → inscripción → visualización de inscripciones → administración → persistencia en MongoDB Atlas.

## 2. Objetivos

- Autenticación segura con JWT y autorización por roles (admin / student).
- Catálogo con búsqueda e inscripción de estudiantes.
- Panel del estudiante con sus inscripciones.
- Panel administrativo con CRUD de cursos y usuarios.
- Persistencia real en MongoDB Atlas.
- Despliegue en Vercel + Render + Atlas con buenas prácticas de seguridad.

## 3. Arquitectura

Cuatro aplicaciones independientes que consumen una API REST única. Ver diagrama en [`/docs/arquitectura.md`](docs/arquitectura.md).

| App | Tecnología | Carpeta | Despliegue |
|-----|-----------|---------|------------|
| Sitio público (catálogo) | Next.js (App Router, SSR/ISR/SSG) | `public-next/` | Vercel |
| Portal del estudiante (SPA) | React + Vite + Context API | `student-react/` | Vercel |
| Panel administrativo | Angular + TypeScript (standalone) | `admin-angular/` | Vercel |
| API REST | Node.js + Express + Mongoose | `backend/` | Render |
| Base de datos | MongoDB Atlas | — | MongoDB Atlas |

## 4. Tecnologías

`TypeScript` · `Angular 17` · `React 18` · `Next.js 14` · `Node.js` · `Express` · `MongoDB` · `Mongoose` · `JWT` · `bcrypt` · `Helmet` · `express-validator` · `Vite`

## 5. Integrantes

| Nombre completo |
|-----------------|
| Andrés Oliver Trujillo Torres |
| Diego Gallardo Sánchez |
| Gabriela Fumiko Furukawa Oki |
| Misha Reuven Quito |
| Diego Fernando Salva Puerta |

## Distribución inicial del trabajo

Diego Gallardo Sánchez desarrolló y proporcionó la estructura base inicial del proyecto.

Andrés Oliver Trujillo Torres realizó la preparación de la carpeta, la revisión de seguridad, la configuración inicial y la publicación del repositorio grupal.

Las mejoras, correcciones, documentación y despliegues restantes serán distribuidos entre los cinco integrantes mediante ramas y commits individuales.

## 6. Instalación local

Requisitos: Node.js 18+ y una cuenta de MongoDB Atlas.

```bash
# 1) Backend
cd backend
cp .env.example .env         # completa MONGODB_URI y JWT_SECRET
npm install
npm run seed                 # crea admin, estudiante demo y cursos
npm run dev                  # http://localhost:4000

# 2) Portal del estudiante (React)
cd ../student-react
cp .env.example .env         # VITE_API_URL=http://localhost:4000/api
npm install
npm run dev                  # http://localhost:5173

# 3) Panel administrativo (Angular)
cd ../admin-angular
npm install
# edita src/environments/environment.ts con la URL de la API
npm start                    # http://localhost:4200

# 4) Sitio público (Next.js)
cd ../public-next
cp .env.example .env         # NEXT_PUBLIC_API_URL=http://localhost:4000/api
npm install
npm run dev                  # http://localhost:3000
```

## 7. Variables de entorno

Cada app trae su `.env.example`. **Nunca subas el `.env` real.**

- **backend**: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CORS_ORIGINS`, `SEED_ADMIN_NAME`, `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`, `SEED_STUDENT_NAME`, `SEED_STUDENT_EMAIL`, `SEED_STUDENT_PASSWORD`
- **student-react**: `VITE_API_URL`
- **public-next**: `NEXT_PUBLIC_API_URL`
- **admin-angular**: `src/environments/environment.ts` → `apiUrl`

## 8. Credenciales de prueba

| Rol | Correo | Contraseña |
|-----|--------|-----------|
| Administrador | Pendiente | Pendiente |
| Estudiante | Pendiente | Pendiente |

> Las credenciales públicas de evaluación se añadirán después del despliegue.

## 9. Endpoints principales

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| POST | `/api/auth/register` | Público | Registro de estudiante |
| POST | `/api/auth/login` | Público | Login (devuelve JWT) |
| GET | `/api/auth/me` | Autenticado | Perfil actual |
| GET | `/api/courses` | Público | Listar/buscar cursos |
| GET | `/api/courses/:id` | Público | Detalle de curso |
| POST | `/api/courses` | Admin | Crear curso |
| PUT | `/api/courses/:id` | Admin | Editar curso |
| DELETE | `/api/courses/:id` | Admin | Eliminar curso |
| POST | `/api/enrollments` | Estudiante | Inscribirse |
| GET | `/api/enrollments/mine` | Estudiante | Mis inscripciones |
| DELETE | `/api/enrollments/:id` | Estudiante | Cancelar inscripción |
| GET | `/api/enrollments` | Admin | Todas las inscripciones |
| GET/POST/PUT/DELETE | `/api/users` | Admin | CRUD de usuarios |

Colección lista para importar en Postman/Thunder Client: [`/docs/postman_collection.json`](docs/postman_collection.json).

## 10. URLs desplegadas

| App | URL |
|-----|-----|
| Sitio público (Next.js) | `https://________.vercel.app` |
| Portal estudiante (React) | `https://________.vercel.app` |
| Panel admin (Angular) | `https://________.vercel.app` |
| API (Render) | `https://________.onrender.com` |

> Completar tras el despliegue.

## 11. Video de exposición

📹 **Enlace de YouTube:** `https://youtu.be/________`

(12–15 min, todos los integrantes con cámara prendida.)

## 12. Documentación técnica

Carpeta [`/docs`](docs): arquitectura, modelo de datos, decisiones técnicas, checklist de seguridad, colección Postman y reporte Lighthouse.

## 13. Capturas

> Agrega aquí capturas de: catálogo, login, inscripción, panel del estudiante y panel admin.

---

## Guía paso a paso de despliegue y entrega

Ver [`GUIA_PASO_A_PASO.md`](GUIA_PASO_A_PASO.md).
