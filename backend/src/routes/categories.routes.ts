import { Router } from 'express';
import { CategoryController } from '@controllers/categories.controller.js';
import { auth } from '@middleware/auth.js';

const router = Router();
const categoryController = new CategoryController();

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', auth, categoryController.createCategory);
router.put('/:id', auth, categoryController.updateCategory);
router.delete('/:id', auth, categoryController.deleteCategory);

export default router;
