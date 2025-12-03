import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Clock, User } from "lucide-react";

interface WaitingChat {
    conversation_id: string;
    customer_name: string;
    customer_email?: string;
    started_at: string;
}

interface WaitingChatsProps {
    waitingChats: WaitingChat[];
    onClaim: (conversationId: string) => void;
    compact?: boolean;
}

export const WaitingChats = ({ waitingChats, onClaim, compact = false }: WaitingChatsProps) => {
    if (waitingChats.length === 0) {
        return null;
    }

    const Content = (
        <div className="space-y-3">
            {waitingChats.map((chat) => (
                <div
                    key={chat.conversation_id}
                    className={`flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-yellow-500/30 hover:border-yellow-500/60 transition-colors ${compact ? 'flex-col gap-2 items-start' : ''}`}
                >
                    <div className="flex items-center gap-3 w-full">
                        <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="h-5 w-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="text-white font-medium truncate">{chat.customer_name}</div>
                            {!compact && chat.customer_email && (
                                <div className="text-gray-400 text-sm truncate">{chat.customer_email}</div>
                            )}
                            <div className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                                <Clock className="h-3 w-3" />
                                <span className="truncate">
                                    {compact ? new Date(chat.started_at).toLocaleTimeString() : `Esperando desde ${new Date(chat.started_at).toLocaleTimeString()}`}
                                </span>
                            </div>
                        </div>
                    </div>
                    <Button
                        onClick={() => onClaim(chat.conversation_id)}
                        className={`bg-yellow-600 hover:bg-yellow-500 text-white ${compact ? 'w-full text-xs h-8' : ''}`}
                    >
                        Atender
                    </Button>
                </div>
            ))}
        </div>
    );

    if (compact) {
        return Content;
    }

    return (
        <Card className="bg-gray-700 border-yellow-500 mb-6">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-yellow-400" />
                    Chats en Espera
                    <Badge className="bg-yellow-600 text-white ml-2">
                        {waitingChats.length}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {Content}
            </CardContent>
        </Card>
    );
};
