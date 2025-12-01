import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DatabaseService {
    async createConversation(customerName: string, customerEmail?: string) {
        return await prisma.chatConversation.create({
            data: {
                customer_name: customerName,
                customer_email: customerEmail,
                status: 'waiting',
            },
        });
    }

    async claimConversation(conversationId: string, adminId: number) {
        // Check if conversation is still available
        const conversation = await prisma.chatConversation.findUnique({
            where: { id: conversationId },
        });

        if (!conversation || conversation.status !== 'waiting') {
            throw new Error('Conversation not available');
        }

        return await prisma.chatConversation.update({
            where: { id: conversationId },
            data: {
                status: 'active',
                assigned_to: adminId,
            },
        });
    }

    async saveMessage(
        conversationId: string,
        senderType: 'customer' | 'admin',
        senderName: string,
        message: string
    ) {
        return await prisma.chatMessage.create({
            data: {
                conversation_id: conversationId,
                sender_type: senderType,
                sender_name: senderName,
                message,
            },
        });
    }

    async endConversation(conversationId: string) {
        return await prisma.chatConversation.update({
            where: { id: conversationId },
            data: {
                status: 'ended',
                ended_at: new Date(),
            },
        });
    }

    async getConversationHistory(conversationId: string) {
        return await prisma.chatMessage.findMany({
            where: { conversation_id: conversationId },
            orderBy: { sent_at: 'asc' },
        });
    }
}

export const dbService = new DatabaseService();
