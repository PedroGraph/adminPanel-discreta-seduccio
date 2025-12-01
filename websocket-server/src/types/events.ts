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
    id?: string; // conversation_id for customers, user_id for admins
    name?: string;
}
