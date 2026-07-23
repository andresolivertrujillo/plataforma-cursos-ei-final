import { Router } from 'express';
import { body } from 'express-validator';
import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/user.controller.js';
import { verifyToken, requireRole } from '../middlewares/auth.js';
import { handleValidation } from '../utils/validate.js';
import { validateObjectId } from '../middlewares/validateObjectId.js';

const router = Router();

// Todas requieren admin
router.use(verifyToken, requireRole('admin'));

const userUpdateValidations = [
  body('name').optional().trim().notEmpty().withMessage('El nombre no puede estar vacio'),
  body('email').optional().isEmail().withMessage('Email invalido'),
  body('role').optional().isIn(['admin', 'student']).withMessage('Rol invalido'),
];

router.get('/', listUsers);
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('Email invalido'),
    body('password').isLength({ min: 6 }).withMessage('Minimo 6 caracteres'),
    body('role').optional().isIn(['admin', 'student']).withMessage('Rol invalido'),
  ],
  handleValidation,
  createUser
);
router.put('/:id', validateObjectId('id'), userUpdateValidations, handleValidation, updateUser);
router.delete('/:id', validateObjectId('id'), deleteUser);

export default router;
