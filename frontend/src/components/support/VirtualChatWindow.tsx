
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { X, Send, User, Headphones, Minimize, PhoneOff } from "lucide-react";
import { VirtualChat, ChatMessage } from "@/hooks/useVirtualChat";

interface VirtualChatWindowProps {
  chat: VirtualChat;
  onClose: (chatId: string) => void;
  onSendMessage: (chatId: string, message: string) => void;
  onMinimize: (chatId: string) => void;
  onEndChat: (chatId: string) => void;
  position: number;
}

export const VirtualChatWindow = ({ 
  chat, 
  onClose, 
  onSendMessage, 
  onMinimize, 
  onEndChat,
  position 
}: VirtualChatWindowProps) => {
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat.messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(chat.id, message);
      setMessage("");
      // Ensure scroll to bottom after sending
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const rightPosition = 16 + (position * (400 + 16)); // 400px width + 16px gap

  return (
    <div 
      className="fixed bottom-4 z-50"
      style={{ right: `${rightPosition}px` }}
    >
      <Card className="bg-gray-800 border-gray-600 w-96 h-[500px] flex flex-col shadow-2xl">
        <CardHeader className="pb-2 bg-gray-700 border-b border-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-400" />
              <CardTitle className="text-sm text-white select-none">{chat.customerName}</CardTitle>
              <Badge variant="secondary" className="text-xs bg-green-600 text-white">
                Online
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onMinimize(chat.id)}
                className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-gray-600"
                title="Minimizar"
              >
                <Minimize className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEndChat(chat.id)}
                className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                title="Terminar conversación"
              >
                <PhoneOff className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onClose(chat.id)}
                className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-gray-600"
                title="Cerrar"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0 flex flex-col min-h-0">
          <ScrollArea className="flex-1 p-3">
            <div ref={scrollRef} className="space-y-3 pr-2">
              {chat.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] p-2 rounded-lg text-sm break-words ${
                      msg.sender === 'agent'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      {msg.sender === 'agent' ? (
                        <Headphones className="h-3 w-3 flex-shrink-0" />
                      ) : (
                        <User className="h-3 w-3 flex-shrink-0" />
                      )}
                      <span className="text-xs opacity-75 truncate">
                        {msg.sender === 'agent' ? 'Agente' : chat.customerName}
                      </span>
                    </div>
                    <p className="break-words whitespace-pre-wrap">{msg.message}</p>
                    <span className="text-xs opacity-60 block mt-1">
                      {msg.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-3 border-t border-gray-600 flex-shrink-0">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 text-sm"
              />
              <Button
                onClick={handleSendMessage}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
