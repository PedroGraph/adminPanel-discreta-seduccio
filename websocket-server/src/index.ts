import { WebSocketServer, WebSocket } from 'ws';
import * as dotenv from 'dotenv';
import {
    handleCustomerStartChat,
    handleAdminClaimChat,
    handleSendMessage,
    handleEndChat,
} from './handlers/chat.handler';
import type { WebSocketMessage, ClientInfo } from './types/events';

dotenv.config();

const PORT = parseInt(process.env.PORT || '8080');

// Maps to track connected clients
const customerClients = new Map<WebSocket, ClientInfo>();
const adminClients = new Map<WebSocket, ClientInfo>();

const wss = new WebSocketServer({ port: PORT });

console.log(`WebSocket server started on port ${PORT}`);

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
                        id: message.payload?.conversation_id,
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
                        id: message.payload?.user_id,
                        name: message.payload?.name,
                    });
                    ws.send(
                        JSON.stringify({
                            type: 'auth:success',
                            payload: { client_type: 'admin' },
                        })
                    );
                    break;

                case 'customer:start-chat':
                    await handleCustomerStartChat(ws, message.payload, adminClients);
                    // Update customer client info with conversation_id
                    const clientInfo = customerClients.get(ws);
                    if (clientInfo) {
                        customerClients.set(ws, {
                            ...clientInfo,
                            id: message.payload?.conversation_id,
                        });
                    }
                    break;

                case 'admin:claim-chat':
                    await handleAdminClaimChat(
                        ws,
                        message.payload,
                        customerClients,
                        adminClients
                    );
                    // Update admin client info with conversation_id
                    const adminInfo = adminClients.get(ws);
                    if (adminInfo) {
                        adminClients.set(ws, {
                            ...adminInfo,
                            id: message.payload?.conversation_id,
                        });
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
