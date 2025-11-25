import { Router } from 'express';
import { UploadController } from '@controllers/upload.controller.js';
import { upload } from '@middleware/upload.middleware.js';
import { auth } from '@middleware/auth.js';

const router = Router();
const uploadController = new UploadController();

// Upload single image
router.post('/single', auth, upload.single('image'), uploadController.uploadSingle);

// Upload multiple images (max 10)
router.post('/multiple', auth, upload.array('images', 10), uploadController.uploadMultiple);

// Delete image
router.delete('/delete', auth, uploadController.deleteImage);

export default router;
