import { useI18n } from "@/hooks/use-i18n";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";

interface CouponDetailHeaderProps {
  status: string;
}

export const CouponDetailHeader = ({ status }: CouponDetailHeaderProps) => {
  const t = useI18n();
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

  return (
    <div className="text-purple-200 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Tag className="h-5 w-5" />
        <span>{t("coupon_detail").title || "Coupon Details"}</span>
      </div>
      {getStatusBadge(status)}
    </div>
  );
};
