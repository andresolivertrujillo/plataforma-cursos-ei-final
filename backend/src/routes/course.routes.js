import { Router } from 'express';
import { body } from 'express-validator';
import {
  listCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/course.controller.js';
import { verifyToken, requireRole } from '../middlewares/auth.js';
import { handleValidation } from '../utils/validate.js';

const router = Router();

const courseValidations = [
  body('title').trim().notEmpty().withMessage('El titulo es obligatorio'),
  body('description').trim().notEmpty().withMessage('La descripcion es obligatoria'),
  body('category').trim().notEmpty().withMessage('La categoria es obligatoria'),
  body('instructor').trim().notEmpty().withMessage('El instructor es obligatorio'),
  body('credits').isInt({ min: 1, max: 10 }).withMessage('Creditos entre 1 y 10'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacidad minima 1'),
];

// Publicas
router.get('/', listCourses);
router.get('/:id', getCourse);

// Solo admin
router.post('/', verifyToken, requireRole('admin'), courseValidations, handleValidation, createCourse);
router.put('/:id', verifyToken, requireRole('admin'), updateCourse);
router.delete('/:id', verifyToken, requireRole('admin'), deleteCourse);

export default router;
