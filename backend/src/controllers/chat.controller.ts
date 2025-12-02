import { Request, Response, NextFunction } from 'express';
import { ChatService } from '../services/chat.service.js';
import { sendSuccess } from '../utils/response.utils.js';
import { AppError } from '../utils/AppError.js';
import logger from '../utils/logger.js';

const chatService = new ChatService();

export class ChatController {
    async getAllConversations(req: Request, res: Response, next: NextFunction) {
        try {
            const { status, customerName } = req.query;
            const conversations = await chatService.getAllConversations({
                status: status as string,
                customerName: customerName as string,
            });
            sendSuccess(res, conversations);
        } catch (error) {
            logger.error('Error getting conversations:', error);
            next(error);
        }
    }

    async getConversationById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const conversation = await chatService.getConversationById(id);

            if (!conversation) {
                throw new AppError('Conversación no encontrada', 404);
            }

            sendSuccess(res, conversation);
        } catch (error) {
            logger.error('Error getting conversation:', error);
            next(error);
        }
    }
}
