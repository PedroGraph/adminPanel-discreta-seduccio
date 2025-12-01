import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, X, User } from "lucide-react";

interface Message {
    sender_type: 'customer' | 'admin';
    sender_name: string;
    message: string;
    sent_at: string;
}

interface ActiveChatProps {
    conversationId: string;
    customerName: string;
    messages: Message[];
    onSendMessage: (message: string) => void;
    onEndChat: () => void;
}

export const ActiveChat = ({
    conversationId,
    customerName,
    messages,
    onSendMessage,
    onEndChat,
}: ActiveChatProps) => {
    const [inputMessage, setInputMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (inputMessage.trim()) {
            onSendMessage(inputMessage);
            setInputMessage("");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <Card className="bg-gray-700 border-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-white flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                    </div>
                    {customerName}
                    <Badge className="bg-green-600 text-white ml-2">Activo</Badge>
                </CardTitle>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onEndChat}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                    <X className="h-4 w-4 mr-1" />
                    Finalizar
                </Button>
            </CardHeader>
            <CardContent>
                {/* Messages Area */}
                <div className="bg-gray-800 rounded-lg p-4 h-96 overflow-y-auto mb-4 space-y-3">
                    {messages.length === 0 ? (
                        <div className="text-center text-gray-400 mt-8">
                            <p>No hay mensajes aún. Inicia la conversación.</p>
                        </div>
                    ) : (
                        messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.sender_type === 'admin' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[70%] rounded-lg p-3 ${msg.sender_type === 'admin'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-700 text-gray-100'
                                        }`}
                                >
                                    <div className="text-xs opacity-75 mb-1">{msg.sender_name}</div>
                                    <div className="break-words">{msg.message}</div>
                                    <div className="text-xs opacity-60 mt-1">
                                        {new Date(msg.sent_at).toLocaleTimeString()}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="flex gap-2">
                    <Input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Escribe un mensaje..."
                        className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                    />
                    <Button
                        onClick={handleSend}
                        disabled={!inputMessage.trim()}
                        className="bg-blue-600 hover:bg-blue-500 text-white"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
