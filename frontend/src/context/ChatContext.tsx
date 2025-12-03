import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useToast } from '@/hooks/use-toast';

interface WaitingChat {
    conversation_id: string;
    customer_name: string;
    customer_email?: string;
    started_at: string;
}

interface Message {
    sender_type: 'customer' | 'admin';
    sender_name: string;
    message: string;
    sent_at: string;
}

interface ActiveConversation {
    conversation_id: string;
    customer_name: string;
    messages: Message[];
}

interface ChatContextType {
    waitingChats: WaitingChat[];
    activeConversations: ActiveConversation[];
    selectedConversationId: string | null;
    isConnected: boolean;
    isChatOpen: boolean;
    isTyping: boolean;
    toggleChatWindow: () => void;
    claimChat: (conversationId: string) => void;
    selectChat: (conversationId: string | null) => void;
    sendMessage: (message: string) => void;
    endChat: (conversationId: string) => void;
    sendTyping: (isTyping: boolean) => void;
    reactivateChat: (conversationId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const { toast } = useToast();
    const [waitingChats, setWaitingChats] = useState<WaitingChat[]>([]);
    const [activeConversations, setActiveConversations] = useState<ActiveConversation[]>([]);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [adminName] = useState("Admin"); // TODO: Get from auth context
    const [adminId] = useState(1); // TODO: Get from auth context
    const [isTyping, setIsTyping] = useState(false);

    const { isConnected, sendMessage: wsSendMessage, subscribe } = useWebSocket({
        clientType: 'admin',
        authData: {
            user_id: adminId,
            name: adminName,
        },
    });

    useEffect(() => {
        // Subscribe to new chat notifications
        const unsubscribeNewChat = subscribe('admin:new-chat', (data: WaitingChat) => {
            setWaitingChats((prev) => {
                // Avoid duplicates
                if (prev.some(chat => chat.conversation_id === data.conversation_id)) return prev;
                return [...prev, data];
            });
        });

        // Subscribe to chat claimed events
        const unsubscribeClaimed = subscribe('chat:claimed', (data: any) => {
            if (data.conversation_id) {
                setWaitingChats((prev) =>
                    prev.filter((chat) => chat.conversation_id !== data.conversation_id)
                );

                // If we have history and this is one of our active conversations (or we just claimed it)
                if (data.history) {
                    setActiveConversations((prev) => {
                        const exists = prev.find(c => c.conversation_id === data.conversation_id);
                        if (exists) {
                            return prev.map(c => c.conversation_id === data.conversation_id ? { ...c, messages: data.history } : c);
                        }
                        return prev;
                    });
                }
            }
        });

        // Subscribe to chat no longer available
        const unsubscribeNoLonger = subscribe('chat:no-longer-available', (data: any) => {
            setWaitingChats((prev) =>
                prev.filter((chat) => chat.conversation_id !== data.conversation_id)
            );
        });

        // Subscribe to messages
        const unsubscribeMessage = subscribe('chat:message', (data: Message & { conversation_id: string }) => {
            setActiveConversations((prev) =>
                prev.map(chat => {
                    if (chat.conversation_id === data.conversation_id) {
                        return {
                            ...chat,
                            messages: [...chat.messages, data]
                        };
                    }
                    return chat;
                })
            );

            // If chat is closed or not selected, show notification
            if (!isChatOpen || selectedConversationId !== data.conversation_id) {
                toast({
                    title: `Mensaje de ${data.sender_name}`,
                    description: data.message,
                });
            }
        });

        // Subscribe to chat ended
        const unsubscribeEnded = subscribe('chat:ended', (data: any) => {
            setActiveConversations((prev) => prev.filter(c => c.conversation_id !== data.conversation_id));

            if (selectedConversationId === data.conversation_id) {
                setSelectedConversationId(null);
                toast({
                    title: "Chat finalizado",
                    description: data.message,
                });
                setIsTyping(false);
            }
        });

        // Subscribe to typing events
        const unsubscribeTyping = subscribe('chat:typing', (data: any) => {
            if (selectedConversationId === data.conversation_id && data.sender_type === 'customer') {
                setIsTyping(data.is_typing);
            }
        });

        return () => {
            unsubscribeNewChat();
            unsubscribeClaimed();
            unsubscribeNoLonger();
            unsubscribeMessage();
            unsubscribeEnded();
            unsubscribeTyping();
        };
    }, [subscribe, selectedConversationId, isChatOpen, toast]);

    const claimChat = useCallback((conversationId: string) => {
        const chat = waitingChats.find((c) => c.conversation_id === conversationId);

        if (chat) {
            wsSendMessage('admin:claim-chat', {
                conversation_id: conversationId,
                admin_id: adminId,
                admin_name: adminName,
            });

            const newConversation: ActiveConversation = {
                conversation_id: conversationId,
                customer_name: chat.customer_name,
                messages: [],
            };

            setActiveConversations(prev => [...prev, newConversation]);
            setSelectedConversationId(conversationId);
            setIsChatOpen(true);
        }
    }, [waitingChats, wsSendMessage, adminId, adminName]);

    const selectChat = useCallback((conversationId: string | null) => {
        setSelectedConversationId(conversationId);
    }, []);

    const sendMessage = useCallback((message: string) => {
        if (!selectedConversationId) return;

        const conversation = activeConversations.find(c => c.conversation_id === selectedConversationId);
        if (!conversation) return;

        wsSendMessage('chat:send-message', {
            conversation_id: selectedConversationId,
            sender_type: 'admin',
            sender_name: adminName,
            message,
        });
    }, [selectedConversationId, activeConversations, wsSendMessage, adminName]);

    const endChat = useCallback((conversationId: string) => {
        wsSendMessage('chat:end', {
            conversation_id: conversationId,
        });
    }, [wsSendMessage]);

    const sendTyping = useCallback((isTyping: boolean) => {
        if (!selectedConversationId) return;

        wsSendMessage('chat:typing', {
            conversation_id: selectedConversationId,
            sender_type: 'admin',
            is_typing: isTyping,
        });
    }, [selectedConversationId, wsSendMessage]);

    const reactivateChat = useCallback((conversationId: string) => {
        wsSendMessage('admin:reactivate-chat', {
            conversation_id: conversationId,
            admin_id: adminId,
            admin_name: adminName,
        });

        // We optimistically set it as selected, but the actual addition to activeConversations 
        // happens when we receive the 'chat:claimed' event (which we reuse for reactivation)
        setSelectedConversationId(conversationId);
        setIsChatOpen(true);
    }, [wsSendMessage, adminId, adminName]);

    const toggleChatWindow = useCallback(() => {
        setIsChatOpen(prev => !prev);
    }, []);

    return (
        <ChatContext.Provider value={{
            waitingChats,
            activeConversations,
            selectedConversationId,
            isConnected,
            isChatOpen,
            isTyping,
            toggleChatWindow,
            claimChat,
            selectChat,
            sendMessage,
            endChat,
            sendTyping,
            reactivateChat
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChatContext must be used within a ChatProvider');
    }
    return context;
};
