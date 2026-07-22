# Módulos del sistema

Este documento explica **qué hace cada carpeta y cada archivo** de las cuatro
aplicaciones. Está pensado para que cualquier integrante del equipo pueda abrir un
archivo, entender su responsabilidad y explicarlo en la sustentación.

Índice:

1. [Backend — API REST](#1-backend--api-rest)
2. [Portal del estudiante — React](#2-portal-del-estudiante--react)
3. [Panel administrativo — Angular](#3-panel-administrativo--angular)
4. [Sitio público — Next.js](#4-sitio-público--nextjs)
5. [Cómo se comunican los módulos](#5-cómo-se-comunican-los-módulos)

---

## 1. Backend — API REST

Carpeta: `backend/`. Node.js + Express + Mongoose. Usa **módulos ES**
(`"type": "module"` en `package.json`), por eso los imports llevan la extensión `.js`.

### Organización por capas

```
backend/src/
├── index.js            → arranque del servidor y middlewares globales
├── config/db.js        → conexión a MongoDB
├── models/             → esquemas de datos (Mongoose)
├── routes/             → definición de rutas + validaciones
├── controllers/        → lógica de negocio
├── middlewares/        → autenticación, roles y manejo de errores
├── utils/validate.js   → helper de validación
└── seed.js             → carga de datos iniciales
```

La regla es: **la ruta valida, el controlador decide, el modelo persiste.** Ningún
controlador habla directamente con la base de datos sin pasar por un modelo, y ninguna
ruta contiene lógica de negocio.

### `index.js` — punto de entrada

Levanta Express y encadena los middlewares globales en este orden:

| Orden | Middleware | Para qué sirve |
|-------|-----------|----------------|
| 1 | `helmet()` | Cabeceras HTTP de seguridad (XSS, sniffing, clickjacking) |
| 2 | `cors({ origin })` | Solo acepta peticiones desde los dominios de `CORS_ORIGINS` |
| 3 | `express.json()` | Parsea el cuerpo JSON de las peticiones |
| 4 | `rateLimit` | Limita peticiones por IP (mitiga fuerza bruta) |
| 5 | Routers | `/api/auth`, `/api/courses`, `/api/enrollments`, `/api/users` |
| 6 | `notFound` | Devuelve 404 con formato JSON uniforme |
| 7 | `errorHandler` | Captura cualquier error y responde en un formato único |

También expone `GET /api/health`, que sirve para comprobar que el servicio está vivo
después de desplegarlo en Render.

### `config/db.js`

Exporta `connectDB()`, que se conecta a MongoDB con `mongoose.connect(MONGODB_URI)`.
Si falla, imprime el error y termina el proceso — así el despliegue no queda "vivo pero
roto".

### `models/` — esquemas de datos

**`User.js`**

| Campo | Tipo | Notas |
|-------|------|-------|
| `name` | String | Requerido |
| `email` | String | Requerido, único, en minúsculas |
| `password` | String | Mínimo 6 caracteres, `select: false` |
| `role` | String | `admin` o `student` (por defecto `student`) |

Dos piezas clave:

- Un **hook `pre('save')`** que hashea la contraseña con **bcrypt** antes de guardarla.
  Nunca se almacena texto plano, y como el hook vive en el modelo, cualquier ruta que
  cree usuarios queda protegida automáticamente.
- Un método `comparePassword()` que compara la contraseña enviada en el login contra el
  hash.
- `select: false` hace que la contraseña **no se devuelva** en las consultas normales;
  hay que pedirla explícitamente en el login.

**`Course.js`** — `title`, `description`, `category`, `instructor`, `credits` (1 a 10),
`capacity`, `price`, `active`, con `timestamps`.

**`Enrollment.js`** — relaciona estudiante y curso mediante referencias (`ObjectId` a
`User` y a `Course`) más un `status`. Tiene un **índice único compuesto**:

```js
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });
```

Esto impide, **a nivel de base de datos**, que un estudiante se inscriba dos veces al
mismo curso. Es una validación que no se puede saltar aunque falle la del controlador.

### `middlewares/`

**`auth.js`** contiene los dos guardianes de la API:

- `verifyToken` — lee la cabecera `Authorization: Bearer <token>`, la verifica con
  `jwt.verify()` y coloca los datos del usuario en `req.user`. Si no hay token o es
  inválido, responde 401.
- `requireRole('admin')` — se usa **después** de `verifyToken` y comprueba que
  `req.user.role` esté entre los roles permitidos. Si no, responde 403.

La diferencia importa y suele preguntarse: **401 = no sé quién eres; 403 = sé quién eres
pero no puedes**.

**`errorHandler.js`** — `notFound` para rutas inexistentes y `errorHandler` como red
final. Traduce errores técnicos a mensajes útiles: el código `11000` de Mongo (clave
duplicada) se convierte en un mensaje de "registro duplicado", y los `ValidationError`
de Mongoose en un 400 legible.

### `utils/validate.js`

`handleValidation` recoge el resultado de **express-validator** y, si hay errores,
corta la petición con un 400 y la lista de campos inválidos. Se coloca entre las
validaciones y el controlador.

### `routes/` y `controllers/`

Cada recurso tiene su par ruta/controlador. Las rutas declaran el camino, las
validaciones y qué middlewares de seguridad aplican; los controladores contienen la
lógica.

| Router | Controlador | Funciones | Protección |
|--------|------------|-----------|------------|
| `auth.routes.js` | `register`, `login`, `me` | Registro, login (firma el JWT) y perfil actual | `me` requiere token |
| `course.routes.js` | `listCourses`, `getCourse`, `createCourse`, `updateCourse`, `deleteCourse` | CRUD de cursos + búsqueda | Lectura pública; escritura solo `admin` |
| `enrollment.routes.js` | `enroll`, `myEnrollments`, `cancelEnrollment`, `listAllEnrollments` | Inscribirse, ver y cancelar las propias | Requiere token; el listado total es solo `admin` |
| `user.routes.js` | `listUsers`, `createUser`, `updateUser`, `deleteUser` | CRUD de usuarios | Todo solo `admin` |

Ejemplo de cómo se lee una ruta protegida:

```js
router.post('/', verifyToken, requireRole('admin'), courseValidations, handleValidation, createCourse);
//              └─ ¿hay sesión?  └─ ¿es admin?     └─ ¿datos válidos?              └─ recién aquí actúa
```

Detalles de negocio que conviene poder explicar:

- `enroll` verifica que el curso exista y esté activo, y que el estudiante no esté ya
  inscrito, antes de crear la inscripción.
- `myEnrollments` filtra por `req.user.id`, **no** por un id que venga del cliente: un
  estudiante no puede pedir las inscripciones de otro.
- `cancelEnrollment` comprueba que la inscripción pertenezca a quien la cancela.
- `listCourses` acepta un parámetro de búsqueda para filtrar el catálogo.

### `seed.js`

Script ejecutable con `npm run seed`. Crea el usuario administrador (según las variables
`ADMIN_*`), un estudiante de prueba y varios cursos de ejemplo. Sirve para que la app
desplegada no aparezca vacía en la demostración.

---

## 2. Portal del estudiante — React

Carpeta: `student-react/`. SPA con **Vite**, **React Router** y **Context API**.

```
student-react/src/
├── main.jsx              → monta React y envuelve la app con AuthProvider
├── App.jsx               → definición de rutas
├── api/client.js         → cliente HTTP centralizado
├── context/AuthContext   → estado global de sesión
├── components/           → Navbar y ProtectedRoute
└── pages/                → Login, Register, Catalog, CourseDetail, MyEnrollments
```

### `api/client.js`

Una única función `apiFetch(path, options)` que:

1. arma la URL a partir de `VITE_API_URL`,
2. añade la cabecera `Authorization` con el token guardado en `localStorage`,
3. parsea la respuesta y lanza un error legible si el backend devuelve un fallo.

Centralizar esto significa que **ninguna página escribe `fetch` a mano**: si mañana
cambia la forma de autenticar, se toca un solo archivo.

### `context/AuthContext.jsx` — el estado global

Es la pieza que cumple el requisito de **manejo de estado global** de la rúbrica.
Expone mediante un `Provider`:

| Valor | Qué es |
|-------|--------|
| `user` | Usuario autenticado (o `null`) |
| `loading` | Indica si aún se está verificando la sesión al cargar |
| `login(email, password)` | Llama a la API, guarda el token y el usuario |
| `register(datos)` | Registra y deja la sesión iniciada |
| `logout()` | Borra token y usuario |

Al montar, si hay un token en `localStorage` llama a `/auth/me` para recuperar la sesión
—por eso al recargar la página **no** se pierde el login. El hook `useAuth()` permite
consumirlo desde cualquier componente sin pasar props.

Consumidores del contexto: `Navbar` (muestra el nombre o los botones de acceso),
`ProtectedRoute` (decide si deja pasar), `Login`/`Register` (disparan las acciones),
`CourseDetail` (sabe si puede inscribir) y `MyEnrollments`.

### `components/`

- **`Navbar.jsx`** — navegación; cambia según haya sesión o no.
- **`ProtectedRoute.jsx`** — envuelve las rutas privadas. Mientras `loading` es `true`
  muestra un aviso de carga; si no hay `user`, redirige a `/login`.

### `pages/`

| Página | Ruta | Qué hace |
|--------|------|----------|
| `Catalog.jsx` | `/` | Lista los cursos con buscador |
| `CourseDetail.jsx` | `/curso/:id` | Detalle + botón de inscripción |
| `Login.jsx` | `/login` | Formulario de acceso |
| `Register.jsx` | `/register` | Alta de estudiante |
| `MyEnrollments.jsx` | `/mis-inscripciones` | Inscripciones del alumno, con opción de cancelar (**protegida**) |

---

## 3. Panel administrativo — Angular

Carpeta: `admin-angular/`. Angular con **TypeScript**, componentes **standalone**
(sin `NgModule`) y **formularios reactivos**.

```
admin-angular/src/app/
├── app.config.ts               → providers (router y HttpClient con interceptor)
├── app.routes.ts               → rutas protegidas por el guard
├── app.component.ts            → layout con barra superior
├── interceptors/auth.interceptor.ts
├── guards/auth.guard.ts
├── services/                   → auth, course, user
└── pages/                      → login, dashboard, courses, users
```

### `services/` — acceso a datos

Clases inyectables (`@Injectable({ providedIn: 'root' })`) que usan `HttpClient` y
devuelven **Observables** de RxJS.

- **`auth.service.ts`** — login, guardado del token, lectura del usuario actual y
  `logout()`.
- **`course.service.ts`** — `list()`, `create()`, `update()`, `remove()`.
- **`user.service.ts`** — el CRUD equivalente para usuarios.

La segunda entidad administrable (usuarios, además de cursos) es un requisito explícito
de la evaluación.

### `interceptors/auth.interceptor.ts`

Se registra en `app.config.ts` con `provideHttpClient(withInterceptors([authInterceptor]))`.
Intercepta **toda** petición saliente y le añade la cabecera
`Authorization: Bearer <token>`. Es el equivalente Angular a lo que hace `apiFetch` en
React: el token se pone en un solo lugar.

### `guards/auth.guard.ts`

`adminGuard` es un guard funcional (`CanActivateFn`). Antes de activar una ruta
comprueba que haya sesión **y** que el rol sea `admin`; si no, redirige al login. Se
aplica a todas las rutas del panel salvo `/login`.

### `pages/`

| Componente | Ruta | Contenido |
|-----------|------|-----------|
| `login.component.ts` | `/login` | Formulario reactivo de acceso |
| `dashboard.component.ts` | `/` | Totales de cursos, usuarios e inscripciones |
| `courses.component.ts` | `/cursos` | Tabla + formulario reactivo: crear, editar y eliminar |
| `users.component.ts` | `/usuarios` | Mismo CRUD para usuarios |

En los componentes con formulario, `FormBuilder` se obtiene con
`private fb = inject(FormBuilder);` **declarado antes** del campo del formulario. Si se
inyecta por constructor, TypeScript lanza el error *TS2729: property used before
initialization*, porque los inicializadores de campo corren antes del cuerpo del
constructor.

---

## 4. Sitio público — Next.js

Carpeta: `public-next/`. Next.js con **App Router**. Es la app que demuestra el
requisito de **renderizado del lado del servidor**.

```
public-next/
├── lib/api.js              → funciones de datos (se ejecutan en el servidor)
├── app/layout.js           → layout raíz
├── app/page.js             → portada (estática)
├── app/cursos/page.js      → catálogo (ISR)
└── app/cursos/[id]/page.js → detalle (SSG)
```

### `lib/api.js`

`getCourses()` y `getCourse(id)` consultan la API usando `NEXT_PUBLIC_API_URL`. Ambas
están envueltas en `try/catch` y devuelven un valor vacío si la API no responde: así
**el build no falla** aunque el backend esté dormido en Render al momento de desplegar.

### Estrategias de renderizado

| Ruta | Estrategia | Cómo se logra |
|------|-----------|---------------|
| `/` | Estática | Contenido fijo, se genera en el build |
| `/cursos` | **ISR** | `export const revalidate = 60` — se regenera cada 60 s |
| `/cursos/[id]` | **SSG** | `generateStaticParams()` pregunta a la API qué cursos existen y prerenderiza uno por curso |

En resumen, para la sustentación: **SSG** genera el HTML durante el build, **SSR** lo
genera en cada petición, e **ISR** es el punto medio — se sirve HTML ya generado y se
refresca cada cierto tiempo. Al correr `npm run build` se puede mostrar en la consola
cómo Next marca cada ruta, y `/cursos/[id]` aparece como estática.

---

## 5. Cómo se comunican los módulos

Ejemplo completo: **un estudiante se inscribe a un curso**.

```
1. React — CourseDetail llama a apiFetch('/enrollments', { method: 'POST', ... })
2. apiFetch lee el token de localStorage y lo pone en la cabecera Authorization
3. Express — helmet → cors → json → rateLimit
4. enrollment.routes.js → verifyToken (valida el JWT y llena req.user)
5. enrollment.controller.js → enroll()
      · ¿existe el curso y está activo?
      · ¿ya está inscrito este estudiante?
6. Mongoose guarda el documento en la colección enrollments (índice único de respaldo)
7. Respuesta 201 → React actualiza la vista
8. Si algo falla en cualquier punto, errorHandler devuelve un JSON de error uniforme
```

Y el flujo de autenticación, que es el que más se pregunta:

```
Login → el backend busca el usuario, compara la contraseña con bcrypt
      → firma un JWT con { id, role } y lo devuelve
      → el cliente lo guarda (localStorage)
      → cada petición posterior lo envía en Authorization: Bearer <token>
      → verifyToken lo valida en el servidor; el backend no guarda sesiones (stateless)
```

Que el backend sea *stateless* es justamente lo que permite desplegarlo en Render sin
memoria compartida entre instancias.
