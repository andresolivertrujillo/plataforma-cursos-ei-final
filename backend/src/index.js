import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import courseRoutes from './routes/course.routes.js';
import enrollmentRoutes from './routes/enrollment.routes.js';
import userRoutes from './routes/user.routes.js';
import { notFound, errorHandler } from './middlewares/errorHandler.js';

const app = express();

// ----- Seguridad -----
app.use(helmet()); // cabeceras seguras (XSS, clickjacking, etc.)

// CORS restringido a los origenes del .env
const origins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: (origin, cb) => {
      // Permite peticiones sin origin (Postman) y las de la lista blanca
      if (!origin || origins.includes(origin)) return cb(null, true);
      return cb(new Error('Origen no permitido por CORS'));
    },
    credentials: true,
  })
);

// Limita peticiones para mitigar abuso / fuerza bruta
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use(express.json());
app.use(morgan('dev'));

// ----- Rutas -----
app.get('/', (req, res) => res.json({ message: 'API Plataforma de Cursos - OK' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/users', userRoutes);

// ----- Manejo de errores -----
app.use(notFound);
app.use(errorHandler);

// ----- Arranque -----
const PORT = process.env.PORT || 4000;
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
  })
  .catch((err) => {
    console.error('No se pudo conectar a la base de datos:', err.message);
    process.exit(1);
  });

export default app;
