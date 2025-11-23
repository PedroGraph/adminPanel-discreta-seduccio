
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, X } from "lucide-react";
import { VirtualChat } from "@/hooks/useVirtualChat";

interface MinimizedChatBarProps {
  minimizedChats: VirtualChat[];
  onMaximize: (chatId: string) => void;
  onClose: (chatId: string) => void;
}

export const MinimizedChatBar = ({ minimizedChats, onMaximize, onClose }: MinimizedChatBarProps) => {
  if (minimizedChats.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gray-800 border-t border-gray-600 p-2">
      <div className="flex items-center gap-2 max-w-full overflow-x-auto">
        {minimizedChats.map((chat) => (
          <div
            key={chat.id}
            className="flex items-center gap-2 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 min-w-fit"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMaximize(chat.id)}
              className="flex items-center gap-2 text-white hover:bg-gray-600 p-1 h-auto"
            >
              <MessageCircle className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium">{chat.customerName}</span>
              {chat.unreadCount > 0 && (
                <Badge className="bg-red-600 text-white text-xs min-w-[20px] h-5 flex items-center justify-center">
                  {chat.unreadCount}
                </Badge>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onClose(chat.id)}
              className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-gray-600"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
