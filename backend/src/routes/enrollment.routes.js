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

const router = Router();

// Estudiante
router.post(
  '/',
  verifyToken,
  requireRole('student'),
  [body('courseId').notEmpty().withMessage('courseId es obligatorio')],
  handleValidation,
  enroll
);
router.get('/mine', verifyToken, requireRole('student'), myEnrollments);
router.delete('/:id', verifyToken, requireRole('student'), cancelEnrollment);

// Admin
router.get('/', verifyToken, requireRole('admin'), listAllEnrollments);

export default router;
