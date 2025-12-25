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
                        await handleAdminClaimChat(ws, message.payload, customerClients, adminClients);
                    } else {
                        await handleAdminReactivateChat(ws, message.payload, customerClients, adminClients);
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
                        adminClients
                    );
                    break;

                case 'chat:end':
                    await handleEndChat(ws, message.payload, customerClients, adminClients);
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
