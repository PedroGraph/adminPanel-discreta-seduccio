
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVirtualChat, ChatNotification } from "@/hooks/useVirtualChat";

export function NotificationsButton() {
  const [notifications, setNotifications] = useState<ChatNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { getTotalUnreadCount, setNotificationCallback } = useVirtualChat();

  useEffect(() => {
    setNotificationCallback((notification: ChatNotification) => {
      setNotifications(prev => [notification, ...prev].slice(0, 10)); // Mantener solo las últimas 10
    });
  }, [setNotificationCallback]);

  const handleNotificationClick = (notification: ChatNotification) => {
    navigate('/virtual-chat');
    setIsOpen(false);
    // Remover la notificación al hacer clic
    setNotifications(prev => prev.filter(n => n.id !== notification.id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const totalCount = notifications.length + getTotalUnreadCount();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-white hover:bg-purple-700"
          aria-label="Notificaciones"
        >
          <Bell className="h-5 w-5" />
          {totalCount > 0 && (
            <Badge className="absolute -top-0.5 -right-0.5 rounded-full bg-red-600 text-xs text-white w-5 h-5 flex items-center justify-center border-2 border-gray-700 animate-pulse pointer-events-none">
              {totalCount > 9 ? '9+' : totalCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-gray-800 border-gray-600" align="end">
        <div className="p-4 border-b border-gray-600">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-medium">Notificaciones</h3>
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllNotifications}
                className="text-gray-400 hover:text-white text-xs"
              >
                Limpiar todo
              </Button>
            )}
          </div>
        </div>
        <ScrollArea className="max-h-80">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              No hay notificaciones nuevas
            </div>
          ) : (
            <div className="p-2">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className="mb-2 bg-gray-700 border-gray-600 cursor-pointer hover:bg-gray-600 transition-colors"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-white font-medium text-sm truncate">
                            {notification.customerName}
                          </p>
                          <span className="text-gray-400 text-xs flex-shrink-0">
                            {notification.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-blue-400 text-xs mt-1">
                          Hacer clic para ir al chat →
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
