
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { MessageSquare, User } from "lucide-react";

interface StartChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartChat: (customerId: string, customerName: string) => void;
}

export const StartChatModal = ({ open, onOpenChange, onStartChat }: StartChatModalProps) => {
  const [customerData, setCustomerData] = useState({
    id: '',
    name: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerData.id && customerData.name) {
      onStartChat(customerData.id, customerData.name);
      setCustomerData({ id: '', name: '' });
      onOpenChange(false);
    }
  };

  const handleQuickStart = (id: string, name: string) => {
    onStartChat(id, name);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Iniciar Chat Virtual
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-white">ID del Cliente</Label>
            <Input
              value={customerData.id}
              onChange={(e) => setCustomerData({...customerData, id: e.target.value})}
              placeholder="Ej: CUST-001"
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              required
            />
          </div>

          <div>
            <Label className="text-white">Nombre del Cliente</Label>
            <Input
              value={customerData.name}
              onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
              placeholder="Ej: María García"
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              required
            />
          </div>

          <div className="border-t border-gray-700 pt-4">
            <Label className="text-white mb-2 block">Clientes Rápidos</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickStart('CUST-001', 'Ana López')}
                className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700 text-xs"
              >
                <User className="h-3 w-3 mr-1" />
                Ana López
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickStart('CUST-002', 'Carlos Ruiz')}
                className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700 text-xs"
              >
                <User className="h-3 w-3 mr-1" />
                Carlos Ruiz
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickStart('CUST-003', 'Sofia Mendoza')}
                className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700 text-xs"
              >
                <User className="h-3 w-3 mr-1" />
                Sofia Mendoza
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickStart('CUST-004', 'Diego Torres')}
                className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700 text-xs"
              >
                <User className="h-3 w-3 mr-1" />
                Diego Torres
              </Button>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-blue-700 hover:bg-blue-600 text-white"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Iniciar Chat
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
