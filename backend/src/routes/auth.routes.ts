import { Router } from 'express';
import { AuthController } from '@controllers/auth.controller.js';
import { loginValidation, registerValidation } from '@validations/auth.schema.js';
import { auth } from '@middleware/auth.js';

const router = Router();
const authController = new AuthController();

router.post('/login', loginValidation, authController.login);
router.post('/logout', authController.logout);
router.get('/me', auth, authController.getProfile);
router.post('/register', auth, registerValidation, authController.register);

export default router;