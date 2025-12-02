type WebSocketEventHandler = (data: any) => void;

export class WebSocketService {
    private ws: WebSocket | null = null;
    private eventHandlers: Map<string, WebSocketEventHandler[]> = new Map();
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 3000;
    private url: string;

    constructor(url: string) {
        this.url = url;
    }

    connect(clientType: 'customer' | 'admin', authData?: any) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            console.log('WebSocket already connected');
            return;
        }

        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
            console.log('WebSocket connected');
            this.reconnectAttempts = 0;

            // Authenticate
            this.send({
                type: `auth:${clientType}`,
                payload: authData,
            });
        };

        this.ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                this.emit(message.type, message.payload);
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        this.ws.onclose = () => {
            console.log('WebSocket disconnected');
            this.attemptReconnect(clientType, authData);
        };
    }

    private attemptReconnect(clientType: 'customer' | 'admin', authData?: any) {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(
                `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
            );
            setTimeout(() => {
                this.connect(clientType, authData);
            }, this.reconnectDelay);
        } else {
            console.error('Max reconnect attempts reached');
            this.emit('connection:failed', {});
        }
    }

    send(message: { type: string; payload?: any }) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        } else {
            console.error('WebSocket is not connected');
        }
    }

    on(event: string, handler: WebSocketEventHandler) {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, []);
        }
        this.eventHandlers.get(event)!.push(handler);
    }

    off(event: string, handler: WebSocketEventHandler) {
        const handlers = this.eventHandlers.get(event);
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }

    private emit(event: string, data: any) {
        const handlers = this.eventHandlers.get(event);
        if (handlers) {
            handlers.forEach((handler) => handler(data));
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.eventHandlers.clear();
    }

    isConnected(): boolean {
        return this.ws?.readyState === WebSocket.OPEN;
    }
}

// Singleton instance
const wsService = new WebSocketService('ws://localhost:3000');

export default wsService;
