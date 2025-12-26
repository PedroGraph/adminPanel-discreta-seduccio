import { useI18n } from "@/hooks/use-i18n";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const CouponsHeader = () => {
  const t = useI18n();
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-purple-200">{t("coupons_title")}</h1>
        <p className="text-purple-400">{t("coupons_subtitle")}</p>
      </div>
      <Button className="bg-purple-700 hover:bg-purple-600 text-purple-100 border border-purple-500 transition-colors">
        <Plus className="h-4 w-4 mr-2" />
        {t("new_coupon_button")}
      </Button>
    </div>
  );
};
