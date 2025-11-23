
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const CouponsHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-purple-200">Gestión de Cupones</h1>
        <p className="text-purple-400">Administra cupones de descuento y promociones</p>
      </div>
      <Button className="bg-purple-700 hover:bg-purple-600 text-purple-100 border border-purple-500 transition-colors">
        <Plus className="h-4 w-4 mr-2" />
        Nuevo Cupón
      </Button>
    </div>
  );
};
