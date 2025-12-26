import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

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

    async reactivateConversation(conversationId: string, adminId: number) {
        return await prisma.chatConversation.update({
            where: { id: conversationId },
            data: {
                status: 'active',
                assigned_to: adminId,
                ended_at: null,
            },
        });
    }

    async getConversationHistory(conversationId: string) {
        return await prisma.chatMessage.findMany({
            where: { conversation_id: conversationId },
            orderBy: { sent_at: 'asc' },
        });
    }

    async getAllConversations() {
        return await prisma.chatConversation.findMany({
            orderBy: { started_at: 'desc' },
            include: {
                messages: {
                    take: 1,
                    orderBy: { sent_at: 'desc' }
                }
            }
        });
    }

    async getActiveConversationsByAdmin(adminId: number) {
        return await prisma.chatConversation.findMany({
            where: {
                assigned_to: adminId,
                status: 'active',
            },
            include: {
                messages: {
                    orderBy: { sent_at: 'asc' }
                }
            }
        });
    }

    async getConversationById(conversationId: string) {
        return await prisma.chatConversation.findUnique({
            where: { id: conversationId },
            include: {
                messages: {
                    orderBy: { sent_at: 'asc' }
                }
            }
        });
    }
}

export const dbService = new DatabaseService();
