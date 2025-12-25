import { useChatContext } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, X, Minimize2, Maximize2 } from "lucide-react";
import { ActiveChat } from "./ActiveChat";
import { WaitingChats } from "./WaitingChats";
import { ActiveChatsList } from "./ActiveChatsList";

export const GlobalChatWidget = () => {
    const {
        waitingChats,
        activeConversations,
        openChatIds,
        minimizedChatIds,
        isMainMinimized,
        isChatOpen,
        toggleChatWindow,
        toggleMainMinimized,
        claimChat,
        selectChat,
        closeChatWindow,
        toggleChatMinimized,
        sendMessage,
        endChat,
        isTyping,
        sendTyping,
        isConnected
    } = useChatContext();

    // Filter active conversations that are in openChatIds
    const openConversations = activeConversations.filter(c => openChatIds.includes(c.conversation_id));

    return (
        <div className="fixed bottom-0 right-0 flex flex-row-reverse items-end gap-3 px-4 pb-0 z-50 pointer-events-none">
            {/* Main Widget / Inbox List */}
            <div className={`pointer-events-auto mb-4 ${isChatOpen ? 'w-80' : 'w-auto'}`}>
                {!isChatOpen ? (
                    <Button
                        className="rounded-full h-14 w-14 shadow-2xl bg-blue-600 hover:bg-blue-700 relative"
                        onClick={toggleChatWindow}
                    >
                        <MessageCircle className="h-6 w-6 text-white" />
                        {(waitingChats.length + activeConversations.length) > 0 && (
                            <Badge className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 h-6 w-6 rounded-full p-0 flex items-center justify-center">
                                {waitingChats.length + activeConversations.length}
                            </Badge>
                        )}
                    </Button>
                ) : (
                    <Card className={`flex flex-col shadow-2xl border-gray-700 bg-gray-800 transition-all duration-300 ${isMainMinimized ? 'h-11 translate-y-0 overflow-hidden' : 'h-[500px]'}`}>
                        <CardHeader
                            className="p-3 border-b border-gray-700 flex flex-row items-center justify-between space-y-0 bg-gray-900 rounded-t-lg cursor-pointer hover:bg-gray-800 transition-colors h-11"
                            onClick={() => toggleMainMinimized()}
                        >
                            <div className="flex items-center gap-2">
                                <MessageCircle className="h-5 w-5 text-blue-400" />
                                <CardTitle className="text-xs font-semibold text-white truncate">Chat Virtual</CardTitle>
                                {isConnected && <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>}
                            </div>
                            <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-white" onClick={() => toggleMainMinimized()}>
                                    {isMainMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-white hover:bg-red-900/30" onClick={toggleChatWindow}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        {!isMainMinimized && (
                            <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
                                <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
                                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-1">Chats Activos</h3>
                                    <ActiveChatsList
                                        activeConversations={activeConversations}
                                        selectedConversationId={null}
                                        onSelectChat={selectChat}
                                        compact={true}
                                    />

                                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-1 mt-6">En Espera</h3>
                                    <WaitingChats
                                        waitingChats={waitingChats}
                                        onClaim={claimChat}
                                        compact={true}
                                    />
                                    {waitingChats.length === 0 && activeConversations.length === 0 && (
                                        <div className="text-center py-12 text-gray-500 text-sm">
                                            No hay actividad reciente
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        )}
                    </Card>
                )}
            </div>

            {/* Floating Chat Windows */}
            {openConversations.map((chat) => (
                <div key={chat.conversation_id} className="pointer-events-auto w-80 animate-in slide-in-from-bottom-4 duration-300">
                    <ChatWindow
                        chat={chat}
                        onClose={() => closeChatWindow(chat.conversation_id)}
                        onSend={(msg) => sendMessage(chat.conversation_id, msg)}
                        onEnd={() => endChat(chat.conversation_id)}
                        onTyping={(typing) => sendTyping(chat.conversation_id, typing)}
                        isTyping={isTyping[chat.conversation_id]}
                        isMinimized={minimizedChatIds.includes(chat.conversation_id)}
                        onToggleMinimize={() => toggleChatMinimized(chat.conversation_id)}
                    />
                </div>
            ))}
        </div>
    );
};

const ChatWindow = ({
    chat,
    onClose,
    onSend,
    onEnd,
    onTyping,
    isTyping,
    isMinimized,
    onToggleMinimize
}: {
    chat: any,
    onClose: () => void,
    onSend: (m: string) => void,
    onEnd: () => void,
    onTyping: (t: boolean) => void,
    isTyping: boolean,
    isMinimized: boolean,
    onToggleMinimize: () => void
}) => {
    return (
        <Card className={`flex flex-col shadow-2xl border-gray-700 bg-gray-800 transition-all duration-300 ${isMinimized ? 'h-11 translate-y-0 overflow-hidden' : 'h-[450px]'}`}>
            <CardHeader
                className="p-3 border-b border-gray-700 flex flex-row items-center justify-between space-y-0 bg-blue-900/40 rounded-t-lg cursor-pointer hover:bg-blue-900/60 transition-colors h-11"
                onClick={onToggleMinimize}
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold flex-shrink-0">
                        {chat.customer_name[0].toUpperCase()}
                    </div>
                    <CardTitle className="text-xs font-semibold text-white truncate">
                        {chat.customer_name}
                    </CardTitle>
                    {isTyping && <span className="text-[10px] text-blue-300 animate-pulse italic text-xs">escribiendo...</span>}
                </div>
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-[10px] text-red-400 hover:text-red-300 hover:bg-red-900/40 border border-red-900/30 font-bold"
                        onClick={onEnd}
                    >
                        Finalizar
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-white" onClick={onToggleMinimize}>
                        {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-white hover:bg-red-900/30" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            {!isMinimized && (
                <div className="flex-1 overflow-hidden">
                    <ActiveChat
                        conversationId={chat.conversation_id}
                        customerName={chat.customer_name}
                        messages={chat.messages}
                        onSendMessage={onSend}
                        onEndChat={onEnd}
                        onTyping={onTyping}
                        isTyping={isTyping}
                        compact={true}
                    />
                </div>
            )}
        </Card>
    );
};
