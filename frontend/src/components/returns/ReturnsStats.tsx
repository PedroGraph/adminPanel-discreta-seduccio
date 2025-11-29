
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReturns } from "./ReturnsProvider";

interface ReturnsStatsProps {
  onStatusFilter: (status: string) => void;
  currentFilter: string;
}

export const ReturnsStats = ({ onStatusFilter, currentFilter }: ReturnsStatsProps) => {
  const { returns } = useReturns();

  const total = returns.length;
  const pending = returns.filter(r => r.status === "Pendiente").length;
  const approved = returns.filter(r => r.status === "Aprobado").length;
  const rejected = returns.filter(r => r.status === "Rechazado").length;

  const stats = [
    { title: "Total Devoluciones", value: total, status: "all", color: "purple" },
    { title: "Pendientes", value: pending, status: "Pendiente", color: "blue" },
    { title: "Aprobadas", value: approved, status: "Aprobado", color: "green" },
    { title: "Rechazadas", value: rejected, status: "Rechazado", color: "red" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card
          key={stat.status}
          className={`cursor-pointer transition-all duration-200 ${stat.color === "purple"
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
            <CardTitle className={`text-sm font-medium ${stat.color === "purple"
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
            <div className={`text-2xl font-bold ${stat.color === "purple"
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
