import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller.js';

const router = Router();
const chatController = new ChatController();

router.get('/conversations', chatController.getAllConversations);
router.get('/conversations/:id', chatController.getConversationById);

export default router;
