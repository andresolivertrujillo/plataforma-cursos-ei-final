import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Course from './models/Course.js';

const courses = [
  { title: 'Introduccion a JavaScript', description: 'Fundamentos del lenguaje JS moderno.', category: 'Programacion', instructor: 'Ana Torres', credits: 3, capacity: 30, price: 0 },
  { title: 'React desde cero', description: 'Componentes, hooks y estado.', category: 'Frontend', instructor: 'Luis Rojas', credits: 4, capacity: 25, price: 120 },
  { title: 'APIs REST con Node y Express', description: 'Construye tu propia API con MongoDB.', category: 'Backend', instructor: 'Carla Diaz', credits: 4, capacity: 20, price: 150 },
  { title: 'Angular Profesional', description: 'SPA empresariales con Angular y TypeScript.', category: 'Frontend', instructor: 'Jorge Pena', credits: 4, capacity: 20, price: 150 },
  { title: 'Next.js y SSR', description: 'Renderizado en servidor y sitios estaticos.', category: 'Fullstack', instructor: 'Maria Gil', credits: 3, capacity: 30, price: 100 },
];

const requiredSeedVariables = [
  'SEED_ADMIN_NAME',
  'SEED_ADMIN_EMAIL',
  'SEED_ADMIN_PASSWORD',
  'SEED_STUDENT_NAME',
  'SEED_STUDENT_EMAIL',
  'SEED_STUDENT_PASSWORD',
];

async function run() {
  const missingVariables = requiredSeedVariables.filter(
    (variable) => !process.env[variable]?.trim()
  );

  if (missingVariables.length > 0) {
    console.error(
      `Seed cancelado. Faltan variables de entorno obligatorias: ${missingVariables.join(', ')}`
    );
    process.exitCode = 1;
    return;
  }

  try {
    await connectDB();

    // Admin inicial
    const adminEmail = process.env.SEED_ADMIN_EMAIL.trim();
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        name: process.env.SEED_ADMIN_NAME.trim(),
        email: adminEmail,
        password: process.env.SEED_ADMIN_PASSWORD,
        role: 'admin',
      });
      console.log(`Admin creado: ${adminEmail}`);
    } else {
      console.log('El admin ya existia.');
    }

    // Estudiante de prueba
    const studentEmail = process.env.SEED_STUDENT_EMAIL.trim();
    if (!(await User.findOne({ email: studentEmail }))) {
      await User.create({
        name: process.env.SEED_STUDENT_NAME.trim(),
        email: studentEmail,
        password: process.env.SEED_STUDENT_PASSWORD,
        role: 'student',
      });
      console.log(`Estudiante de prueba creado: ${studentEmail}`);
    }

    // Cursos
    const count = await Course.countDocuments();
    if (count === 0) {
      await Course.insertMany(courses);
      console.log(`${courses.length} cursos insertados.`);
    } else {
      console.log('Ya existian cursos, no se insertaron nuevos.');
    }

    console.log('Seed completado.');
  } catch (err) {
    console.error('Error en el seed:', err.message);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }
}

run();
