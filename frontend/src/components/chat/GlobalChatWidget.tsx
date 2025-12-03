import { useState } from "react";
import { useChatContext } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, X, Minimize2, Maximize2, ChevronLeft } from "lucide-react";
import { ActiveChat } from "./ActiveChat";
import { WaitingChats } from "./WaitingChats";
import { ActiveChatsList } from "./ActiveChatsList";

export const GlobalChatWidget = () => {
    const {
        waitingChats,
        activeConversations,
        selectedConversationId,
        isChatOpen,
        toggleChatWindow,
        claimChat,
        selectChat,
        sendMessage,
        endChat,
        isTyping,
        sendTyping
    } = useChatContext();

    const [isMinimized, setIsMinimized] = useState(false);

    // If we have a selected conversation, we show the chat.
    // Otherwise we show the list.
    const selectedConversation = activeConversations.find(c => c.conversation_id === selectedConversationId);
    const showChatView = !!selectedConversation;

    if (!isChatOpen && waitingChats.length === 0 && activeConversations.length === 0) {
        // Show only a small button if there are no chats and it's closed
        return (
            <Button
                className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg z-50 bg-blue-600 hover:bg-blue-700"
                onClick={toggleChatWindow}
            >
                <MessageCircle className="h-6 w-6 text-white" />
            </Button>
        );
    }

    if (!isChatOpen) {
        const totalNotifications = waitingChats.length + activeConversations.length;
        return (
            <div className="fixed bottom-6 right-6 z-50">
                <Button
                    className="rounded-full h-14 w-14 shadow-lg bg-blue-600 hover:bg-blue-700 relative"
                    onClick={toggleChatWindow}
                >
                    <MessageCircle className="h-6 w-6 text-white" />
                    {totalNotifications > 0 && (
                        <Badge className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 h-6 w-6 rounded-full p-0 flex items-center justify-center">
                            {totalNotifications}
                        </Badge>
                    )}
                </Button>
            </div>
        );
    }

    return (
        <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isMinimized ? 'w-72' : 'w-96 h-[600px]'}`}>
            <Card className="h-full flex flex-col shadow-2xl border-gray-700 bg-gray-800">
                <CardHeader className="p-3 border-b border-gray-700 flex flex-row items-center justify-between space-y-0 bg-gray-900 rounded-t-lg">
                    <div className="flex items-center gap-2 overflow-hidden">
                        {showChatView ? (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-gray-400 hover:text-white mr-1 -ml-2"
                                onClick={() => selectChat(null)}
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                <span className="text-xs">Volver</span>
                            </Button>
                        ) : (
                            <MessageCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
                        )}
                        <CardTitle className="text-sm font-medium text-white truncate">
                            {showChatView ? selectedConversation?.customer_name : 'Chat Virtual'}
                        </CardTitle>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-white" onClick={() => setIsMinimized(!isMinimized)}>
                            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-white" onClick={toggleChatWindow}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>

                {!isMinimized && (
                    <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
                        {showChatView ? (
                            <div className="flex-1 flex flex-col h-full">
                                <ActiveChat
                                    key={selectedConversation!.conversation_id}
                                    conversationId={selectedConversation!.conversation_id}
                                    customerName={selectedConversation!.customer_name}
                                    messages={selectedConversation!.messages}
                                    onSendMessage={sendMessage}
                                    onEndChat={() => endChat(selectedConversation!.conversation_id)}
                                    isTyping={isTyping}
                                    onTyping={sendTyping}
                                    compact={true}
                                />
                            </div>
                        ) : (
                            <div className="p-4 flex-1 overflow-y-auto">
                                <ActiveChatsList
                                    activeConversations={activeConversations}
                                    selectedConversationId={selectedConversationId}
                                    onSelectChat={selectChat}
                                    compact={true}
                                />

                                <h3 className="text-sm font-medium text-gray-400 mb-3 px-1 mt-4">Chats en espera</h3>
                                <WaitingChats
                                    waitingChats={waitingChats}
                                    onClaim={claimChat}
                                    compact={true}
                                />
                                {waitingChats.length === 0 && activeConversations.length === 0 && (
                                    <div className="text-center py-8 text-gray-500 text-sm">
                                        No hay actividad reciente
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                )}
            </Card>
        </div>
    );
};
