# Guía paso a paso — de cero a entregado

Sigue estos pasos en orden. Al final tendrás todo lo que pide el profesor: repositorio en GitHub, 4 apps desplegadas, base de datos en la nube, documentación, Lighthouse y video en YouTube.

---

## PASO 0 — Antes de empezar

Crea cuentas gratuitas (con el mismo correo del equipo, idealmente):
- **GitHub** (github.com)
- **MongoDB Atlas** (mongodb.com/atlas)
- **Render** (render.com)
- **Vercel** (vercel.com) — puedes iniciar sesión con GitHub

Instala en tu PC: **Node.js 18+** y **Git**.

---

## PASO 1 — Probar el proyecto en tu computadora

1. Descomprime el ZIP. Verás las carpetas `backend`, `student-react`, `admin-angular`, `public-next`, `docs`.
2. Sigue la sección **"Instalación local"** del `README.md`. En resumen:
   - Configura `backend/.env` con tu `MONGODB_URI` (ver PASO 2) y un `JWT_SECRET`.
   - `npm install` en cada carpeta.
   - `npm run seed` en el backend para cargar datos.
   - Levanta las 4 apps y prueba: registro → login → catálogo → inscripción.

> Consejo: prueba primero backend + React, que es el flujo del estudiante. Luego Angular y Next.

---

## PASO 2 — Base de datos en MongoDB Atlas

1. Entra a Atlas → **Create** un clúster gratuito (M0).
2. **Database Access** → crea un usuario de base de datos (usuario + contraseña). Anótalos.
3. **Network Access** → **Add IP Address** → `0.0.0.0/0` (permite acceso desde Render). *En un entorno real se restringe; para la evaluación se acepta.*
4. **Connect** → **Drivers** → copia la cadena de conexión. Se ve así:
   `mongodb+srv://usuario:<password>@cluster0.xxxxx.mongodb.net/plataforma_cursos?retryWrites=true&w=majority`
5. Reemplaza `<password>` por tu contraseña y `plataforma_cursos` como nombre de la BD.
6. Pega esa cadena en `backend/.env` → `MONGODB_URI`.

---

## PASO 3 — Subir el código a GitHub

> El profesor exige commits progresivos, **no un solo commit final**. Idealmente cada integrante hace commits reales durante el desarrollo.

```bash
cd plataforma-cursos
git init
git add .
git commit -m "Estructura inicial del monorepo"
# crea un repo vacio en github.com y copia su URL
git remote add origin https://github.com/USUARIO/plataforma-cursos.git
git branch -M main
git push -u origin main
```

Verifica en GitHub que **NO** se subió ningún `.env` (solo los `.env.example`). El `.gitignore` ya los excluye.

Haz commits separados a medida que avances, por ejemplo:
`git commit -m "feat(backend): endpoints de inscripciones"`, etc.

---

## PASO 4 — Desplegar el BACKEND en Render

1. Render → **New** → **Web Service** → conecta tu repo de GitHub.
2. Configura:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
3. En **Environment** agrega las variables (las mismas de tu `.env`):
   - `MONGODB_URI` = tu cadena de Atlas
   - `JWT_SECRET` = una cadena larga y aleatoria
   - `JWT_EXPIRES_IN` = `1d`
   - `CORS_ORIGINS` = por ahora `*` o déjalo vacío; lo actualizas en el PASO 6 con las URLs de Vercel
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`
4. **Create Web Service**. Espera a que quede "Live". Anota la URL: `https://tu-api.onrender.com`.
5. Ejecuta el seed una vez. Opción sencilla: en Render → pestaña **Shell** corre `npm run seed`. (O ejecútalo localmente apuntando a la misma Atlas.)
6. Prueba en el navegador: `https://tu-api.onrender.com/api/health` debe responder `{status:"ok"}`.

> Nota: en el plan gratuito Render "duerme" el servicio; la primera petición tras inactividad tarda ~30–50s. Es normal.

---

## PASO 5 — Desplegar los 3 FRONTENDS en Vercel

Repite el proceso **tres veces** (uno por carpeta). Vercel → **Add New** → **Project** → importa el repo.

### 5A. Portal del estudiante (React/Vite)
- **Root Directory:** `student-react`
- **Framework Preset:** Vite
- **Environment Variables:** `VITE_API_URL` = `https://tu-api.onrender.com/api`
- Deploy. Anota la URL.

### 5B. Sitio público (Next.js)
- **Root Directory:** `public-next`
- **Framework Preset:** Next.js
- **Environment Variables:** `NEXT_PUBLIC_API_URL` = `https://tu-api.onrender.com/api`
- Deploy. Anota la URL.

### 5C. Panel administrativo (Angular)
- Antes de desplegar, edita `admin-angular/src/environments/environment.ts` y pon la URL real de la API. Haz commit y push.
- **Root Directory:** `admin-angular`
- **Framework Preset:** Angular
- **Output Directory:** `dist/admin-angular/browser` (Angular 17 genera la carpeta `browser`; si Vercel no lo detecta, indícalo manualmente).
- Deploy. Anota la URL.

---

## PASO 6 — Cerrar el CORS (seguridad)

Vuelve a Render → variables del backend → edita `CORS_ORIGINS` y pon las URLs reales de Vercel separadas por coma, por ejemplo:

```
CORS_ORIGINS=https://portal-estudiante.vercel.app,https://admin-angular.vercel.app,https://sitio-publico.vercel.app
```

Guarda; Render redespliega solo. Así solo tus apps pueden consumir la API.

---

## PASO 7 — Verificar en incógnito

Abre una ventana de incógnito y comprueba, con las URLs públicas:
- Registro y login funcionan.
- El catálogo carga cursos (vienen de Atlas).
- Un estudiante se inscribe y ve sus inscripciones.
- El admin entra al panel y hace CRUD de cursos y usuarios.
- Las rutas protegidas redirigen al login si no hay sesión.

---

## PASO 8 — Reporte Lighthouse

Sigue las instrucciones de [`docs/lighthouse.md`](docs/lighthouse.md): corre Lighthouse sobre la URL del portal, exporta el reporte y guárdalo en `/docs`. Escribe 3–4 líneas de análisis y mejoras.

---

## PASO 9 — Completar el README

En `README.md` rellena: integrantes, las 4 URLs desplegadas, el enlace de YouTube y agrega capturas. Verifica que las credenciales de prueba estén documentadas.

---

## PASO 10 — Grabar y subir el video

Guíate por la **sección 6** del documento del profesor (estructura del video). Puntos clave:
- 12 a 15 minutos, **todos los integrantes con cámara prendida**, cada uno explica una parte técnica verificable.
- Estructura: equipo y problema → arquitectura (Angular/React/Next/Node/Mongo) → demo en vivo con las URLs → explicación de JWT, roles, estado global y persistencia → seguridad, variables y Lighthouse → conclusiones y aporte de cada uno.
- Súbelo a YouTube como **"no listado"** y pega el enlace en el README.

---

## PASO 11 — Checklist final (del profesor)

Revisa la **sección 9** del documento antes de entregar:
- [ ] Repositorio accesible con el código final.
- [ ] README con enlace de YouTube y todas las URLs.
- [ ] Todos en el video con cámara y explicando su aporte.
- [ ] Apps funcionando desde incógnito.
- [ ] Credenciales de prueba documentadas sin exponer secretos.
- [ ] `.env` NO subido; existe `.env.example`.
- [ ] API responde y Atlas conecta desde el backend desplegado.
- [ ] Rutas protegidas y roles probados.
- [ ] Documentación técnica y Lighthouse en `/docs`.
- [ ] Historial de asistencia y participación revisado.

---

## Muy importante (integridad académica)

El profesor podrá pedir una **demo en vivo, modificar un dato, ejecutar un endpoint o hacer preguntas individuales**, y la nota puede diferenciarse por integrante. La copia o la imposibilidad de explicar el código se sanciona.

Por eso: **usa este proyecto como base para entender y construir el suyo**. Repartan responsabilidades, personalicen el dominio/estilo, hagan sus propios commits y asegúrense de que **cada integrante pueda explicar la parte que le toca** (JWT, estado global, CRUD, SSR, seguridad). Eso es justo lo que evalúa la rúbrica.
