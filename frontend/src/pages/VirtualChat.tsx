import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Users, Clock } from "lucide-react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { WaitingChats } from "@/components/chat/WaitingChats";
import { ActiveChat } from "@/components/chat/ActiveChat";
import { useToast } from "@/hooks/use-toast";

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

export const VirtualChat = () => {
  const { toast } = useToast();
  const [waitingChats, setWaitingChats] = useState<WaitingChat[]>([]);
  const [activeConversation, setActiveConversation] = useState<ActiveConversation | null>(null);
  const [adminName] = useState("Admin"); // TODO: Get from auth context
  const [adminId] = useState(1); // TODO: Get from auth context

  const { isConnected, sendMessage, subscribe } = useWebSocket({
    clientType: 'admin',
    authData: {
      user_id: adminId,
      name: adminName,
    },
  });

  useEffect(() => {
    // Subscribe to new chat notifications
    const unsubscribeNewChat = subscribe('admin:new-chat', (data: WaitingChat) => {
      setWaitingChats((prev) => [...prev, data]);
      toast({
        title: "Nuevo chat en espera",
        description: `${data.customer_name} está esperando atención`,
      });
    });

    // Subscribe to chat claimed events
    const unsubscribeClaimed = subscribe('chat:claimed', (data: any) => {
      if (data.conversation_id) {
        setWaitingChats((prev) =>
          prev.filter((chat) => chat.conversation_id !== data.conversation_id)
        );

        // If we have history and this is the active conversation (or we just claimed it)
        if (data.history && activeConversation?.conversation_id === data.conversation_id) {
          setActiveConversation((prev) => prev ? {
            ...prev,
            messages: data.history
          } : null);
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
      if (activeConversation?.conversation_id === data.conversation_id) {
        setActiveConversation((prev) =>
          prev
            ? {
              ...prev,
              messages: [...prev.messages, data],
            }
            : null
        );
      }
    });

    // Subscribe to chat ended
    const unsubscribeEnded = subscribe('chat:ended', (data: any) => {
      if (activeConversation?.conversation_id === data.conversation_id) {
        toast({
          title: "Chat finalizado",
          description: data.message,
        });
        setActiveConversation(null);
      }
    });

    return () => {
      unsubscribeNewChat();
      unsubscribeClaimed();
      unsubscribeNoLonger();
      unsubscribeMessage();
      unsubscribeEnded();
    };
  }, [subscribe, activeConversation, toast]);

  const handleClaimChat = (conversationId: string) => {
    const chat = waitingChats.find((c) => c.conversation_id === conversationId);
    if (!chat) return;

    sendMessage('admin:claim-chat', {
      conversation_id: conversationId,
      admin_id: adminId,
      admin_name: adminName,
    });

    setActiveConversation({
      conversation_id: conversationId,
      customer_name: chat.customer_name,
      messages: [],
    });
  };

  const handleSendMessage = (message: string) => {
    if (!activeConversation) return;

    sendMessage('chat:send-message', {
      conversation_id: activeConversation.conversation_id,
      sender_type: 'admin',
      sender_name: adminName,
      message,
    });
  };

  const handleEndChat = () => {
    if (!activeConversation) return;

    sendMessage('chat:end', {
      conversation_id: activeConversation.conversation_id,
    });
  };

  return (
    <div className="p-6 bg-gray-800 min-h-screen">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Chat Virtual</h1>
            <p className="text-gray-400">Gestión de chats en tiempo real con clientes</p>
          </div>
          <Badge className={isConnected ? "bg-green-600" : "bg-red-600"}>
            {isConnected ? "Conectado" : "Desconectado"}
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gray-700 border-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-300">Chats Activos</CardTitle>
            <MessageCircle className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activeConversation ? 1 : 0}</div>
            <p className="text-xs text-blue-400">Conversación actual</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-700 border-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-300">En Espera</CardTitle>
            <Users className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{waitingChats.length}</div>
            <p className="text-xs text-yellow-400">Esperando atención</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-700 border-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-300">Estado</CardTitle>
            <Clock className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {isConnected ? "Online" : "Offline"}
            </div>
            <p className="text-xs text-green-400">Servidor WebSocket</p>
          </CardContent>
        </Card>
      </div>

      {/* Waiting Chats */}
      <WaitingChats waitingChats={waitingChats} onClaim={handleClaimChat} />

      {/* Active Chat */}
      {activeConversation ? (
        <ActiveChat
          conversationId={activeConversation.conversation_id}
          customerName={activeConversation.customer_name}
          messages={activeConversation.messages}
          onSendMessage={handleSendMessage}
          onEndChat={handleEndChat}
        />
      ) : (
        <Card className="bg-gray-700 border-gray-600">
          <CardContent className="text-center py-12">
            <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-white text-lg font-medium mb-2">No hay chat activo</h3>
            <p className="text-gray-400">
              {waitingChats.length > 0
                ? "Selecciona un chat en espera para comenzar"
                : "Esperando nuevos chats de clientes..."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
