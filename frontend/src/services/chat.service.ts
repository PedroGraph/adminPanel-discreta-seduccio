export interface Message {
    id: string;
    sender_type: 'customer' | 'admin';
    sender_name: string;
    message: string;
    sent_at: string;
}

export interface Conversation {
    id: string;
    customer_name: string;
    customer_email?: string;
    status: string;
    started_at: string;
    ended_at?: string;
    assigned_user?: {
        name: string;
    };
    messages: Message[];
}

const API_URL = 'http://localhost:3000/api/chat';

export const chatService = {
    getConversations: async (): Promise<{ status: boolean; data: Conversation[] }> => {
        const response = await fetch(`${API_URL}/conversations`);
        if (!response.ok) {
            throw new Error('Failed to fetch conversations');
        }
        return response.json();
    },

    getConversationDetails: async (id: string): Promise<{ success: boolean; data: Conversation }> => {
        const response = await fetch(`${API_URL}/conversations/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch conversation details');
        }
        return response.json();
    }
};
