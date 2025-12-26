import { useI18n } from "@/hooks/use-i18n";
import { DollarSign } from "lucide-react";

interface CouponDetailDiscountProps {
  type: string;
  value: number;
  minOrder: number | null;
  maxDiscount: number | null;
}

export const CouponDetailDiscount = ({ type, value, minOrder, maxDiscount }: CouponDetailDiscountProps) => {
  const t = useI18n();
  const tr = t("coupon_detail") as any;
  const table = t("coupons_table") as any;

  const formatValue = (type: string, value: number) => {
    if (type === "percentage") return `${value}%`;
    if (type === "fixed") return `$${value}`;
    return table.free;
  };

  return (
    <div className="bg-gray-700 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-purple-200 mb-3 flex items-center">
        <DollarSign className="h-5 w-5 mr-2" />
        {tr.discount_section}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="text-purple-400">{tr.type}:</span>
          <p className="font-medium text-purple-100">
            {type === 'percentage' ? table.type_percentage :
              type === 'fixed' ? table.type_fixed : table.type_free_shipping}
          </p>
        </div>
        <div>
          <span className="text-purple-400">{tr.value}:</span>
          <p className="font-medium text-purple-100">{formatValue(type, value)}</p>
        </div>
        <div>
          <span className="text-purple-400">{tr.min_order}:</span>
          <p className="font-medium text-purple-100">${minOrder || 0}</p>
        </div>
        <div>
          <span className="text-purple-400">{tr.max_discount}:</span>
          <p className="font-medium text-purple-100">
            {maxDiscount ? `$${maxDiscount}` : tr.no_limit}
          </p>
        </div>
      </div>
    </div>
  );
};
