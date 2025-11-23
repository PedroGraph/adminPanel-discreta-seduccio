
import { DollarSign } from "lucide-react";

interface CouponDetailDiscountProps {
  type: string;
  value: number;
  minOrder: number | null;
  maxDiscount: number | null;
}

export const CouponDetailDiscount = ({ type, value, minOrder, maxDiscount }: CouponDetailDiscountProps) => {
  const formatValue = (type: string, value: number) => {
    if (type === "percentage") return `${value}%`;
    if (type === "fixed") return `$${value}`;
    return "Gratis";
  };

  return (
    <div className="bg-gray-700 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-purple-200 mb-3 flex items-center">
        <DollarSign className="h-5 w-5 mr-2" />
        Descuento y Condiciones
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="text-purple-400">Tipo:</span>
          <p className="font-medium text-purple-100">
            {type === 'percentage' ? 'Porcentaje' : 
             type === 'fixed' ? 'Fijo' : 'Envío Gratis'}
          </p>
        </div>
        <div>
          <span className="text-purple-400">Valor:</span>
          <p className="font-medium text-purple-100">{formatValue(type, value)}</p>
        </div>
        <div>
          <span className="text-purple-400">Pedido mínimo:</span>
          <p className="font-medium text-purple-100">${minOrder || 0}</p>
        </div>
        <div>
          <span className="text-purple-400">Descuento máximo:</span>
          <p className="font-medium text-purple-100">
            {maxDiscount ? `$${maxDiscount}` : 'Sin límite'}
          </p>
        </div>
      </div>
    </div>
  );
};
