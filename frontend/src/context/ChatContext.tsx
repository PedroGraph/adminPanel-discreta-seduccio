import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function fetchWsToken(): Promise<string | null> {
    try {
        const res = await fetch(`${API_URL}/auth/ws-token`, { credentials: 'include' });
        if (!res.ok) return null;
        const data = await res.json();
        return data.data?.token ?? null;
    } catch {
        return null;
    }
}

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
    openChatIds: string[];
    minimizedChatIds: string[];
    isMainMinimized: boolean;
    isConnected: boolean;
    isChatOpen: boolean;
    isTyping: Record<string, boolean>;
    toggleChatWindow: () => void;
    toggleMainMinimized: (minimized?: boolean) => void;
    claimChat: (conversationId: string) => void;
    selectChat: (conversationId: string | null) => void;
    closeChatWindow: (conversationId: string) => void;
    toggleChatMinimized: (conversationId: string) => void;
    sendMessage: (conversationId: string, message: string) => void;
    endChat: (conversationId: string) => void;
    sendTyping: (conversationId: string, isTyping: boolean) => void;
    reactivateChat: (conversationId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const { toast } = useToast();
    const { user } = useAuth();
    const [waitingChats, setWaitingChats] = useState<WaitingChat[]>([]);
    const [activeConversations, setActiveConversations] = useState<ActiveConversation[]>([]);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [openChatIds, setOpenChatIds] = useState<string[]>([]);
    const [minimizedChatIds, setMinimizedChatIds] = useState<string[]>([]);
    const [isMainMinimized, setIsMainMinimized] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isTyping, setIsTyping] = useState<Record<string, boolean>>({});

    const adminId = user?.id ?? 0;
    const adminName = user?.name ?? '';
    const [wsToken, setWsToken] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            setWsToken(null);
            return;
        }
        fetchWsToken().then(setWsToken);
    }, [user]);

    const { isConnected, sendMessage: wsSendMessage, subscribe } = useWebSocket({
        clientType: 'admin',
        authData: {
            user_id: adminId,
            name: adminName,
            token: wsToken,
        },
        autoConnect: !!user && !!wsToken,
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

            // Notify if window not open
            if (!openChatIds.includes(data.conversation_id)) {
                toast({
                    title: `Mensaje de ${data.sender_name}`,
                    description: data.message,
                });
            }
        });

        // Subscribe to chat ended
        const unsubscribeEnded = subscribe('chat:ended', (data: any) => {
            setActiveConversations((prev) => prev.filter(c => c.conversation_id !== data.conversation_id));
            setOpenChatIds(prev => prev.filter(id => id !== data.conversation_id));

            if (selectedConversationId === data.conversation_id) {
                setSelectedConversationId(null);
            }

            toast({
                title: "Chat finalizado",
                description: data.message,
            });

            setIsTyping(prev => {
                const newState = { ...prev };
                delete newState[data.conversation_id];
                return newState;
            });
        });

        // Subscribe to typing events
        const unsubscribeTyping = subscribe('chat:typing', (data: any) => {
            if (data.sender_type === 'customer') {
                setIsTyping(prev => ({
                    ...prev,
                    [data.conversation_id]: data.is_typing
                }));
            }
        });

        // Subscribe to auth:success to restore active conversations
        const unsubscribeAuth = subscribe('auth:success', (data: any) => {
            if (data.client_type === 'admin' && data.active_conversations) {
                const restoredConversations: ActiveConversation[] = data.active_conversations.map((c: any) => ({
                    conversation_id: c.id,
                    customer_name: c.customer_name,
                    messages: c.messages || [],
                }));

                setActiveConversations(restoredConversations);

                // Keep windows open for restored chats if they were not explicitly closed
                setOpenChatIds(prev => {
                    const existingOpen = prev;
                    const newOpen = restoredConversations.map(c => c.conversation_id);
                    return [...new Set([...existingOpen, ...newOpen])];
                });

                // Also remove these from waiting chats if they happen to be there
                const restoredIds = restoredConversations.map(c => c.conversation_id);
                setWaitingChats(prev => prev.filter(chat => !restoredIds.includes(chat.conversation_id)));

                if (restoredConversations.length > 0) {
                    setSelectedConversationId(prev => prev || restoredConversations[0].conversation_id);
                    toast({
                        title: "Sesión restaurada",
                        description: `Se han recuperado ${restoredConversations.length} chats activos`,
                    });
                }
            }
        });

        return () => {
            unsubscribeAuth();
            unsubscribeNewChat();
            unsubscribeClaimed();
            unsubscribeNoLonger();
            unsubscribeMessage();
            unsubscribeEnded();
            unsubscribeTyping();
        };
    }, [subscribe, selectedConversationId, openChatIds, toast]);

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
            setOpenChatIds(prev => [...new Set([...prev, conversationId])]);
            setMinimizedChatIds(prev => prev.filter(id => id !== conversationId));
            setIsChatOpen(true);
            setIsMainMinimized(false);
        }
    }, [waitingChats, wsSendMessage, adminId, adminName]);

    const selectChat = useCallback((conversationId: string | null) => {
        setSelectedConversationId(conversationId);
        if (conversationId) {
            if (!openChatIds.includes(conversationId)) {
                setOpenChatIds(prev => [...prev, conversationId]);
            }
            setMinimizedChatIds(prev => prev.filter(id => id !== conversationId));
        }
    }, [openChatIds]);

    const closeChatWindow = useCallback((conversationId: string) => {
        setOpenChatIds(prev => prev.filter(id => id !== conversationId));
        setMinimizedChatIds(prev => prev.filter(id => id !== conversationId));
        if (selectedConversationId === conversationId) {
            setSelectedConversationId(null);
        }
    }, [selectedConversationId]);

    const toggleChatMinimized = useCallback((conversationId: string) => {
        setMinimizedChatIds(prev =>
            prev.includes(conversationId)
                ? prev.filter(id => id !== conversationId)
                : [...prev, conversationId]
        );
    }, []);

    const toggleMainMinimized = useCallback((minimized?: boolean) => {
        setIsMainMinimized(prev => minimized !== undefined ? minimized : !prev);
    }, []);

    const sendMessage = useCallback((conversationId: string, message: string) => {
        const conversation = activeConversations.find(c => c.conversation_id === conversationId);
        if (!conversation) return;

        wsSendMessage('chat:send-message', {
            conversation_id: conversationId,
            sender_type: 'admin',
            sender_name: adminName,
            message,
        });
    }, [activeConversations, wsSendMessage, adminName]);

    const endChat = useCallback((conversationId: string) => {
        wsSendMessage('chat:end', {
            conversation_id: conversationId,
        });
    }, [wsSendMessage]);

    const sendTyping = useCallback((conversationId: string, isTyping: boolean) => {
        wsSendMessage('chat:typing', {
            conversation_id: conversationId,
            sender_type: 'admin',
            is_typing: isTyping,
        });
    }, [wsSendMessage]);

    const reactivateChat = useCallback((conversationId: string) => {
        wsSendMessage('admin:reactivate-chat', {
            conversation_id: conversationId,
            admin_id: adminId,
            admin_name: adminName,
        });

        setSelectedConversationId(conversationId);
        setOpenChatIds(prev => [...new Set([...prev, conversationId])]);
        setMinimizedChatIds(prev => prev.filter(id => id !== conversationId));
        setIsChatOpen(true);
        setIsMainMinimized(false);
    }, [wsSendMessage, adminId, adminName]);

    const toggleChatWindow = useCallback(() => {
        setIsChatOpen(prev => !prev);
        if (!isChatOpen) {
            setIsMainMinimized(false);
        }
    }, [isChatOpen]);

    return (
        <ChatContext.Provider value={{
            waitingChats,
            activeConversations,
            selectedConversationId,
            openChatIds,
            minimizedChatIds,
            isMainMinimized,
            isConnected,
            isChatOpen,
            isTyping,
            toggleChatWindow,
            toggleMainMinimized,
            claimChat,
            selectChat,
            closeChatWindow,
            toggleChatMinimized,
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
