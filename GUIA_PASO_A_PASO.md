# Guía paso a paso — de cero a entregado

Sigue los pasos en orden. Al terminar tendrás lo que pide el profesor: repositorio en
GitHub con historial de commits, cuatro aplicaciones desplegadas, base de datos en la
nube, documentación técnica, reporte Lighthouse y video en YouTube.

**Tiempo estimado:** unas 3 a 4 horas la primera vez, sin contar el video.

### Ruta rápida

| Paso | Qué se logra | Tiempo aprox. |
|------|--------------|---------------|
| [0](#paso-0--preparar-el-terreno) | Cuentas y herramientas | 15 min |
| [1](#paso-1--base-de-datos-en-mongodb-atlas) | Base de datos en Atlas | 20 min |
| [2](#paso-2--probar-el-proyecto-en-tu-computadora) | Todo corriendo en local | 30 min |
| [3](#paso-3--personalizar-el-proyecto-no-te-lo-saltes) | El proyecto es de tu equipo | 1 h+ |
| [4](#paso-4--subir-el-código-a-github) | Repositorio con historial | 20 min |
| [5](#paso-5--desplegar-el-backend-en-render) | API en línea | 25 min |
| [6](#paso-6--desplegar-los-tres-frontends-en-vercel) | Tres apps en línea | 40 min |
| [7](#paso-7--cerrar-el-cors) | Seguridad de producción | 10 min |
| [8](#paso-8--verificar-todo-en-incógnito) | Confirmación de que funciona | 15 min |
| [9](#paso-9--reporte-lighthouse) | Reporte de rendimiento | 15 min |
| [10](#paso-10--completar-el-readme) | Documentación final | 20 min |
| [11](#paso-11--grabar-y-subir-el-video) | Video de sustentación | 1–2 h |
| [12](#paso-12--checklist-final) | Revisión antes de entregar | 15 min |

---

## PASO 0 — Preparar el terreno

Crea estas cuentas gratuitas (usen el correo institucional del equipo, y **compartan el
acceso**: si solo uno tiene la contraseña de Render, el equipo se bloquea):

- **GitHub** — github.com
- **MongoDB Atlas** — mongodb.com/atlas
- **Render** — render.com
- **Vercel** — vercel.com (puedes entrar con tu cuenta de GitHub)

Instala en tu computadora **Node.js 18 o superior** y **Git**. Verifica:

```bash
node -v    # debe mostrar v18 o mayor
npm -v
git --version
```

> **Repartan el trabajo desde ahora.** Sugerencia: un integrante por capa (backend,
> React, Angular, Next.js) y quien termine primero se encarga del despliegue. Cada uno
> debe hacer sus propios commits: el profesor puede revisar el historial.

---

## PASO 1 — Base de datos en MongoDB Atlas

1. Entra a Atlas → **Create** → clúster gratuito **M0** (elige la región más cercana).
2. **Database Access** → **Add New Database User** → crea un usuario con contraseña.
   Anótalos; los vas a necesitar en un momento.
   > Evita símbolos raros (`@`, `/`, `:`) en la contraseña: rompen la cadena de conexión.
3. **Network Access** → **Add IP Address** → `0.0.0.0/0` (*Allow access from anywhere*).
   Render usa IPs dinámicas, así que sin esto el backend desplegado no podrá conectarse.
   > En un sistema real se restringiría por IP; para la evaluación se acepta, pero
   > menciónalo como mejora futura en el video: suma puntos.
4. **Connect** → **Drivers** → copia la cadena de conexión:

   ```
   mongodb+srv://usuario:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

5. Reemplaza `<password>` por tu contraseña real **y agrega el nombre de la base** justo
   antes del `?`:

   ```
   mongodb+srv://usuario:MiClave123@cluster0.xxxxx.mongodb.net/plataforma_cursos?retryWrites=true&w=majority
   ```

6. Guarda esa cadena: va en `backend/.env` como `MONGODB_URI`.

---

## PASO 2 — Probar el proyecto en tu computadora

Descomprime el ZIP. Verás las carpetas `backend`, `student-react`, `admin-angular`,
`public-next` y `docs`.

La guía completa —con puertos, verificaciones y errores frecuentes— está en
**[`docs/ejecucion-local.md`](docs/ejecucion-local.md)**. Resumen:

```bash
# Terminal 1 — API
cd backend && cp .env.example .env    # completa MONGODB_URI y JWT_SECRET
npm install && npm run seed && npm run dev      # :4000

# Terminal 2 — Portal del estudiante
cd student-react && cp .env.example .env
npm install && npm run dev                      # :5173

# Terminal 3 — Panel admin
cd admin-angular && npm install && npm start    # :4200

# Terminal 4 — Sitio público
cd public-next && cp .env.example .env
npm install && npm run dev                      # :3000
```

**No avances hasta que esto funcione:**

- [ ] `http://localhost:4000/api/health` responde `{"status":"ok"}`
- [ ] En React puedes registrarte, iniciar sesión e inscribirte a un curso
- [ ] En Angular entras como admin y creas un curso
- [ ] En Next.js ves el catálogo y el detalle de un curso

> Si algo falla, la tabla de **problemas frecuentes** al final de
> `docs/ejecucion-local.md` cubre casi todos los casos (CORS, Atlas, puertos ocupados).

---

## PASO 3 — Personalizar el proyecto (no te lo saltes)

Este es el paso que separa un trabajo aprobado de uno observado. El profesor puede pedir
**demo en vivo, modificar un dato, ejecutar un endpoint o hacer preguntas individuales**,
y la nota se diferencia por integrante.

Antes de desplegar, con tu equipo:

1. **Lee y entiende el código.** Empieza por [`docs/modulos.md`](docs/modulos.md), que
   explica archivo por archivo qué hace cada pieza. Cada integrante debe poder explicar
   su capa sin leer.
2. **Adapta el dominio a tu propuesta.** Cambia campos, agrega alguno propio (por
   ejemplo modalidad, horario o nivel del curso) y ajusta los formularios y validaciones
   para que lo reflejen. Es el mejor ejercicio para entender el flujo completo:
   modelo → validación → controlador → servicio → formulario.
3. **Cambia identidad visual y textos.** Nombre de la plataforma, colores, títulos.
4. **Cambia las credenciales del seed** por unas propias.
5. **Repartan formalmente las responsabilidades** y anótenlas en el README: eso es lo que
   cada quien defenderá en el video.

Preguntas típicas que conviene poder responder sin dudar:

- ¿Dónde se hashea la contraseña y por qué ahí y no en el controlador?
- ¿Qué contiene el JWT y quién lo valida en cada petición?
- ¿Qué diferencia hay entre `verifyToken` y `requireRole`? (401 vs 403)
- ¿Qué evita que un estudiante se inscriba dos veces al mismo curso?
- ¿Por qué Context API y no Redux?
- ¿Qué diferencia hay entre SSR, SSG e ISR, y dónde usaron cada uno?

---

## PASO 4 — Subir el código a GitHub

> El profesor exige **commits progresivos**, no un único commit final. Idealmente cada
> integrante empuja los suyos durante el desarrollo.

```bash
cd plataforma-cursos
git init
git add .
git commit -m "chore: estructura inicial del monorepo"

# crea un repositorio VACÍO en github.com (sin README) y copia su URL
git remote add origin https://github.com/USUARIO/plataforma-cursos.git
git branch -M main
git push -u origin main
```

Luego, mientras trabajan, commits pequeños y descriptivos:

```bash
git commit -m "feat(backend): endpoint de inscripciones"
git commit -m "feat(react): pantalla de mis inscripciones"
git commit -m "fix(angular): validación del formulario de cursos"
git commit -m "docs: diagrama de arquitectura"
```

**Verificación crítica:** entra al repositorio en GitHub y confirma que **NO** se subió
ningún archivo `.env` (solo los `.env.example`) ni carpetas `node_modules`. El
`.gitignore` ya los excluye, pero revísalo con tus ojos: subir un `JWT_SECRET` o la
cadena de Atlas es una falla de seguridad que se penaliza.

Si por accidente ya subiste un `.env`, cambia inmediatamente la contraseña de Atlas y el
`JWT_SECRET` — borrarlo del repositorio no basta, queda en el historial.

Agrega a tus compañeros como colaboradores en **Settings → Collaborators**, y al final
asegúrate de que el repositorio sea accesible para el profesor (público, o invítalo).

---

## PASO 5 — Desplegar el BACKEND en Render

1. Render → **New** → **Web Service** → conecta tu repositorio de GitHub.
2. Configura:

   | Campo | Valor |
   |-------|-------|
   | **Root Directory** | `backend` |
   | **Runtime** | Node |
   | **Build Command** | `npm install` |
   | **Start Command** | `npm start` |
   | **Instance Type** | Free |

   El **Root Directory** es lo más importante: sin él, Render intenta compilar la raíz
   del monorepo y falla.

3. En **Environment** agrega las variables (las mismas de tu `.env` local, pero con
   valores de producción):

   | Variable | Valor |
   |----------|-------|
   | `MONGODB_URI` | tu cadena de Atlas |
   | `JWT_SECRET` | una cadena larga y aleatoria **distinta** a la local |
   | `JWT_EXPIRES_IN` | `1d` |
   | `CORS_ORIGINS` | déjalo vacío por ahora; lo cierras en el PASO 7 |
   | `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | los del admin del seed |

   No definas `PORT`: Render lo inyecta automáticamente.

4. **Create Web Service** y espera a que el estado sea **Live**. Anota la URL:
   `https://tu-api.onrender.com`.
5. **Carga los datos**: pestaña **Shell** del servicio → `npm run seed`. (Alternativa:
   córrelo localmente apuntando a la misma cadena de Atlas.)
6. **Verifica**: abre `https://tu-api.onrender.com/api/health` → `{"status":"ok"}`, y
   `https://tu-api.onrender.com/api/courses` → la lista de cursos.

> **Sobre el plan gratuito:** Render duerme el servicio tras 15 minutos sin tráfico, y la
> primera petición después tarda 30–50 segundos. Es normal. **Antes de grabar el video o
> de la demo en vivo, abre la URL de la API y espera a que despierte**, o parecerá que la
> aplicación no funciona.
>
> Si el despliegue falla, revisa los **Logs** de Render: casi siempre es el Root
> Directory mal puesto o falta una variable de entorno.

---

## PASO 6 — Desplegar los tres FRONTENDS en Vercel

Repite el proceso **tres veces**, una por carpeta. En cada una: Vercel → **Add New** →
**Project** → importa el mismo repositorio → cambia el **Root Directory**.

### 6A. Portal del estudiante (React + Vite)

| Campo | Valor |
|-------|-------|
| Root Directory | `student-react` |
| Framework Preset | Vite |
| Variable de entorno | `VITE_API_URL` = `https://tu-api.onrender.com/api` |

Ojo: la URL termina en **`/api`**, sin barra final. Deploy y anota la URL.

### 6B. Sitio público (Next.js)

| Campo | Valor |
|-------|-------|
| Root Directory | `public-next` |
| Framework Preset | Next.js |
| Variable de entorno | `NEXT_PUBLIC_API_URL` = `https://tu-api.onrender.com/api` |

> Next.js consulta la API **durante el build**. Si Render está dormido, el catálogo puede
> quedar vacío en esa compilación: despierta la API primero y, si pasa, vuelve a
> desplegar con **Redeploy**.

### 6C. Panel administrativo (Angular)

**Antes de importar**, edita `admin-angular/src/environments/environment.ts` con la URL
real de la API, y haz commit y push:

```ts
export const environment = {
  production: true,
  apiUrl: 'https://tu-api.onrender.com/api',
};
```

| Campo | Valor |
|-------|-------|
| Root Directory | `admin-angular` |
| Framework Preset | Angular |
| Build Command | `npm run build` |
| **Output Directory** | `dist/admin-angular/browser` |

El Output Directory es el error más común: Angular 17 genera una subcarpeta `browser`.
Si Vercel no la detecta, indícala manualmente o verás un 404 tras un deploy "exitoso".

---

## PASO 7 — Cerrar el CORS

Vuelve a Render → variables del backend → edita `CORS_ORIGINS` con las URLs reales de
Vercel separadas por coma, **sin espacios y sin barra final**:

```
CORS_ORIGINS=https://portal-estudiante.vercel.app,https://admin-plataforma.vercel.app,https://sitio-cursos.vercel.app
```

Guarda; Render redespliega solo. A partir de ahí, solo tus aplicaciones pueden consumir
la API: cualquier otro sitio recibe un error de CORS. Es un control de seguridad
concreto y fácil de demostrar en el video (abre la consola del navegador y muéstralo).

---

## PASO 8 — Verificar todo en incógnito

Abre una ventana de incógnito (sin sesiones ni caché) y recorre las URLs **públicas**:

- [ ] El sitio Next.js carga el catálogo y el detalle de un curso
- [ ] Registro y login funcionan en el portal React
- [ ] Un estudiante se inscribe y ve su inscripción; puede cancelarla
- [ ] No puede inscribirse dos veces al mismo curso
- [ ] El admin entra al panel y hace CRUD de cursos y de usuarios
- [ ] Un estudiante **no** puede entrar al panel admin (el guard lo bloquea)
- [ ] Las rutas protegidas redirigen al login si no hay sesión
- [ ] Un curso creado desde Angular aparece en React y en Next.js

Ese último punto es la prueba de que las cuatro apps comparten la misma base de datos:
grábalo, es el momento más convincente de la demostración.

---

## PASO 9 — Reporte Lighthouse

Sigue [`docs/lighthouse.md`](docs/lighthouse.md). En resumen: abre la URL desplegada en
Chrome → DevTools (F12) → pestaña **Lighthouse** → **Analyze page load**.

Corre el análisis sobre el **sitio Next.js** (es el que mejor puntúa por el renderizado
en servidor) y también sobre el portal React para comparar. Exporta los reportes a
`/docs` y escribe tres o cuatro líneas: qué puntajes obtuviste, qué recomendó la
herramienta y qué mejorarías. **El análisis vale más que el puntaje**: reconocer una
debilidad y explicar cómo la resolverías demuestra criterio.

---

## PASO 10 — Completar el README

En `README.md` rellena:

- [ ] Nombres reales de los integrantes y el aporte de cada uno
- [ ] Las cuatro URLs desplegadas
- [ ] El enlace de YouTube
- [ ] Capturas de pantalla: catálogo, login, inscripción, panel del estudiante y panel admin
- [ ] Credenciales de prueba (sin exponer secretos reales)

---

## PASO 11 — Grabar y subir el video

Guíate por la **sección 6** del documento del profesor. Puntos obligatorios: **12 a 15
minutos**, **todos los integrantes con cámara prendida**, y cada uno explicando una parte
técnica verificable.

Estructura sugerida:

| Minutos | Contenido | Quién |
|---------|-----------|-------|
| 0–1 | Presentación del equipo y del problema | Todos |
| 1–3 | Arquitectura: las 4 apps, la API y Atlas (muestra el diagrama) | Integrante 1 |
| 3–7 | **Demo en vivo** con las URLs desplegadas: catálogo → registro → inscripción → panel admin | Integrante 2 |
| 7–10 | Código: JWT y roles, estado global, CRUD | Integrantes 3 y 4 |
| 10–12 | SSR/SSG en Next.js y persistencia en Atlas (muéstralo en la consola de Atlas) | Integrante 4 |
| 12–14 | Seguridad, variables de entorno y Lighthouse | Integrante 1 |
| 14–15 | Conclusiones y aporte de cada uno | Todos |

Consejos prácticos:

- **Despierta el backend de Render antes de grabar** (abre `/api/health` y espera).
- Ensayen el recorrido una vez antes de la toma buena.
- Muestra código real en pantalla, no solo diapositivas.
- Ten a mano el panel de Atlas para mostrar los documentos guardándose de verdad.
- Sube el video como **"No listado"** y pega el enlace en el README. Verifica que se
  pueda abrir desde una ventana de incógnito.

---

## PASO 12 — Checklist final

Revisa la **sección 9** del documento del profesor antes de entregar:

- [ ] Repositorio accesible con el código final
- [ ] README con enlace de YouTube y las cuatro URLs
- [ ] Historial con commits progresivos de varios integrantes
- [ ] Todos en el video con cámara y explicando su aporte
- [ ] Las aplicaciones funcionan desde una ventana de incógnito
- [ ] Credenciales de prueba documentadas, sin exponer secretos
- [ ] Ningún `.env` subido; existen los `.env.example`
- [ ] La API responde y Atlas conecta desde el backend desplegado
- [ ] Rutas protegidas y roles probados
- [ ] Documentación técnica y reporte Lighthouse en `/docs`
- [ ] Cada integrante puede explicar su parte sin leer

---

## Muy importante — integridad académica

El profesor podrá pedir una **demo en vivo, modificar un dato, ejecutar un endpoint o
hacer preguntas individuales**, y la nota puede diferenciarse por integrante. La copia o
la imposibilidad de explicar el código se sanciona.

Por eso este proyecto es una **base para entender y construir el de tu equipo**, no algo
para entregar tal cual. Repartan responsabilidades, personalicen el dominio y el diseño,
hagan sus propios commits y asegúrense de que **cada integrante pueda explicar la parte
que le toca**. Eso es exactamente lo que evalúa la rúbrica.
