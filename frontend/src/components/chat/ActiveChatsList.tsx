import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, User } from "lucide-react";

interface ActiveConversation {
    conversation_id: string;
    customer_name: string;
    messages: any[];
}

interface ActiveChatsListProps {
    activeConversations: ActiveConversation[];
    selectedConversationId: string | null;
    onSelectChat: (conversationId: string) => void;
    compact?: boolean;
}

export const ActiveChatsList = ({
    activeConversations,
    selectedConversationId,
    onSelectChat,
    compact = false
}: ActiveChatsListProps) => {
    if (activeConversations.length === 0) {
        return null;
    }

    const Content = (
        <div className="space-y-2">
            {activeConversations.map((chat) => (
                <div
                    key={chat.conversation_id}
                    onClick={() => onSelectChat(chat.conversation_id)}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${selectedConversationId === chat.conversation_id
                            ? 'bg-blue-900/40 border border-blue-500/50'
                            : 'bg-gray-800 border border-gray-700 hover:bg-gray-750'
                        }`}
                >
                    <div className="flex items-center gap-3 w-full overflow-hidden">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="h-5 w-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="text-white font-medium truncate">{chat.customer_name}</div>
                            <div className="text-gray-400 text-xs truncate">
                                {chat.messages.length > 0
                                    ? chat.messages[chat.messages.length - 1].message
                                    : 'Sin mensajes'}
                            </div>
                        </div>
                        {selectedConversationId === chat.conversation_id && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );

    if (compact) {
        return (
            <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-400 mb-2 px-1">Chats Activos ({activeConversations.length})</h3>
                {Content}
            </div>
        );
    }

    return (
        <Card className="bg-gray-700 border-blue-500 mb-6">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-blue-400" />
                    Chats Activos
                    <Badge className="bg-blue-600 text-white ml-2">
                        {activeConversations.length}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {Content}
            </CardContent>
        </Card>
    );
};
