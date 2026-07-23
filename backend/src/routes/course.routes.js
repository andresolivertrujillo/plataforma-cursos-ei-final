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
import { validateObjectId } from '../middlewares/validateObjectId.js';

const router = Router();

const courseValidations = [
  body('title').trim().notEmpty().withMessage('El titulo es obligatorio'),
  body('description').trim().notEmpty().withMessage('La descripcion es obligatoria'),
  body('category').trim().notEmpty().withMessage('La categoria es obligatoria'),
  body('instructor').trim().notEmpty().withMessage('El instructor es obligatorio'),
  body('credits').isInt({ min: 1, max: 10 }).withMessage('Creditos entre 1 y 10'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacidad minima 1'),
];

// Igual que courseValidations pero con campos opcionales: en una actualizacion
// (PUT) el cliente puede enviar solo algunos campos, pero si los envia deben
// cumplir las mismas reglas.
const courseUpdateValidations = [
  body('title').optional().trim().notEmpty().withMessage('El titulo no puede estar vacio'),
  body('description').optional().trim().notEmpty().withMessage('La descripcion no puede estar vacia'),
  body('category').optional().trim().notEmpty().withMessage('La categoria no puede estar vacia'),
  body('instructor').optional().trim().notEmpty().withMessage('El instructor no puede estar vacio'),
  body('credits').optional().isInt({ min: 1, max: 10 }).withMessage('Creditos entre 1 y 10'),
  body('capacity').optional().isInt({ min: 1 }).withMessage('Capacidad minima 1'),
  body('price').optional().isFloat({ min: 0 }).withMessage('El precio no puede ser negativo'),
  body('active').optional().isBoolean().withMessage('active debe ser booleano'),
];

// Publicas
router.get('/', listCourses);
router.get('/:id', validateObjectId('id'), getCourse);

// Solo admin
router.post('/', verifyToken, requireRole('admin'), courseValidations, handleValidation, createCourse);
router.put(
  '/:id',
  verifyToken,
  requireRole('admin'),
  validateObjectId('id'),
  courseUpdateValidations,
  handleValidation,
  updateCourse
);
router.delete('/:id', verifyToken, requireRole('admin'), validateObjectId('id'), deleteCourse);

export default router;
