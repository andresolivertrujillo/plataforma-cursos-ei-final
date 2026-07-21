# Checklist de seguridad

| # | Control | Estado | Donde se aplica |
|---|---------|--------|-----------------|
| 1 | Contrasenas hasheadas (bcrypt) | Implementado | `backend/src/models/User.js` (hook pre-save) |
| 2 | Autenticacion con JWT | Implementado | `backend/src/controllers/auth.controller.js`, `middlewares/auth.js` |
| 3 | Autorizacion por roles (admin/student) | Implementado | `middlewares/auth.js` (requireRole) |
| 4 | Cabeceras seguras (Helmet) | Implementado | `backend/src/index.js` |
| 5 | CORS restringido por lista blanca | Implementado | `backend/src/index.js` (variable CORS_ORIGINS) |
| 6 | Rate limiting (anti fuerza bruta) | Implementado | `backend/src/index.js` (express-rate-limit) |
| 7 | Validacion de entradas | Implementado | express-validator en las rutas |
| 8 | Manejo de errores coherente (HTTP) | Implementado | `middlewares/errorHandler.js` |
| 9 | HTTPS | Provisto por Vercel/Render | Plataformas de despliegue |
| 10 | Secretos fuera del repo (.env) | Implementado | `.env.example` + `.gitignore` |
| 11 | Rutas protegidas por rol en el front | Implementado | Angular `adminGuard`, React `ProtectedRoute` |
| 12 | Proteccion basica XSS | Mitigado | Helmet + React/Angular escapan el HTML por defecto |
| 13 | Proteccion CSRF | Mitigado | JWT en header Authorization (no cookies de sesion), CORS restringido |

## Notas
- No se guardan tokens en cookies; se usa `Authorization: Bearer`, lo que reduce el riesgo de CSRF.
- El token expira segun `JWT_EXPIRES_IN` (1 dia por defecto).
- El seed no debe ejecutarse en produccion con contrasenas debiles: cambia `ADMIN_PASSWORD`.
