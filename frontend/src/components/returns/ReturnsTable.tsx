import { useI18n } from "@/hooks/use-i18n";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle, XCircle, Package } from "lucide-react";
import { Return } from "@/types/return";
import { TableSkeleton } from "@/components/ui/table-skeleton";

interface ReturnsTableProps {
  returns: Return[];
  onViewDetails: (returnItem: Return) => void;
  onApprove: (returnItem: Return) => void;
  onReject: (returnItem: Return) => void;
  isLoading?: boolean;
}

export const ReturnsTable = ({ returns, onViewDetails, onApprove, onReject, isLoading }: ReturnsTableProps) => {
  const t = useI18n();
  const tr = t("returns_table") as any;
  const filters = t("returns_filters") as any;

  const getStatusTranslation = (status: string) => {
    switch (status) {
      case "Pendiente": return filters.pending;
      case "Procesando": return filters.processing;
      case "Aprobado": return filters.approved;
      case "Rechazado": return filters.rejected;
      default: return status;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-gray-600">
          <TableHead className="text-purple-300">{tr.header_return || "Return"}</TableHead>
          <TableHead className="text-purple-300">{tr.header_order || "Order"}</TableHead>
          <TableHead className="text-purple-300">{tr.header_customer || "Customer"}</TableHead>
          <TableHead className="text-purple-300">{tr.header_products || "Products"}</TableHead>
          <TableHead className="text-purple-300">{tr.header_status || "Status"}</TableHead>
          <TableHead className="text-purple-300">{tr.header_total || "Total Amount"}</TableHead>
          <TableHead className="text-right text-purple-300">{tr.header_actions || "Actions"}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={7} className="p-0">
              <TableSkeleton columns={7} rows={5} />
            </TableCell>
          </TableRow>
        ) : (
          returns.map((returnItem) => (
            <TableRow key={returnItem.id} className="hover:bg-gray-800 border-gray-600 transition-colors">
              <TableCell className="font-medium text-purple-100">{returnItem.id}</TableCell>
              <TableCell className="text-purple-100">{returnItem.order_id}</TableCell>
              <TableCell className="text-purple-100">{returnItem.customer}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-purple-400" />
                  <span className="text-purple-100">
                    {returnItem.return_items.length} {returnItem.return_items.length === 1 ? tr.product_singular : tr.product_plural}
                  </span>
                  {returnItem.return_items.length > 1 && (
                    <Badge variant="outline" className="border-purple-600 text-purple-400 bg-purple-900/20 text-xs">
                      {tr.multiple}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    returnItem.status === "Aprobado" ? "border-green-600 text-green-400 bg-green-900/20" :
                      returnItem.status === "Pendiente" ? "border-blue-600 text-blue-400 bg-blue-900/20" :
                        returnItem.status === "Procesando" ? "border-blue-600 text-blue-400 bg-blue-900/20" : "border-red-600 text-red-400 bg-red-900/20"
                  }
                >
                  {getStatusTranslation(returnItem.status)}
                </Badge>
              </TableCell>
              <TableCell className="font-medium text-purple-100">${returnItem.total_refund_amount.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-purple-400 hover:bg-purple-900 hover:text-purple-300 transition-colors"
                    onClick={() => onViewDetails(returnItem)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {returnItem.status === "Pendiente" && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-green-400 hover:bg-green-900 hover:text-green-300 transition-colors"
                        onClick={() => onApprove(returnItem)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:bg-red-900 hover:text-red-300 transition-colors"
                        onClick={() => onReject(returnItem)}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
