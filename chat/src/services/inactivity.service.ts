import { dbService } from './database.service';

export interface InactivityTracker {
    lastActivity: number;
    lastSender: 'admin' | 'customer';
    warned: boolean;
    customerName: string;
    adminName: string;
}

export class InactivityService {
    private tracker = new Map<string, InactivityTracker>();
    private checkInterval: NodeJS.Timeout | null = null;

    constructor(
        private onWarnAdmin: (conversationId: string, message: string) => void,
        private onWarnCustomer: (conversationId: string, message: string) => void,
        private onEndChat: (conversationId: string, reason: string) => void
    ) {}

    updateActivity(conversationId: string, senderType: 'admin' | 'customer', customerName: string, adminName: string) {
        this.tracker.set(conversationId, {
            lastActivity: Date.now(),
            lastSender: senderType,
            warned: false,
            customerName,
            adminName
        });
    }

    removeConversation(conversationId: string) {
        this.tracker.delete(conversationId);
    }

    start() {
        if (this.checkInterval) return;
        this.checkInterval = setInterval(() => this.check(), 20000); // Check every 20 seconds
        console.log('Inactivity service started');
    }

    stop() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }

    private async check() {
        const now = Date.now();
        
        for (const [conversationId, info] of this.tracker.entries()) {
            const elapsed = now - info.lastActivity;

            if (info.lastSender === 'customer') {
                // Admin needs to respond
                if (elapsed >= 5 * 60 * 1000) { // 5 minutes
                    this.onEndChat(conversationId, 'Chat finalizado automáticamente por inactividad del administrador.');
                    this.tracker.delete(conversationId);
                } else if (elapsed >= 4 * 60 * 1000 && !info.warned) { // 4 minutes
                    this.onWarnAdmin(conversationId, `Admin, el usuario ${info.customerName} está esperando respuesta. El chat cerrará luego de 1 minuto.`);
                    info.warned = true;
                }
            } else {
                // Customer needs to respond
                if (elapsed >= 5 * 60 * 1000) { // 5 minutes
                    this.onEndChat(conversationId, 'Chat finalizado automáticamente por inactividad del cliente.');
                    this.tracker.delete(conversationId);
                } else if (elapsed >= 3 * 60 * 1000 && !info.warned) { // 3 minutes
                    this.onWarnCustomer(conversationId, `Hola ${info.customerName}, el chat se cerrará pronto si no hay respuesta. ¿Sigues ahí?`);
                    info.warned = true;
                }
            }
        }
    }
}
