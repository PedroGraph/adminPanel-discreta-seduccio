import { Router } from 'express';
import { getReturns, getReturnById, createReturn, updateReturnStatus } from '../controllers/returns.controller.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.use(auth);

router.get('/', getReturns);
router.get('/:id', getReturnById);
router.post('/', createReturn);
router.patch('/:id/status', updateReturnStatus);

export default router;
