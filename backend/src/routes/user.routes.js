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

const router = Router();

// Todas requieren admin
router.use(verifyToken, requireRole('admin'));

router.get('/', listUsers);
router.post(
  '/',
  [
    body('name').trim().notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
  ],
  handleValidation,
  createUser
);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
