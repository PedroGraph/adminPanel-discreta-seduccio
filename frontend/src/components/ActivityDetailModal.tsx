
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Activity } from "@/types/activity"; // Importando el tipo

interface ActivityDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Activity | null;
}

export const ActivityDetailModal = ({ isOpen, onClose, activity }: ActivityDetailModalProps) => {
  if (!activity) return null;

  const getLevelBadgeClasses = (level: Activity["level"]) => {
    switch (level) {
      case "ERROR":
        return "bg-red-600 text-white border-red-700";
      case "WARN":
        return "bg-yellow-500 text-black border-yellow-600"; 
      case "INFO":
      default:
        return "bg-blue-600 text-white border-blue-700";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-purple-700 text-purple-100 sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="text-purple-200">Detalle de Actividad</DialogTitle>
          <DialogDescription className="text-purple-400">
            Información detallada del evento registrado.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4 text-sm">
          <div className="grid grid-cols-[100px_1fr] items-center gap-2">
            <span className="text-purple-400 font-medium">Timestamp:</span>
            <span className="text-purple-100">{activity.timestamp}</span>
          </div>
          <div className="grid grid-cols-[100px_1fr] items-center gap-2">
            <span className="text-purple-400 font-medium">Usuario:</span>
            <span className="text-purple-100">{activity.user}</span>
          </div>
          <div className="grid grid-cols-[100px_1fr] items-center gap-2">
            <span className="text-purple-400 font-medium">Nivel:</span>
            <Badge className={`text-xs ${getLevelBadgeClasses(activity.level)}`}>{activity.level}</Badge>
          </div>
          <div className="grid grid-cols-[100px_1fr] items-center gap-2">
            <span className="text-purple-400 font-medium">Categoría:</span>
            <Badge variant="outline" className="text-xs border-purple-700 text-purple-400 capitalize">{activity.category}</Badge>
          </div>
          <div className="grid grid-cols-[100px_1fr] items-start gap-2">
            <span className="text-purple-400 font-medium">Mensaje:</span>
            <span className="text-purple-100">{activity.action} - <span className="font-semibold">{activity.target}</span></span>
          </div>
          
          <div className="mt-4">
            <h4 className="text-purple-300 font-semibold mb-2">Detalle a fondo del log:</h4>
            <div className="bg-gray-900 p-3 rounded-md border border-purple-600 max-h-40 overflow-y-auto">
              <pre className="text-purple-100 whitespace-pre-wrap text-xs">{activity.details}</pre>
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" className="border-purple-600 text-purple-300 hover:bg-purple-700 hover:text-purple-100">
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

