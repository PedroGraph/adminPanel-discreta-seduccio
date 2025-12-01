import { useEffect, useState, useCallback } from 'react';
import wsService from '@/services/websocket.service';

interface UseWebSocketOptions {
    clientType: 'customer' | 'admin';
    authData?: any;
    autoConnect?: boolean;
}

export function useWebSocket({ clientType, authData, autoConnect = true }: UseWebSocketOptions) {
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        if (autoConnect) {
            wsService.connect(clientType, authData);
        }

        const handleAuthSuccess = () => {
            setIsConnected(true);
        };

        const handleConnectionFailed = () => {
            setIsConnected(false);
        };

        const handleMessage = (data: any) => {
            setMessages((prev) => [...prev, data]);
        };

        wsService.on('auth:success', handleAuthSuccess);
        wsService.on('connection:failed', handleConnectionFailed);
        wsService.on('chat:message', handleMessage);

        return () => {
            wsService.off('auth:success', handleAuthSuccess);
            wsService.off('connection:failed', handleConnectionFailed);
            wsService.off('chat:message', handleMessage);
        };
    }, [clientType, authData, autoConnect]);

    const sendMessage = useCallback((type: string, payload?: any) => {
        wsService.send({ type, payload });
    }, []);

    const subscribe = useCallback((event: string, handler: (data: any) => void) => {
        wsService.on(event, handler);
        return () => wsService.off(event, handler);
    }, []);

    return {
        isConnected,
        messages,
        sendMessage,
        subscribe,
    };
}
