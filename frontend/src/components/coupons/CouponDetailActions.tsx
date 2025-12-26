import { useI18n } from "@/hooks/use-i18n";
import { Button } from "@/components/ui/button";
import type { Coupon } from "@/services/coupons.service";

interface CouponDetailActionsProps {
  coupon: Coupon;
  onEdit: (coupon: Coupon) => void;
  onDelete: (id: string) => void;
}

export const CouponDetailActions = ({ coupon, onEdit, onDelete }: CouponDetailActionsProps) => {
  const t = useI18n();
  return (
    <div className="flex justify-end space-x-3">
      <Button
        variant="outline"
        onClick={() => onEdit(coupon)}
        className="bg-gray-800 border-blue-600 text-white hover:bg-blue-700 hover:border-blue-500 hover:text-white"
      >
        {t("edit")}
      </Button>
      <Button
        variant="outline"
        onClick={() => onDelete(coupon.id)}
        className="bg-gray-800 border-red-600 text-white hover:bg-red-700 hover:border-red-500 hover:text-white"
      >
        {t("delete")}
      </Button>
    </div>
  );
};
