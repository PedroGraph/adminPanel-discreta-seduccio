
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { CouponDetailHeader } from "./CouponDetailHeader";
import { CouponDetailInfo } from "./CouponDetailInfo";
import { CouponDetailDiscount } from "./CouponDetailDiscount";
import { CouponDetailUsage } from "./CouponDetailUsage";
import { CouponDetailDates } from "./CouponDetailDates";
import { CouponDetailCategory } from "./CouponDetailCategory";
import { CouponDetailActions } from "./CouponDetailActions";
import type { Coupon } from "@/services/coupons.service";

interface CouponDetailModalProps {
  coupon: Coupon | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (coupon: Coupon) => void;
  onDelete: (id: string) => void;
}

export const CouponDetailModal = ({
  coupon,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: CouponDetailModalProps) => {
  if (!coupon) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-purple-700 text-purple-100 max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            <CouponDetailHeader status={coupon.status} />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <CouponDetailInfo id={coupon.id} name={coupon.name} />

          <CouponDetailDiscount
            type={coupon.type}
            value={coupon.value}
            minOrder={coupon.min_order}
            maxDiscount={coupon.max_discount}
          />

          <CouponDetailUsage
            usageCount={coupon.usage_count}
            usageLimit={coupon.usage_limit}
          />

          <CouponDetailDates
            startDate={coupon.start_date}
            endDate={coupon.end_date}
          />

          <CouponDetailCategory category={coupon.category} />

          <Separator className="bg-purple-700" />

          <CouponDetailActions
            coupon={coupon}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
