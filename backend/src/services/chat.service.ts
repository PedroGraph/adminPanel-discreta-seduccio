import prisma from '@/lib/prisma.js';


export class ChatService {
    async getAllConversations(filters?: { status?: string; customerName?: string }) {
        const where: any = {};

        if (filters?.status) {
            where.status = filters.status;
        }

        if (filters?.customerName) {
            where.customer_name = {
                contains: filters.customerName,
            };
        }

        return await prisma.chatConversation.findMany({
            where,
            orderBy: {
                started_at: 'desc',
            },
            include: {
                messages: {
                    orderBy: {
                        sent_at: 'desc',
                    },
                    take: 1, // Get last message for preview
                },
                assigned_user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async getConversationById(id: string) {
        return await prisma.chatConversation.findUnique({
            where: { id },
            include: {
                messages: {
                    orderBy: {
                        sent_at: 'asc',
                    },
                },
                assigned_user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }
}
