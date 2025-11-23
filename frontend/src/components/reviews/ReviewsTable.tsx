
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Check, X, Eye, ThumbsUp, Shield } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Review } from "@/types/review";

interface ReviewsTableProps {
  reviews: Review[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onViewDetails: (review: Review) => void;
}

export const ReviewsTable = ({ reviews, onApprove, onReject, onViewDetails }: ReviewsTableProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-900/20 text-green-400 border-green-600">Aprobada</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-900/20 text-yellow-400 border-yellow-600">Pendiente</Badge>;
      case 'rejected':
        return <Badge className="bg-red-900/20 text-red-400 border-red-600">Rechazada</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
        }`}
      />
    ));
  };

  return (
    <div className="bg-gray-700 rounded-lg border border-purple-700">
      <Table>
        <TableHeader>
          <TableRow className="border-purple-700 hover:bg-gray-600">
            <TableHead className="text-purple-300">Cliente</TableHead>
            <TableHead className="text-purple-300">Producto</TableHead>
            <TableHead className="text-purple-300">Rating</TableHead>
            <TableHead className="text-purple-300">Título</TableHead>
            <TableHead className="text-purple-300">Estado</TableHead>
            <TableHead className="text-purple-300">Fecha</TableHead>
            <TableHead className="text-purple-300">Útiles</TableHead>
            <TableHead className="text-purple-300">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((review) => (
            <TableRow key={review.id} className="border-purple-700 hover:bg-gray-600">
              <TableCell>
                <div className="flex items-center space-x-2">
                  <div>
                    <p className="font-medium text-purple-100">{review.customer_name}</p>
                    <p className="text-sm text-purple-400">{review.customer_email}</p>
                  </div>
                  {review.is_verified && (
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 text-blue-400" />
                      <span className="sr-only">Cliente verificado</span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-purple-100">{review.product_name}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-1">
                  {renderStars(review.rating)}
                  <span className="text-sm text-purple-300 ml-2">({review.rating})</span>
                </div>
              </TableCell>
              <TableCell className="text-purple-100">{review.title}</TableCell>
              <TableCell>{getStatusBadge(review.status)}</TableCell>
              <TableCell className="text-purple-300">
                {format(new Date(review.created_at), 'dd/MM/yyyy', { locale: es })}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-1 text-purple-300">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{review.helpful_count}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewDetails(review)}
                    className="bg-gray-600 border-purple-700 text-purple-300 hover:bg-gray-500"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {review.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => onApprove(review.id)}
                        className="bg-green-700 hover:bg-green-600 text-white"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => onReject(review.id)}
                        className="bg-red-700 hover:bg-red-600 text-white"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {reviews.length === 0 && (
        <div className="text-center py-8 text-purple-400">
          No se encontraron reseñas que coincidan con los filtros seleccionados.
        </div>
      )}
    </div>
  );
};
