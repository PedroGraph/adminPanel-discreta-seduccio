
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Coupon } from "@/types/coupon";

interface CouponsTableProps {
  coupons: Coupon[];
  onViewDetails: (coupon: Coupon) => void;
  onEdit: (coupon: Coupon) => void;
  onDelete: (id: string) => void;
}

export const CouponsTable = ({ coupons, onViewDetails, onEdit, onDelete }: CouponsTableProps) => {
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

  const getTypeBadge = (type: string) => {
    return (
      <Badge 
        variant="outline"
        className="border-purple-600 text-purple-400 bg-purple-900/20"
      >
        {type === 'percentage' ? 'Porcentaje' : 
         type === 'fixed' ? 'Fijo' : 'Envío Gratis'}
      </Badge>
    );
  };

  const formatValue = (type: string, value: number) => {
    if (type === "percentage") return `${value}%`;
    if (type === "fixed") return `$${value}`;
    return "Gratis";
  };

  const getUsagePercentage = (usage: number | null, limit: number | null) => {
    if (!usage || !limit) return 0;
    return (usage / limit) * 100;
  };

  return (
    <div className="bg-gray-700 rounded-lg border border-purple-700">
      <Table>
        <TableHeader>
          <TableRow className="border-purple-700 hover:bg-gray-600">
            <TableHead className="text-purple-300">Código</TableHead>
            <TableHead className="text-purple-300">Nombre</TableHead>
            <TableHead className="text-purple-300">Tipo</TableHead>
            <TableHead className="text-purple-300">Valor</TableHead>
            <TableHead className="text-purple-300">Uso</TableHead>
            <TableHead className="text-purple-300">Vigencia</TableHead>
            <TableHead className="text-purple-300">Estado</TableHead>
            <TableHead className="text-right text-purple-300">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.map((coupon) => (
            <TableRow key={coupon.id} className="border-purple-700 hover:bg-gray-600">
              <TableCell className="font-mono font-bold text-purple-100">{coupon.id}</TableCell>
              <TableCell>
                <div>
                  <div className="font-medium text-purple-100">{coupon.name}</div>
                  <div className="text-sm text-purple-400">{coupon.category}</div>
                </div>
              </TableCell>
              <TableCell>{getTypeBadge(coupon.type)}</TableCell>
              <TableCell className="text-purple-100">
                {formatValue(coupon.type, coupon.value)}
              </TableCell>
              <TableCell className="text-purple-100">
                {coupon.usage_count}/{coupon.usage_limit}
                <div className="w-full bg-gray-600 rounded-full h-2 mt-1">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${getUsagePercentage(coupon.usage_count, coupon.usage_limit)}%` }}
                  ></div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div className="text-purple-100">
                    {format(new Date(coupon.start_date), 'dd/MM/yyyy', { locale: es })}
                  </div>
                  <div className="text-purple-400">
                    hasta {format(new Date(coupon.end_date), 'dd/MM/yyyy', { locale: es })}
                  </div>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(coupon.status)}</TableCell>
              <TableCell>
                <div className="flex items-center justify-end space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewDetails(coupon)}
                    className="bg-gray-600 border-purple-700 text-purple-300 hover:bg-gray-500"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(coupon)}
                    className="bg-blue-700 border-blue-600 text-blue-300 hover:bg-blue-600"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDelete(coupon.id)}
                    className="bg-red-700 border-red-600 text-red-300 hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {coupons.length === 0 && (
        <div className="text-center py-8 text-purple-400">
          No se encontraron cupones que coincidan con los filtros seleccionados.
        </div>
      )}
    </div>
  );
};
