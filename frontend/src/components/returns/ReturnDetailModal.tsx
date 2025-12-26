import { useI18n } from "@/hooks/use-i18n";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RotateCcw, Package, Calendar, User, CreditCard } from "lucide-react";
import { Return } from "@/types/return";
import { useLanguage } from "@/contexts/LanguageContext";

interface ReturnDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnItem: Return | null;
}

export const ReturnDetailModal = ({ open, onOpenChange, returnItem }: ReturnDetailModalProps) => {
  const t = useI18n();
  const { language } = useLanguage();
  const tr = t("return_detail") as any;
  const filters = t("returns_filters") as any;

  if (!returnItem) return null;

  const getStatusTranslation = (status: string) => {
    switch (status) {
      case "Pendiente": return filters.pending;
      case "Procesando": return filters.processing;
      case "Aprobado": return filters.approved;
      case "Rechazado": return filters.rejected;
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprobado":
        return "border-green-600 text-green-400 bg-green-900/20";
      case "Pendiente":
        return "border-blue-600 text-blue-400 bg-blue-900/20";
      case "Procesando":
        return "border-blue-600 text-blue-400 bg-blue-900/20";
      default:
        return "border-red-600 text-red-400 bg-red-900/20";
    }
  };

  const getRefundDescription = (status: string) => {
    switch (status) {
      case "Aprobado": return tr.refund_approved_desc;
      case "Pendiente": return tr.refund_pending_desc;
      case "Procesando": return tr.refund_processing_desc;
      case "Rechazado": return tr.refund_rejected_desc;
      default: return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-purple-700 text-purple-100 max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-purple-200 flex items-center gap-2">
            <RotateCcw className="h-5 w-5" />
            {tr.title} {returnItem.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Estado y información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gray-700 border-purple-600">
              <CardHeader className="pb-3">
                <CardTitle className="text-purple-200 text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {tr.general_info}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="text-purple-400 text-sm">{tr.status}:</span>
                  <Badge variant="outline" className={`ml-2 ${getStatusColor(returnItem.status)}`}>
                    {getStatusTranslation(returnItem.status)}
                  </Badge>
                </div>
                <div>
                  <span className="text-purple-400 text-sm">{tr.request_date}:</span>
                  <span className="text-purple-100 ml-2">
                    {new Date(returnItem.created_at).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US')}
                  </span>
                </div>
                <div>
                  <span className="text-purple-400 text-sm">{tr.total_products}:</span>
                  <span className="text-purple-100 ml-2">{returnItem.return_items.length}</span>
                </div>
                <div>
                  <span className="text-purple-400 text-sm">{tr.total_amount}:</span>
                  <span className="text-purple-100 ml-2 font-semibold">${returnItem.total_refund_amount.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-700 border-purple-600">
              <CardHeader className="pb-3">
                <CardTitle className="text-purple-200 text-sm flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {tr.customer_info}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="text-purple-400 text-sm">{tr.customer_name}:</span>
                  <span className="text-purple-100 ml-2">{returnItem.customer}</span>
                </div>
                <div>
                  <span className="text-purple-400 text-sm">{tr.original_order}:</span>
                  <span className="text-purple-100 ml-2">{returnItem.order_id}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="bg-purple-700" />

          {/* Lista de productos */}
          <Card className="bg-gray-700 border-purple-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-purple-200 text-sm flex items-center gap-2">
                <Package className="h-4 w-4" />
                {tr.products_list} ({returnItem.return_items.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {returnItem.return_items.map((item, index) => (
                  <div key={index} className="border border-gray-600 rounded-lg p-4 bg-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div>
                          <span className="text-purple-400 text-sm">{tr.product}:</span>
                          <span className="text-purple-100 ml-2 font-medium">{item.product?.name || tr.unknown_product}</span>
                        </div>
                        <div>
                          <span className="text-purple-400 text-sm">{tr.quantity}:</span>
                          <span className="text-purple-100 ml-2">{item.quantity}</span>
                        </div>
                        <div>
                          <span className="text-purple-400 text-sm">{tr.unit_price}:</span>
                          <span className="text-purple-100 ml-2">${item.unit_price.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-purple-400 text-sm">{tr.reason}:</span>
                          <span className="text-purple-100 ml-2">{item.reason}</span>
                        </div>
                        <div>
                          <span className="text-purple-400 text-sm">{tr.type}:</span>
                          <Badge variant="outline" className={`ml-2 border-purple-600 text-purple-400 bg-purple-900/20`}>
                            {filters.refund}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-purple-400 text-sm">{tr.subtotal}:</span>
                          <span className="text-purple-100 ml-2 font-semibold">${item.total_price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Proceso de reembolso */}
          <Card className="bg-gray-700 border-purple-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-purple-200 text-sm flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                {tr.refund_process}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-100 text-sm">
                {getRefundDescription(returnItem.status)}
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
