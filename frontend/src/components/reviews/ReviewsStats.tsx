
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, Clock, CheckCircle, XCircle, TrendingUp } from "lucide-react";
import type { ReviewStats } from "@/types/review";

interface ReviewsStatsProps {
  stats: ReviewStats;
}

export const ReviewsStats = ({ stats }: ReviewsStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
      <Card className="bg-gray-700 border-purple-700 hover:bg-gray-600 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-300">Total Reseñas</CardTitle>
          <MessageSquare className="h-4 w-4 text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-100">{stats.total}</div>
        </CardContent>
      </Card>

      <Card className="bg-gray-700 border-green-600 hover:bg-gray-600 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-300">Aprobadas</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-100">{stats.approved}</div>
        </CardContent>
      </Card>

      <Card className="bg-gray-700 border-yellow-500 hover:bg-gray-600 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-yellow-300">Pendientes</CardTitle>
          <Clock className="h-4 w-4 text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-100">{stats.pending}</div>
        </CardContent>
      </Card>

      <Card className="bg-gray-700 border-red-500 hover:bg-gray-600 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-red-300">Rechazadas</CardTitle>
          <XCircle className="h-4 w-4 text-red-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-100">{stats.rejected}</div>
        </CardContent>
      </Card>

      <Card className="bg-gray-700 border-blue-500 hover:bg-gray-600 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-300">Rating Promedio</CardTitle>
          <Star className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-100">
            {stats.averageRating.toFixed(1)}
          </div>
          <div className="flex items-center text-xs text-blue-400">
            <TrendingUp className="h-3 w-3 mr-1" />
            de 5 estrellas
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-700 border-purple-600 hover:bg-gray-600 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-300">Tasa Aprobación</CardTitle>
          <CheckCircle className="h-4 w-4 text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-100">
            {stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
