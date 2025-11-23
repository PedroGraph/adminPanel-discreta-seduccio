
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

export interface ChatMessage {
  id: string;
  sender: 'agent' | 'customer';
  message: string;
  timestamp: Date;
  isNew?: boolean;
}

export interface VirtualChat {
  id: string;
  customerId: string;
  customerName: string;
  isActive: boolean;
  isMinimized: boolean;
  messages: ChatMessage[];
  lastActivity: Date;
  unreadCount: number;
}

export interface ChatNotification {
  id: string;
  chatId: string;
  customerName: string;
  message: string;
  timestamp: Date;
}

let globalNotificationCallback: ((notification: ChatNotification) => void) | null = null;

export const useVirtualChat = () => {
  const [activeChats, setActiveChats] = useState<VirtualChat[]>([]);
  const [maxChats] = useState(3);
  const { toast } = useToast();
  const notificationCallbackRef = useRef<((notification: ChatNotification) => void) | null>(null);

  useEffect(() => {
    globalNotificationCallback = notificationCallbackRef.current;
  }, []);

  const setNotificationCallback = (callback: (notification: ChatNotification) => void) => {
    notificationCallbackRef.current = callback;
    globalNotificationCallback = callback;
  };

  const startChat = (customerId: string, customerName: string) => {
    if (activeChats.length >= maxChats) {
      toast({
        title: "Límite de chats alcanzado",
        description: `Solo puedes tener ${maxChats} chats activos al mismo tiempo`,
        variant: "destructive",
      });
      return null;
    }

    const existingChat = activeChats.find(chat => chat.customerId === customerId);
    if (existingChat) {
      toast({
        title: "Chat ya existe",
        description: `Ya tienes un chat activo con ${customerName}`,
        variant: "destructive",
      });
      return existingChat;
    }

    const newChat: VirtualChat = {
      id: `chat_${Date.now()}`,
      customerId,
      customerName,
      isActive: true,
      isMinimized: false,
      messages: [{
        id: `msg_${Date.now()}`,
        sender: 'customer',
        message: `¡Hola! Soy ${customerName}, necesito ayuda con mi consulta.`,
        timestamp: new Date(),
        isNew: true
      }],
      lastActivity: new Date(),
      unreadCount: 1
    };

    setActiveChats(prev => [...prev, newChat]);
    
    toast({
      title: "Chat iniciado",
      description: `Chat con ${customerName} iniciado correctamente`,
    });

    // Crear notificación para el nuevo chat
    const notification: ChatNotification = {
      id: `notif_${Date.now()}`,
      chatId: newChat.id,
      customerName,
      message: newChat.messages[0].message,
      timestamp: new Date()
    };

    if (globalNotificationCallback) {
      globalNotificationCallback(notification);
    }

    return newChat;
  };

  const closeChat = (chatId: string) => {
    setActiveChats(prev => prev.filter(chat => chat.id !== chatId));
    
    toast({
      title: "Chat cerrado",
      description: "El chat ha sido cerrado correctamente",
    });
  };

  const endChat = (chatId: string) => {
    const chat = activeChats.find(c => c.id === chatId);
    if (chat) {
      // Enviar mensaje de despedida automático
      const endMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        sender: 'agent',
        message: 'Gracias por contactarnos. La conversación ha sido finalizada. ¡Que tengas un buen día!',
        timestamp: new Date()
      };

      setActiveChats(prev => prev.map(c => 
        c.id === chatId 
          ? {
              ...c,
              messages: [...c.messages, endMessage],
              lastActivity: new Date()
            }
          : c
      ));

      // Cerrar el chat después de un breve delay
      setTimeout(() => {
        closeChat(chatId);
      }, 2000);

      toast({
        title: "Conversación finalizada",
        description: `La conversación con ${chat.customerName} ha sido finalizada`,
      });
    }
  };

  const minimizeChat = (chatId: string) => {
    setActiveChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, isMinimized: true }
        : chat
    ));
  };

  const maximizeChat = (chatId: string) => {
    setActiveChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, isMinimized: false }
        : chat
    ));
  };

  const sendMessage = (chatId: string, message: string) => {
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'agent',
      message,
      timestamp: new Date()
    };

    setActiveChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastActivity: new Date()
          }
        : chat
    ));

    // Simular respuesta del cliente después de un tiempo
    setTimeout(() => {
      const responses = [
        "Muchas gracias por la ayuda",
        "Entiendo, ¿podrías explicarme más?",
        "Perfecto, eso resuelve mi duda",
        "¿Hay alguna alternativa?",
        "¿Cuánto tiempo tomaría eso?"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const customerMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        sender: 'customer',
        message: randomResponse,
        timestamp: new Date(),
        isNew: true
      };

      setActiveChats(prev => prev.map(chat => 
        chat.id === chatId 
          ? {
              ...chat,
              messages: [...chat.messages, customerMessage],
              lastActivity: new Date(),
              unreadCount: chat.unreadCount + 1
            }
          : chat
      ));

      // Crear notificación para el nuevo mensaje
      const targetChat = activeChats.find(chat => chat.id === chatId);
      if (targetChat) {
        const notification: ChatNotification = {
          id: `notif_${Date.now()}`,
          chatId,
          customerName: targetChat.customerName,
          message: randomResponse,
          timestamp: new Date()
        };

        if (globalNotificationCallback) {
          globalNotificationCallback(notification);
        }
      }
    }, 2000 + Math.random() * 3000);
  };

  const markChatAsRead = (chatId: string) => {
    setActiveChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? {
            ...chat,
            unreadCount: 0,
            messages: chat.messages.map(msg => ({ ...msg, isNew: false }))
          }
        : chat
    ));
  };

  const getTotalUnreadCount = () => {
    return activeChats.reduce((total, chat) => total + chat.unreadCount, 0);
  };

  return {
    activeChats,
    maxChats,
    startChat,
    closeChat,
    endChat,
    minimizeChat,
    maximizeChat,
    sendMessage,
    markChatAsRead,
    getTotalUnreadCount,
    setNotificationCallback,
  };
};
