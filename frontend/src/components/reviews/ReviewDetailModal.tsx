
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Shield, ThumbsUp, Calendar, Mail, Package, Check, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Review } from "@/types/review";

interface ReviewDetailModalProps {
  review: Review | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const ReviewDetailModal = ({ review, isOpen, onClose, onApprove, onReject }: ReviewDetailModalProps) => {
  if (!review) return null;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
        }`}
      />
    ));
  };

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-purple-700 text-purple-100 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-purple-200">
            Detalle de Reseña
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header con rating y estado */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {renderStars(review.rating)}
              <span className="text-lg font-semibold text-purple-100">({review.rating}/5)</span>
            </div>
            {getStatusBadge(review.status)}
          </div>

          {/* Título de la reseña */}
          <div>
            <h3 className="text-lg font-semibold text-purple-100 mb-2">{review.title}</h3>
            {review.comment && (
              <p className="text-purple-300 leading-relaxed">{review.comment}</p>
            )}
          </div>

          {/* Información del cliente */}
          <div className="bg-gray-700 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-purple-200">Información del Cliente</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-purple-400" />
                <span className="text-purple-300">
                  {review.customer_name}
                  {review.is_verified && <span className="text-blue-400 ml-1">(Verificado)</span>}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-purple-400" />
                <span className="text-purple-300">{review.customer_email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-purple-400" />
                <span className="text-purple-300">{review.product_name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-purple-400" />
                <span className="text-purple-300">
                  {format(new Date(review.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                </span>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-purple-300">
              <ThumbsUp className="h-4 w-4" />
              <span>{review.helpful_count} personas encontraron esto útil</span>
            </div>
          </div>

          {/* Acciones */}
          {review.status === 'pending' && (
            <div className="flex justify-end space-x-3 pt-4 border-t border-purple-700">
              <Button
                onClick={() => {
                  onReject(review.id);
                  onClose();
                }}
                variant="outline"
                className="bg-red-700 hover:bg-red-600 text-white border-red-600"
              >
                <X className="h-4 w-4 mr-2" />
                Rechazar
              </Button>
              <Button
                onClick={() => {
                  onApprove(review.id);
                  onClose();
                }}
                className="bg-green-700 hover:bg-green-600 text-white"
              >
                <Check className="h-4 w-4 mr-2" />
                Aprobar
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
