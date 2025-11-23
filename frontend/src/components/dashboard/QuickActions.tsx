
import { Button } from "@/components/ui/button";
import { Plus, Percent, RotateCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/hooks/use-i18n";

export const QuickActions = () => {
  const navigate = useNavigate();
  const t = useI18n();

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <Button
        className="bg-purple-700 hover:bg-purple-600 border border-purple-500 text-purple-100"
        onClick={() => navigate("/products")}
      >
        <Plus className="mr-2" /> {t("new_product")}
      </Button>
      <Button
        className="bg-green-700 hover:bg-green-600 border border-green-500 text-green-100"
        onClick={() => navigate("/coupons")}
      >
        <Percent className="mr-2" /> {t("add_coupon")}
      </Button>
      <Button
        className="bg-orange-700 hover:bg-orange-600 border border-orange-500 text-orange-100"
        onClick={() => navigate("/returns")}
      >
        <RotateCw className="mr-2" /> {t("handle_returns")}
      </Button>
    </div>
  );
};
