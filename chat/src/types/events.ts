export interface WebSocketMessage {
    type: string;
    payload?: any;
}

export interface CustomerStartChatPayload {
    customer_name: string;
    customer_email?: string;
}

export interface AdminClaimChatPayload {
    conversation_id: string;
    admin_id: number;
    admin_name: string;
}

export interface SendMessagePayload {
    conversation_id: string;
    sender_type: 'customer' | 'admin';
    sender_name: string;
    message: string;
}

export interface EndChatPayload {
    conversation_id: string;
}

export interface ClientInfo {
    type: 'customer' | 'admin';
    id?: string; // Generic ID
    userId?: number; // Real user ID for admins
    conversationId?: string; // For customers
    conversationIds?: string[]; // For admins handling multiple chats
    name?: string;
}

export interface TypingPayload {
    conversation_id: string;
    sender_type: 'customer' | 'admin';
    is_typing: boolean;
}

export interface ReadPayload {
    conversation_id: string;
    reader_type: 'customer' | 'admin';
    message_id?: string; // Optional, if we want to mark specific messages
}
