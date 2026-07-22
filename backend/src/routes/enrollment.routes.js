import { Router } from 'express';
import { body } from 'express-validator';
import {
  enroll,
  myEnrollments,
  cancelEnrollment,
  listAllEnrollments,
} from '../controllers/enrollment.controller.js';
import { verifyToken, requireRole } from '../middlewares/auth.js';
import { handleValidation } from '../utils/validate.js';
import { validateObjectId } from '../middlewares/validateObjectId.js';

const router = Router();

// Estudiante
router.post(
  '/',
  verifyToken,
  requireRole('student'),
  [body('courseId').notEmpty().withMessage('courseId es obligatorio').isMongoId().withMessage('courseId invalido')],
  handleValidation,
  enroll
);
router.get('/mine', verifyToken, requireRole('student'), myEnrollments);
router.delete('/:id', verifyToken, requireRole('student'), validateObjectId('id'), cancelEnrollment);

// Admin
router.get('/', verifyToken, requireRole('admin'), listAllEnrollments);

export default router;
