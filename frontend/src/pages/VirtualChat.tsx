
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Users,
  Clock,
  Plus
} from "lucide-react";
import { useVirtualChat } from "@/hooks/useVirtualChat";
import { StartChatModal } from "@/components/support/StartChatModal";
import { VirtualChatWindow } from "@/components/support/VirtualChatWindow";
import { MinimizedChatBar } from "@/components/support/MinimizedChatBar";

export const VirtualChat = () => {
  const { 
    activeChats, 
    maxChats, 
    startChat, 
    closeChat, 
    endChat,
    minimizeChat,
    maximizeChat,
    sendMessage 
  } = useVirtualChat();
  const [showChatModal, setShowChatModal] = useState(false);

  const handleStartChat = (customerId: string, customerName: string) => {
    startChat(customerId, customerName);
  };

  const openChats = activeChats.filter(chat => !chat.isMinimized);
  const minimizedChats = activeChats.filter(chat => chat.isMinimized);

  return (
    <div className="p-6 bg-gray-800 min-h-screen relative">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Chat Virtual</h1>
            <p className="text-gray-400">Gestión de chats en tiempo real con clientes</p>
          </div>
          <Button 
            className="bg-blue-700 hover:bg-blue-600 text-white"
            onClick={() => setShowChatModal(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Chat ({activeChats.length}/{maxChats})
          </Button>
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
            <div className="text-2xl font-bold text-white">{activeChats.length}</div>
            <p className="text-xs text-blue-400">de {maxChats} disponibles</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-700 border-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-300">Clientes Online</CardTitle>
            <Users className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activeChats.length}</div>
            <p className="text-xs text-green-400">Conectados ahora</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-700 border-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-300">Tiempo Promedio</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">2.5 min</div>
            <p className="text-xs text-yellow-400">Respuesta promedio</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Chats Overview */}
      {activeChats.length > 0 && (
        <Card className="bg-gray-700 border-gray-600 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Chats Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeChats.map((chat) => (
                <div key={chat.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <MessageCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="text-white font-medium">{chat.customerName}</div>
                        {chat.isMinimized && (
                          <Badge variant="secondary" className="text-xs bg-gray-600 text-gray-300">
                            Minimizado
                          </Badge>
                        )}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {chat.messages.length} mensajes • Último: {chat.lastActivity.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-600 text-white">Online</Badge>
                    {chat.unreadCount > 0 && (
                      <Badge className="bg-red-600 text-white">
                        {chat.unreadCount} nuevos
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {activeChats.length === 0 && (
        <Card className="bg-gray-700 border-gray-600">
          <CardContent className="text-center py-12">
            <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-white text-lg font-medium mb-2">No hay chats activos</h3>
            <p className="text-gray-400 mb-4">Inicia un nuevo chat para comenzar a atender clientes</p>
            <Button 
              className="bg-blue-700 hover:bg-blue-600 text-white"
              onClick={() => setShowChatModal(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Iniciar Primer Chat
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Open Chat Windows - Fixed position in bottom right, side by side */}
      {openChats.map((chat, index) => (
        <VirtualChatWindow
          key={chat.id}
          chat={chat}
          position={index}
          onClose={closeChat}
          onSendMessage={sendMessage}
          onMinimize={minimizeChat}
          onEndChat={endChat}
        />
      ))}

      {/* Minimized Chat Bar */}
      <MinimizedChatBar
        minimizedChats={minimizedChats}
        onMaximize={maximizeChat}
        onClose={closeChat}
      />

      <StartChatModal
        open={showChatModal}
        onOpenChange={setShowChatModal}
        onStartChat={handleStartChat}
      />
    </div>
  );
};
