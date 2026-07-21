import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, me } from '../controllers/auth.controller.js';
import { handleValidation } from '../utils/validate.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('Email invalido'),
    body('password').isLength({ min: 6 }).withMessage('Minimo 6 caracteres'),
  ],
  handleValidation,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email invalido'),
    body('password').notEmpty().withMessage('La contrasena es obligatoria'),
  ],
  handleValidation,
  login
);

router.get('/me', verifyToken, me);

export default router;
