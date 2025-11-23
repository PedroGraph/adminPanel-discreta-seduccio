
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface CouponDetailDatesProps {
  startDate: string;
  endDate: string;
}

export const CouponDetailDates = ({ startDate, endDate }: CouponDetailDatesProps) => {
  return (
    <div className="bg-gray-700 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-purple-200 mb-3 flex items-center">
        <Calendar className="h-5 w-5 mr-2" />
        Vigencia
      </h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-purple-400">Fecha de inicio:</span>
          <p className="font-medium text-purple-100">
            {format(new Date(startDate), 'dd/MM/yyyy', { locale: es })}
          </p>
        </div>
        <div>
          <span className="text-purple-400">Fecha de fin:</span>
          <p className="font-medium text-purple-100">
            {format(new Date(endDate), 'dd/MM/yyyy', { locale: es })}
          </p>
        </div>
      </div>
    </div>
  );
};
