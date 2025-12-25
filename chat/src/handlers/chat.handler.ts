import { WebSocket } from 'ws';
import { dbService } from '../services/database.service';
import { InactivityService } from '../services/inactivity.service';
import type {
    WebSocketMessage,
    CustomerStartChatPayload,
    AdminClaimChatPayload,
    SendMessagePayload,
    EndChatPayload,
    ClientInfo,
} from '../types/events';

export async function handleCustomerStartChat(
    ws: WebSocket,
    payload: CustomerStartChatPayload,
    adminClients: Map<WebSocket, ClientInfo>
): Promise<string> {
    try {
        // Create conversation in database
        const conversation = await dbService.createConversation(
            payload.customer_name,
            payload.customer_email
        );

        // Send confirmation to customer
        ws.send(
            JSON.stringify({
                type: 'customer:chat-started',
                payload: {
                    conversation_id: conversation.id,
                    message: 'Buscando un agente disponible...',
                },
            })
        );

        // Notify all admins about new chat
        const notifyMsg = JSON.stringify({
            type: 'admin:new-chat',
            payload: {
                conversation_id: conversation.id,
                customer_name: payload.customer_name,
                customer_email: payload.customer_email,
                created_at: conversation.started_at.toISOString(),
            },
        });

        Array.from(adminClients.entries()).forEach(([adminWs, clientInfo]) => {
            if (adminWs.readyState === WebSocket.OPEN) {
                adminWs.send(notifyMsg);
            }
        });

        return conversation.id;
    } catch (error) {
        console.error('Error starting chat:', error);
        ws.send(
            JSON.stringify({
                type: 'error',
                payload: { message: 'Error al iniciar el chat' },
            })
        );
        throw error;
    }
}

export async function handleAdminClaimChat(
    ws: WebSocket,
    payload: AdminClaimChatPayload,
    customerClients: Map<WebSocket, ClientInfo>,
    adminClients: Map<WebSocket, ClientInfo>,
    inactivityService: InactivityService
) {
    try {
        // Claim conversation in database
        await dbService.claimConversation(payload.conversation_id, payload.admin_id);

        const welcomeText = `Hola, soy ${payload.admin_name}. ¿En qué puedo ayudarte hoy?`;
        await dbService.saveMessage(
            payload.conversation_id,
            'admin',
            payload.admin_name,
            welcomeText
        );

        // Find customer websocket
        let customerWs: WebSocket | undefined = undefined;
        let customerName = 'Cliente';
        for (const [client, clientInfo] of customerClients.entries()) {
            if (clientInfo.conversationId === payload.conversation_id) {
                customerWs = client;
                customerName = clientInfo.name || 'Cliente';
                break;
            }
        }

        // Notify customer and send the automatic message
        if (customerWs && customerWs.readyState === WebSocket.OPEN) {
            // First notify about the claim
            customerWs.send(
                JSON.stringify({
                    type: 'chat:claimed',
                    payload: {
                        conversation_id: payload.conversation_id,
                        admin_name: payload.admin_name,
                        message: `${payload.admin_name} se ha unido al chat`,
                    },
                })
            );

            // Then send the actual message
            customerWs.send(
                JSON.stringify({
                    type: 'chat:message',
                    payload: {
                        conversation_id: payload.conversation_id,
                        sender_type: 'admin',
                        sender_name: payload.admin_name,
                        message: welcomeText,
                        sent_at: new Date().toISOString(),
                    },
                })
            );
        }

        // Register in inactivity tracker
        inactivityService.updateActivity(payload.conversation_id, 'admin', customerName, payload.admin_name);

        // Get conversation history
        const history = await dbService.getConversationHistory(payload.conversation_id);

        // Confirm to admin with history
        ws.send(
            JSON.stringify({
                type: 'chat:claimed',
                payload: {
                    conversation_id: payload.conversation_id,
                    message: 'Chat reclamado exitosamente',
                    history: history.map((msg: any) => ({
                        sender_type: msg.sender_type,
                        sender_name: msg.sender_name,
                        message: msg.message,
                        sent_at: msg.sent_at.toISOString(),
                    })),
                },
            })
        );

        // Notify other admins that this chat was claimed
        Array.from(adminClients.entries()).forEach(([adminWs, clientInfo]) => {
            if (adminWs !== ws && adminWs.readyState === WebSocket.OPEN) {
                adminWs.send(
                    JSON.stringify({
                        type: 'admin:chat-claimed',
                        payload: {
                            conversation_id: payload.conversation_id,
                            admin_name: payload.admin_name,
                        },
                    })
                );
            }
        });
    } catch (error) {
        console.error('Error claiming chat:', error);
        ws.send(
            JSON.stringify({
                type: 'error',
                payload: { message: 'Chat no disponible o ya reclamado' },
            })
        );
    }
}

export async function handleAdminReactivateChat(
    ws: WebSocket,
    payload: AdminClaimChatPayload,
    customerClients: Map<WebSocket, ClientInfo>,
    adminClients: Map<WebSocket, ClientInfo>,
    inactivityService: InactivityService
) {
    try {
        // Reactivate conversation in database
        await dbService.reactivateConversation(payload.conversation_id, payload.admin_id);

        // Send automatic welcome back message
        const welcomeText = `Hola de nuevo, soy ${payload.admin_name}. ¿En qué más puedo ayudarte?`;
        await dbService.saveMessage(
            payload.conversation_id,
            'admin',
            payload.admin_name,
            welcomeText
        );

        // Find customer websocket
        let customerWs: WebSocket | undefined = undefined;
        let customerName = 'Cliente';
        for (const [client, clientInfo] of customerClients.entries()) {
            if (clientInfo.conversationId === payload.conversation_id) {
                customerWs = client;
                customerName = clientInfo.name || 'Cliente';
                break;
            }
        }

        // Notify customer if connected
        if (customerWs && customerWs.readyState === WebSocket.OPEN) {
            customerWs.send(
                JSON.stringify({
                    type: 'chat:reactivated',
                    payload: {
                        conversation_id: payload.conversation_id,
                        admin_name: payload.admin_name,
                        message: `${payload.admin_name} ha reanudado el chat`,
                    },
                })
            );

            // Send actual welcome back message
            customerWs.send(
                JSON.stringify({
                    type: 'chat:message',
                    payload: {
                        conversation_id: payload.conversation_id,
                        sender_type: 'admin',
                        sender_name: payload.admin_name,
                        message: welcomeText,
                        sent_at: new Date().toISOString(),
                    },
                })
            );
        }

        // Register in inactivity tracker
        inactivityService.updateActivity(payload.conversation_id, 'admin', customerName, payload.admin_name);

        // Get conversation history
        const history = await dbService.getConversationHistory(payload.conversation_id);

        // Confirm to admin with history
        ws.send(
            JSON.stringify({
                type: 'chat:claimed', // Reuse claimed type to add to active chats
                payload: {
                    conversation_id: payload.conversation_id,
                    message: 'Chat reanudado exitosamente',
                    history: history.map((msg: any) => ({
                        sender_type: msg.sender_type,
                        sender_name: msg.sender_name,
                        message: msg.message,
                        sent_at: msg.sent_at.toISOString(),
                    })),
                },
            })
        );

        // Notify other admins
        Array.from(adminClients.entries()).forEach(([adminWs, clientInfo]) => {
            if (adminWs !== ws && adminWs.readyState === WebSocket.OPEN) {
                adminWs.send(
                    JSON.stringify({
                        type: 'admin:chat-claimed', // Reuse claimed type to remove from waiting/others
                        payload: {
                            conversation_id: payload.conversation_id,
                            admin_name: payload.admin_name,
                        },
                    })
                );
            }
        });
    } catch (error) {
        console.error('Error reactivating chat:', error);
        ws.send(
            JSON.stringify({
                type: 'error',
                payload: { message: 'Error al reanudar el chat' },
            })
        );
    }
}

export async function handleSendMessage(
    ws: WebSocket,
    payload: SendMessagePayload,
    customerClients: Map<WebSocket, ClientInfo>,
    adminClients: Map<WebSocket, ClientInfo>,
    inactivityService: InactivityService
) {
    try {
        // Save message to database
        await dbService.saveMessage(
            payload.conversation_id,
            payload.sender_type,
            payload.sender_name,
            payload.message
        );

        const messageData = {
            type: 'chat:message',
            payload: {
                conversation_id: payload.conversation_id,
                sender_type: payload.sender_type,
                sender_name: payload.sender_name,
                message: payload.message,
                sent_at: new Date().toISOString(),
            },
        };

        let customerName = 'Cliente';
        let adminName = 'Admin';

        // Update inactivity tracker
        // Need to find names if not in payload
        if (payload.sender_type === 'customer') {
            customerName = payload.sender_name;
            // Find admin name if possible
            for (const [_, info] of adminClients.entries()) {
                if (info.conversationIds?.includes(payload.conversation_id)) {
                    adminName = info.name || 'Admin';
                    break;
                }
            }
        } else {
            adminName = payload.sender_name;
            // Find customer name
            for (const [_, info] of customerClients.entries()) {
                if (info.conversationId === payload.conversation_id) {
                    customerName = info.name || 'Cliente';
                    break;
                }
            }
        }
        
        inactivityService.updateActivity(payload.conversation_id, payload.sender_type, customerName, adminName);

        // Forward to the other party
        if (payload.sender_type === 'customer') {
            // Find admin handling this conversation
            Array.from(adminClients.entries()).forEach(([adminWs, clientInfo]) => {
                if (
                    clientInfo.conversationIds?.includes(payload.conversation_id) &&
                    adminWs.readyState === WebSocket.OPEN
                ) {
                    adminWs.send(JSON.stringify(messageData));
                }
            });
        } else {
            // Find customer
            Array.from(customerClients.entries()).forEach(([customerWs, clientInfo]) => {
                if (
                    clientInfo.conversationId === payload.conversation_id &&
                    customerWs.readyState === WebSocket.OPEN
                ) {
                    customerWs.send(JSON.stringify(messageData));
                }
            });
        }

        // Echo back to sender
        ws.send(JSON.stringify(messageData));
    } catch (error) {
        console.error('Error sending message:', error);
        ws.send(
            JSON.stringify({
                type: 'error',
                payload: { message: 'Error al enviar mensaje' },
            })
        );
    }
}

export async function handleEndChat(
    ws: WebSocket,
    payload: EndChatPayload,
    customerClients: Map<WebSocket, ClientInfo>,
    adminClients: Map<WebSocket, ClientInfo>,
    inactivityService: InactivityService
) {
    try {
        // End conversation in database
        await dbService.endConversation(payload.conversation_id);

        const endMessage = {
            type: 'chat:ended',
            payload: {
                conversation_id: payload.conversation_id,
                message: 'El chat ha finalizado',
            },
        };

        // Notify customer
        Array.from(customerClients.entries()).forEach(([customerWs, clientInfo]) => {
            if (
                clientInfo.conversationId === payload.conversation_id &&
                customerWs.readyState === WebSocket.OPEN
            ) {
                customerWs.send(JSON.stringify(endMessage));
            }
        });

        // Notify admin
        Array.from(adminClients.entries()).forEach(([adminWs, clientInfo]) => {
            if (
                clientInfo.conversationIds?.includes(payload.conversation_id) &&
                adminWs.readyState === WebSocket.OPEN
            ) {
                adminWs.send(JSON.stringify(endMessage));
                
                // Remove from active ids
                if (clientInfo.conversationIds) {
                    clientInfo.conversationIds = clientInfo.conversationIds.filter(id => id !== payload.conversation_id);
                }
            }
        });

        // Remove from inactivity tracker
        inactivityService.removeConversation(payload.conversation_id);

    } catch (error) {
        console.error('Error ending chat:', error);
        ws.send(
            JSON.stringify({
                type: 'error',
                payload: { message: 'Error al finalizar el chat' },
            })
        );
    }
}

export async function handleTyping(
    ws: WebSocket,
    payload: any,
    customerClients: Map<WebSocket, ClientInfo>,
    adminClients: Map<WebSocket, ClientInfo>
) {
    const typingData = {
        type: 'chat:typing',
        payload: {
            conversation_id: payload.conversation_id,
            sender_type: payload.sender_type,
            is_typing: payload.is_typing,
        },
    };

    if (payload.sender_type === 'customer') {
        Array.from(adminClients.entries()).forEach(([adminWs, clientInfo]) => {
            if (
                clientInfo.conversationIds?.includes(payload.conversation_id) &&
                adminWs.readyState === WebSocket.OPEN
            ) {
                adminWs.send(JSON.stringify(typingData));
            }
        });
    } else {
        Array.from(customerClients.entries()).forEach(([customerWs, clientInfo]) => {
            if (
                clientInfo.conversationId === payload.conversation_id &&
                customerWs.readyState === WebSocket.OPEN
            ) {
                customerWs.send(JSON.stringify(typingData));
            }
        });
    }
}

export async function handleRead(
    ws: WebSocket,
    payload: any,
    customerClients: Map<WebSocket, ClientInfo>,
    adminClients: Map<WebSocket, ClientInfo>
) {
    const readData = {
        type: 'chat:read',
        payload: {
            conversation_id: payload.conversation_id,
            sender_type: payload.sender_type,
        },
    };

    if (payload.sender_type === 'customer') {
        Array.from(adminClients.entries()).forEach(([adminWs, clientInfo]) => {
            if (
                clientInfo.conversationIds?.includes(payload.conversation_id) &&
                adminWs.readyState === WebSocket.OPEN
            ) {
                adminWs.send(JSON.stringify(readData));
            }
        });
    } else {
        Array.from(customerClients.entries()).forEach(([customerWs, clientInfo]) => {
            if (
                clientInfo.conversationId === payload.conversation_id &&
                customerWs.readyState === WebSocket.OPEN
            ) {
                customerWs.send(JSON.stringify(readData));
            }
        });
    }
}
