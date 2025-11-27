import { Router } from 'express';
import { InventoryController } from '@controllers/inventory.controller.js';
import { auth } from '@middleware/auth.js';
import { validate } from '@middleware/validate.js';
import { inventoryMovementSchema } from '@validations/inventory.schema.js';

const router = Router();
const inventoryController = new InventoryController();

router.get('/', auth, inventoryController.getInventory);
router.get('/movements', auth, inventoryController.getMovements);
router.post('/movements', auth, validate(inventoryMovementSchema), inventoryController.createMovement);
router.get('/stats', auth, inventoryController.getStats);

export default router;
