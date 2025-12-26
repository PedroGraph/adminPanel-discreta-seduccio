import { useI18n } from "@/hooks/use-i18n";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import type { Coupon } from "@/services/coupons.service";
import { useLanguage } from "@/contexts/LanguageContext";

interface CouponsTableProps {
  coupons: Coupon[];
  onViewDetails: (coupon: Coupon) => void;
  onEdit: (coupon: Coupon) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

import { TableSkeleton } from "@/components/ui/table-skeleton";

export const CouponsTable = ({ coupons, onViewDetails, onEdit, onDelete, isLoading }: CouponsTableProps) => {
  const t = useI18n();
  const { language } = useLanguage();
  const dateLocale = language === 'es' ? es : enUS;
  const table = t("coupons_table") as any;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-900/20 text-green-400 border-green-600">{table.status_active}</Badge>;
      case 'inactive':
        return <Badge className="bg-blue-900/20 text-blue-400 border-blue-600">{table.status_inactive}</Badge>;
      case 'expired':
        return <Badge className="bg-red-900/20 text-red-400 border-red-600">{table.status_expired}</Badge>;
      default:
        return <Badge variant="outline">{table.status_unknown}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    return (
      <Badge
        variant="outline"
        className="border-purple-600 text-purple-400 bg-purple-900/20"
      >
        {type === 'percentage' ? table.type_percentage :
          type === 'fixed' ? table.type_fixed : table.type_free_shipping}
      </Badge>
    );
  };

  const formatValue = (type: string, value: number) => {
    if (type === "percentage") return `${value}%`;
    if (type === "fixed") return `$${value}`;
    return table.free;
  };

  const getUsagePercentage = (usage: number | null, limit: number | null) => {
    if (!usage || !limit) return 0;
    return (usage / limit) * 100;
  };

  return (
    <div className="bg-gray-700 rounded-lg border border-purple-700">
      <Table>
        <TableHeader>
          <TableRow className="border-purple-700 hover:bg-gray-600">
            <TableHead className="text-purple-300">{table.header_code}</TableHead>
            <TableHead className="text-purple-300">{table.header_name}</TableHead>
            <TableHead className="text-purple-300">{table.header_type}</TableHead>
            <TableHead className="text-purple-300">{table.header_value}</TableHead>
            <TableHead className="text-purple-300">{table.header_usage}</TableHead>
            <TableHead className="text-purple-300">{table.header_validity}</TableHead>
            <TableHead className="text-purple-300">{table.header_status}</TableHead>
            <TableHead className="text-right text-purple-300">{table.header_actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={8} className="p-0">
                <TableSkeleton columns={8} rows={5} />
              </TableCell>
            </TableRow>
          ) : (
            coupons.map((coupon) => (
              <TableRow key={coupon.id} className="border-purple-700 hover:bg-gray-600">
                <TableCell className="font-mono font-bold text-purple-100">{coupon.id}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-purple-100">{coupon.name}</div>
                    <div className="text-sm text-purple-400">{coupon.category || table.general}</div>
                  </div>
                </TableCell>
                <TableCell>{getTypeBadge(coupon.type)}</TableCell>
                <TableCell className="text-purple-100">
                  {formatValue(coupon.type, coupon.value)}
                </TableCell>
                <TableCell className="text-purple-100">
                  {coupon.usage_count}/{coupon.usage_limit}
                  <div className="w-full bg-gray-600 rounded-full h-2 mt-1">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${getUsagePercentage(coupon.usage_count, coupon.usage_limit)}%` }}
                    ></div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="text-purple-100">
                      {format(new Date(coupon.start_date), 'dd/MM/yyyy', { locale: dateLocale })}
                    </div>
                    <div className="text-purple-400">
                      {table.until} {format(new Date(coupon.end_date), 'dd/MM/yyyy', { locale: dateLocale })}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(coupon.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewDetails(coupon)}
                      className="bg-gray-600 border-purple-700 text-purple-300 hover:bg-gray-500"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(coupon)}
                      className="bg-blue-700 border-blue-600 text-blue-300 hover:bg-blue-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(coupon.id)}
                      className="bg-red-700 border-red-600 text-red-300 hover:bg-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {coupons.length === 0 && (
        <div className="text-center py-8 text-purple-400">
          {table.no_coupons}
        </div>
      )}
    </div>
  );
};
