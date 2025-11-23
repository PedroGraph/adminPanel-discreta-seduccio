
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface OrdersStatsProps {
  stats: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
  onStatusFilter: (status: string) => void;
  currentFilter: string;
  isLoading: boolean;
}

export const OrdersStats = ({ stats, onStatusFilter, currentFilter, isLoading }: OrdersStatsProps) => {
  const statCards = [
    { title: "Total Órdenes", value: stats.total, status: "all", color: "purple" },
    { title: "Pendientes", value: stats.pending, status: "Pendiente", color: "blue" },
    { title: "Completadas", value: stats.completed, status: "Completado", color: "green" },
    { title: "Canceladas", value: stats.cancelled, status: "Cancelado", color: "red" }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {statCards.map((stat) => (
        <Card 
          key={stat.status}
          className={`cursor-pointer transition-all duration-200 ${
            stat.color === "purple" 
              ? `bg-gray-700 border-purple-700 hover:bg-gray-600 ${currentFilter === stat.status ? 'ring-2 ring-purple-500' : ''}` 
              : stat.color === "blue" 
              ? `bg-gray-700 border-blue-600 hover:bg-gray-600 ${currentFilter === stat.status ? 'ring-2 ring-blue-500' : ''}` 
              : stat.color === "green" 
              ? `bg-gray-700 border-green-600 hover:bg-gray-600 ${currentFilter === stat.status ? 'ring-2 ring-green-500' : ''}` 
              : `bg-gray-700 border-red-600 hover:bg-gray-600 ${currentFilter === stat.status ? 'ring-2 ring-red-500' : ''}`
          }`}
          onClick={() => onStatusFilter(stat.status)}
        >
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm font-medium ${
              stat.color === "purple" 
                ? "text-purple-300" 
                : stat.color === "blue" 
                ? "text-blue-300" 
                : stat.color === "green" 
                ? "text-green-300" 
                : "text-red-300"
            }`}>
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              stat.color === "purple" 
                ? "text-purple-100" 
                : stat.color === "blue" 
                ? "text-blue-400" 
                : stat.color === "green" 
                ? "text-green-400" 
                : "text-red-400"
            }`}>
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
