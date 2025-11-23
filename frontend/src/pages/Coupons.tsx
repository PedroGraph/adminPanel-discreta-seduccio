
import { CouponsProvider } from "@/components/coupons/CouponsProvider";
import { CouponsHeader } from "@/components/coupons/CouponsHeader";
import { CouponsContent } from "@/components/coupons/CouponsContent";

export const Coupons = () => {
  return (
    <CouponsProvider>
      <div className="space-y-6 p-6">
        <CouponsHeader />
        <CouponsContent />
      </div>
    </CouponsProvider>
  );
};
