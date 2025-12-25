import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import * as dotenv from 'dotenv';
import {
    handleCustomerStartChat,
    handleAdminClaimChat,
    handleSendMessage,
    handleEndChat,
    handleTyping,
    handleRead,
    handleAdminReactivateChat,
} from './handlers/chat.handler';
import { dbService } from './services/database.service';
import { InactivityService } from './services/inactivity.service';
import type { WebSocketMessage, ClientInfo } from './types/events';

dotenv.config();

const PORT = parseInt(process.env.PORT || '3000');

// Maps to track connected clients
const customerClients = new Map<WebSocket, ClientInfo>();
const adminClients = new Map<WebSocket, ClientInfo>();

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/chat/conversations', async (req, res) => {
    try {
        const conversations = await dbService.getAllConversations();
        res.json({ status: true, data: conversations });
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
});

app.get('/api/chat/conversations/:id', async (req, res) => {
    try {
        const conversation = await dbService.getConversationById(req.params.id);
        if (conversation) {
            res.json({ success: true, data: conversation });
        } else {
            res.status(404).json({ success: false, message: 'Conversation not found' });
        }
    } catch (error) {
        console.error('Error fetching conversation details:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

const server = createServer(app);
const wss = new WebSocketServer({ server });

server.listen(PORT, () => {
    console.log(`WebSocket server started on port ${PORT}`);
});

// Initialize inactivity service
const inactivityService = new InactivityService(
    (conversationId: string, message: string) => {
        // Warn Admin
        const warning = JSON.stringify({
            type: 'chat:message', // We send it as a message so it's visible
            payload: {
                conversation_id: conversationId,
                sender_type: 'admin',
                sender_name: 'Sistema',
                message: message,
                sent_at: new Date().toISOString(),
            },
        });
        Array.from(adminClients.entries()).forEach(([ws, info]) => {
            if (info.conversationIds?.includes(conversationId) && ws.readyState === WebSocket.OPEN) {
                ws.send(warning);
            }
        });
    },
    (conversationId: string, message: string) => {
        // Warn Customer
        const warning = JSON.stringify({
            type: 'chat:message',
            payload: {
                conversation_id: conversationId,
                sender_type: 'admin',
                sender_name: 'Sistema',
                message: message,
                sent_at: new Date().toISOString(),
            },
        });
        Array.from(customerClients.entries()).forEach(([ws, info]) => {
            if (info.conversationId === conversationId && ws.readyState === WebSocket.OPEN) {
                ws.send(warning);
            }
        });
    },
    async (conversationId: string, reason: string) => {
        // End Chat
        try {
            await dbService.endConversation(conversationId);
            const endMsg = JSON.stringify({
                type: 'chat:ended',
                payload: {
                    conversation_id: conversationId,
                    message: reason,
                },
            });

            // Notify everyone
            Array.from(customerClients.entries()).forEach(([ws, info]) => {
                if (info.conversationId === conversationId && ws.readyState === WebSocket.OPEN) {
                    ws.send(endMsg);
                }
            });
            Array.from(adminClients.entries()).forEach(([ws, info]) => {
                if (info.conversationIds?.includes(conversationId) && ws.readyState === WebSocket.OPEN) {
                    ws.send(endMsg);
                    // Update client info
                    if (info.conversationIds) {
                        info.conversationIds = info.conversationIds.filter(id => id !== conversationId);
                    }
                }
            });
        } catch (error) {
            console.error('Error in auto-end chat:', error);
        }
    }
);
inactivityService.start();

wss.on('connection', (ws: WebSocket) => {
    console.log('New client connected');

    ws.on('message', async (data: Buffer) => {
        try {
            const message: WebSocketMessage = JSON.parse(data.toString());
            console.log('Received message:', message.type);

            switch (message.type) {
                case 'auth:customer':
                    // Customer authentication
                    customerClients.set(ws, {
                        type: 'customer',
                        conversationId: message.payload?.conversation_id,
                        name: message.payload?.name,
                    });
                    ws.send(
                        JSON.stringify({
                            type: 'auth:success',
                            payload: { client_type: 'customer' },
                        })
                    );
                    break;

                case 'auth:admin':
                    // Admin authentication
                    adminClients.set(ws, {
                        type: 'admin',
                        userId: message.payload?.user_id,
                        name: message.payload?.name,
                        conversationIds: [], // Start with empty list
                    });
                    ws.send(
                        JSON.stringify({
                            type: 'auth:success',
                            payload: { client_type: 'admin' },
                        })
                    );
                    break;

                case 'customer:start-chat':
                    const conversationId = await handleCustomerStartChat(ws, message.payload, adminClients);
                    // Register customer with conversation_id
                    customerClients.set(ws, {
                        type: 'customer',
                        conversationId: conversationId,
                        name: message.payload?.customer_name,
                    });
                    break;

                case 'admin:claim-chat':
                case 'admin:reactivate-chat':
                    if (message.type === 'admin:claim-chat') {
                        await handleAdminClaimChat(ws, message.payload, customerClients, adminClients, inactivityService);
                    } else {
                        await handleAdminReactivateChat(ws, message.payload, customerClients, adminClients, inactivityService);
                    }
                    
                    // Update admin client info with new conversation_id in the list
                    const adminInfo = adminClients.get(ws);
                    if (adminInfo) {
                        const currentIds = adminInfo.conversationIds || [];
                        if (!currentIds.includes(message.payload?.conversation_id)) {
                            adminClients.set(ws, {
                                ...adminInfo,
                                conversationIds: [...currentIds, message.payload?.conversation_id],
                            });
                        }
                    }
                    break;

                case 'chat:send-message':
                    await handleSendMessage(
                        ws,
                        message.payload,
                        customerClients,
                        adminClients,
                        inactivityService
                    );
                    break;

                case 'chat:end':
                    await handleEndChat(ws, message.payload, customerClients, adminClients, inactivityService);
                    break;

                case 'chat:typing':
                    await handleTyping(ws, message.payload, customerClients, adminClients);
                    break;

                case 'chat:read':
                    await handleRead(ws, message.payload, customerClients, adminClients);
                    break;

                default:
                    console.log('Unknown message type:', message.type);
                    ws.send(
                        JSON.stringify({
                            type: 'error',
                            payload: { message: 'Unknown message type' },
                        })
                    );
            }
        } catch (error) {
            console.error('Error processing message:', error);
            ws.send(
                JSON.stringify({
                    type: 'error',
                    payload: { message: 'Error processing message' },
                })
            );
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        customerClients.delete(ws);
        adminClients.delete(ws);
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        customerClients.delete(ws);
        adminClients.delete(ws);
    });
});

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing WebSocket server');
    wss.close(() => {
        console.log('WebSocket server closed');
        process.exit(0);
    });
});
