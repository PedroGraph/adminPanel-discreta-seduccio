import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Users, Clock, History } from "lucide-react";
import { WaitingChats } from "@/components/chat/WaitingChats";
import { ActiveChat } from "@/components/chat/ActiveChat";
import { useChatContext } from "@/context/ChatContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatHistory } from "./ChatHistory";
import { ActiveChatsList } from "@/components/chat/ActiveChatsList";

export const VirtualChat = () => {
  const {
    waitingChats,
    activeConversations,
    selectedConversationId,
    isConnected,
    claimChat,
    selectChat,
    sendMessage,
    endChat,
    isTyping,
    sendTyping
  } = useChatContext();

  const selectedConversation = activeConversations.find(c => c.conversation_id === selectedConversationId);

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

      <Tabs defaultValue="live" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-700">
          <TabsTrigger value="live" className="data-[state=active]:bg-gray-600 data-[state=active]:text-white text-gray-300">
            <MessageCircle className="w-4 h-4 mr-2" />
            Chat en Vivo
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-gray-600 data-[state=active]:text-white text-gray-300">
            <History className="w-4 h-4 mr-2" />
            Historial
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gray-700 border-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-300">Chats Activos</CardTitle>
                <MessageCircle className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{activeConversations.length}</div>
                <p className="text-xs text-blue-400">Conversaciones actuales</p>
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
                <p className="text-gray-400">
                  {activeConversations.length > 0
                    ? "Selecciona una conversación de la lista para continuar"
                    : waitingChats.length > 0
                      ? "Selecciona un chat en espera para comenzar"
                      : "Esperando nuevos chats de clientes..."}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              {/* Active Chats List */}
              <ActiveChatsList
                activeConversations={activeConversations}
                selectedConversationId={selectedConversationId}
                onSelectChat={selectChat}
              />

              {/* Waiting Chats */}
              <WaitingChats waitingChats={waitingChats} onClaim={claimChat} />
            </div>

            <div className="lg:col-span-2">
              {/* Active Chat Area */}
              {selectedConversation ? (
                <ActiveChat
                  key={selectedConversation.conversation_id}
                  conversationId={selectedConversation.conversation_id}
                  customerName={selectedConversation.customer_name}
                  messages={selectedConversation.messages}
                  onSendMessage={sendMessage}
                  onEndChat={() => endChat(selectedConversation.conversation_id)}
                  isTyping={isTyping}
                  onTyping={sendTyping}
                />
              ) : (
                <Card className="bg-gray-700 border-gray-600 h-[500px] flex items-center justify-center">
                  <CardContent className="text-center">
                    <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-white text-lg font-medium mb-2">
                      {activeConversations.length > 0 ? "Selecciona un chat" : "No hay chat activo"}
                    </h3>
                    <p className="text-gray-400">
                      {activeConversations.length > 0
                        ? "Selecciona una conversación de la lista para continuar"
                        : waitingChats.length > 0
                          ? "Selecciona un chat en espera para comenzar"
                          : "Esperando nuevos chats de clientes..."}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <ChatHistory embedded={true} />
        </TabsContent>
      </Tabs>
    </div >
  );
};
