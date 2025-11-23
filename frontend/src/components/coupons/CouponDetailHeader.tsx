
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";

interface CouponDetailHeaderProps {
  status: string;
}

export const CouponDetailHeader = ({ status }: CouponDetailHeaderProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-900/20 text-green-400 border-green-600">Activo</Badge>;
      case 'inactive':
        return <Badge className="bg-blue-900/20 text-blue-400 border-blue-600">Inactivo</Badge>;
      case 'expired':
        return <Badge className="bg-red-900/20 text-red-400 border-red-600">Expirado</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  return (
    <div className="text-purple-200 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Tag className="h-5 w-5" />
        <span>Detalles del Cupón</span>
      </div>
      {getStatusBadge(status)}
    </div>
  );
};
