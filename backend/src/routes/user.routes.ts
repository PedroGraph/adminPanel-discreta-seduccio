import { Router } from 'express';
import { UserController } from '@controllers/user.controller.js';
import { auth } from '@middleware/auth.js';

const router = Router();
const userController = new UserController();

router.get('/', auth, userController.getAllUsers);
router.get('/:id', auth, userController.getUserById);
router.post('/', auth, userController.createUser);
router.put('/:id', auth, userController.updateUser);
router.delete('/:id', auth, userController.deleteUser);

export default router;
