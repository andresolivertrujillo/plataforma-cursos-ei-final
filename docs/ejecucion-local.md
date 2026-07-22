# Cómo ejecutar las cuatro aplicaciones

Guía completa para levantar el proyecto en tu computadora. Al terminar tendrás cuatro
aplicaciones corriendo a la vez, conectadas a la misma API.

---

## Requisitos previos

| Herramienta | Versión | Comprobación |
|------------|---------|--------------|
| Node.js | 18 o superior | `node -v` |
| npm | 9 o superior | `npm -v` |
| Git | cualquiera reciente | `git --version` |
| MongoDB | Atlas (nube) o local | — |

Si `node -v` muestra una versión menor a 18, actualiza desde
[nodejs.org](https://nodejs.org) antes de continuar: Angular 17 y Next.js 14 no
compilan con versiones anteriores.

**Base de datos.** Tienes dos opciones:

- **MongoDB Atlas** (recomendado, es lo que pide la evaluación). Sigue el PASO 2 de
  `GUIA_PASO_A_PASO.md` para obtener tu cadena de conexión.
- **MongoDB local**, si lo tienes instalado:
  `MONGODB_URI=mongodb://localhost:27017/plataforma_cursos`

---

## Mapa de puertos

Cada aplicación usa un puerto distinto, así que pueden correr simultáneamente:

| Aplicación | Carpeta | Puerto | URL local |
|-----------|---------|--------|-----------|
| API REST | `backend/` | 4000 | http://localhost:4000 |
| Sitio público (Next.js) | `public-next/` | 3000 | http://localhost:3000 |
| Panel admin (Angular) | `admin-angular/` | 4200 | http://localhost:4200 |
| Portal estudiante (React) | `student-react/` | 5173 | http://localhost:5173 |

Necesitarás **cuatro terminales abiertas**, una por aplicación. En VS Code puedes
dividir el panel de terminal con el ícono `+`.

> **Orden importante:** levanta primero el backend. Los tres frontends se ven feos o
> vacíos si la API no está arriba, porque no tienen de dónde leer los cursos.

---

## Paso 1 — Backend (API REST)

```bash
cd backend
cp .env.example .env
```

Abre `backend/.env` y completa al menos estas dos variables:

```env
PORT=4000
MONGODB_URI=mongodb+srv://usuario:clave@cluster0.xxxx.mongodb.net/plataforma_cursos
JWT_SECRET=cadena-larga-y-aleatoria-que-tu-inventes
JWT_EXPIRES_IN=1d
CORS_ORIGINS=http://localhost:5173,http://localhost:4200,http://localhost:3000
ADMIN_EMAIL=admin@isil.edu
ADMIN_PASSWORD=Admin123*
ADMIN_NAME=Administrador
```

`CORS_ORIGINS` ya incluye los tres puertos locales; si lo dejas vacío, los frontends
recibirán errores de CORS en el navegador.

Instala, carga datos de ejemplo y arranca:

```bash
npm install
npm run seed     # crea admin, estudiante de prueba y cursos
npm run dev      # arranca con recarga automática (nodemon)
```

**Verificación.** Abre http://localhost:4000/api/health — debe responder
`{"status":"ok"}`. Y http://localhost:4000/api/courses debe devolver el arreglo de
cursos que creó el seed.

> `npm run seed` es idempotente en la práctica: puedes volver a ejecutarlo si borraste
> datos por error. `npm start` corre sin nodemon (es lo que usa Render).

---

## Paso 2 — Portal del estudiante (React + Vite)

En una **segunda terminal**:

```bash
cd student-react
cp .env.example .env
```

Contenido de `student-react/.env`:

```env
VITE_API_URL=http://localhost:4000/api
```

```bash
npm install
npm run dev      # http://localhost:5173
```

**Verificación.** Entra a http://localhost:5173, deberías ver el catálogo con los
cursos del seed. Inicia sesión con `estudiante@isil.edu` / `Estudiante123*`, entra a un
curso e inscríbete; luego revisa "Mis inscripciones".

> Las variables de Vite **deben** empezar con `VITE_`, si no, no se exponen al
> navegador. Y si cambias el `.env`, hay que reiniciar `npm run dev`.

---

## Paso 3 — Panel administrativo (Angular)

Tercera terminal:

```bash
cd admin-angular
npm install
npm start        # http://localhost:4200
```

Angular no lee archivos `.env`: la URL de la API vive en
`src/environments/environment.ts`.

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:4000/api',
};
```

**Verificación.** Entra a http://localhost:4200, inicia sesión con
`admin@isil.edu` / `Admin123*`. Deberías ver el dashboard con los totales y poder crear,
editar y eliminar cursos y usuarios.

> Si intentas entrar con la cuenta de estudiante, el `adminGuard` te devolverá al login.
> Eso **es el comportamiento correcto** y vale la pena mostrarlo en el video.
>
> La primera instalación de Angular descarga muchos paquetes y puede tardar varios
> minutos. Es normal.

---

## Paso 4 — Sitio público (Next.js)

Cuarta terminal:

```bash
cd public-next
cp .env.example .env
```

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

```bash
npm install
npm run dev      # http://localhost:3000
```

**Verificación.** Entra a http://localhost:3000, navega a `/cursos` y abre el detalle de
un curso. Si haces clic derecho → "Ver código fuente de la página", verás el contenido de
los cursos **ya presente en el HTML**: esa es la prueba visible de que hubo renderizado
en el servidor y no en el navegador.

---

## Prueba de recorrido completo

Con las cuatro corriendo, haz este recorrido — es exactamente el que conviene grabar
para el video:

1. **Next.js (3000)** → ver el catálogo público sin iniciar sesión.
2. **React (5173)** → registrar un estudiante nuevo → iniciar sesión → inscribirse a un
   curso → verlo en "Mis inscripciones" → cancelarlo.
3. **Angular (4200)** → entrar como admin → crear un curso nuevo.
4. **React (5173)** → refrescar el catálogo: el curso nuevo ya aparece.
5. **Next.js (3000)** → el sitio público también lo muestra tras la revalidación.

Ese ida y vuelta demuestra en un minuto que las cuatro aplicaciones comparten la misma
base de datos a través de la API.

---

## Compilar para producción

Comprueba que todo compila antes de desplegar:

```bash
cd student-react   && npm run build   # genera dist/
cd ../public-next  && npm run build   # muestra qué rutas son estáticas
cd ../admin-angular && npm run build  # genera dist/admin-angular/browser
```

En la salida de Next.js verás junto a cada ruta un símbolo indicando su estrategia:
`/cursos/[id]` aparece como estática (SSG) porque usa `generateStaticParams`.

---

## Problemas frecuentes

| Síntoma | Causa probable | Solución |
|---------|---------------|----------|
| `MongooseServerSelectionError` | La IP no está autorizada en Atlas, o la cadena está mal | En Atlas → Network Access → agrega `0.0.0.0/0`. Revisa que reemplazaste `<password>` |
| `EADDRINUSE: port 4000` | Ya hay algo en ese puerto | Cierra el proceso anterior o cambia `PORT` en el `.env` |
| Error de CORS en la consola del navegador | El puerto del frontend no está en `CORS_ORIGINS` | Agrégalo en `backend/.env` y reinicia el backend |
| El catálogo aparece vacío | No corriste el seed, o el backend está apagado | `npm run seed` y verifica `/api/health` |
| 401 en todas las peticiones | El token expiró o se borró | Cierra sesión y vuelve a entrar |
| 403 al hacer CRUD | Iniciaste sesión como estudiante | Usa la cuenta admin |
| Angular: `TS2729 ... used before initialization` | `FormBuilder` inyectado por constructor | Usa `private fb = inject(FormBuilder);` declarado antes del formulario |
| Cambios en `.env` que no se aplican | Los frontends leen el `.env` al arrancar | Reinicia el servidor de desarrollo |
| `npm install` falla | Caché o versión de Node antigua | `rm -rf node_modules package-lock.json && npm install` (verifica `node -v` ≥ 18) |

---

## Credenciales de prueba

| Rol | Correo | Contraseña |
|-----|--------|-----------|
| Administrador | `admin@isil.edu` | `Admin123*` |
| Estudiante | `estudiante@isil.edu` | `Estudiante123*` |

Las crea `npm run seed` en el backend. Cámbialas si vas a exponer el proyecto
públicamente.
