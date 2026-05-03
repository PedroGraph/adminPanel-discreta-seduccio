import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { AuthController } from '@controllers/auth.controller.js';
import { loginValidation, registerValidation } from '@validations/auth.schema.js';
import { auth } from '@middleware/auth.js';

const router = Router();
const authController = new AuthController();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { status: false, message: 'Demasiados intentos de inicio de sesión. Intenta de nuevo en 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { status: false, message: 'Demasiados registros desde esta IP. Intenta de nuevo en una hora.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', loginLimiter, loginValidation, authController.login);
router.post('/logout', authController.logout);
router.get('/me', auth, authController.getProfile);
router.get('/ws-token', auth, authController.getWsToken);
router.post('/register', auth, registerLimiter, registerValidation, authController.register);

export default router;