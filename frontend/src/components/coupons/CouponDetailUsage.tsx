
import { Users } from "lucide-react";

interface CouponDetailUsageProps {
  usageCount: number | null;
  usageLimit: number | null;
}

export const CouponDetailUsage = ({ usageCount, usageLimit }: CouponDetailUsageProps) => {
  const getUsagePercentage = (usage: number | null, limit: number | null) => {
    if (!usage || !limit) return 0;
    return (usage / limit) * 100;
  };

  return (
    <div className="bg-gray-700 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-purple-200 mb-3 flex items-center">
        <Users className="h-5 w-5 mr-2" />
        Estadísticas de Uso
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-purple-400">Usos actuales:</span>
          <span className="font-medium text-purple-100">{usageCount || 0}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-purple-400">Límite de usos:</span>
          <span className="font-medium text-purple-100">
            {usageLimit || 'Sin límite'}
          </span>
        </div>
        {usageLimit && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-purple-400">Progreso:</span>
              <span className="text-sm text-purple-300">
                {getUsagePercentage(usageCount, usageLimit).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-3">
              <div 
                className="bg-purple-500 h-3 rounded-full transition-all duration-300" 
                style={{ width: `${getUsagePercentage(usageCount, usageLimit)}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
