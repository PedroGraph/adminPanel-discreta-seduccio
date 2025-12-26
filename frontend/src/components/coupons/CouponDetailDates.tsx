import { useI18n } from "@/hooks/use-i18n";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { useLanguage } from "@/contexts/LanguageContext";

interface CouponDetailDatesProps {
  startDate: string;
  endDate: string;
}

export const CouponDetailDates = ({ startDate, endDate }: CouponDetailDatesProps) => {
  const t = useI18n();
  const tr = t("coupon_detail") as any;
  const { language } = useLanguage();
  const dateLocale = language === 'es' ? es : enUS;

  return (
    <div className="bg-gray-700 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-purple-200 mb-3 flex items-center">
        <Calendar className="h-5 w-5 mr-2" />
        {tr.validity_section}
      </h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-purple-400">{tr.start_date}:</span>
          <p className="font-medium text-purple-100">
            {format(new Date(startDate), 'dd/MM/yyyy', { locale: dateLocale })}
          </p>
        </div>
        <div>
          <span className="text-purple-400">{tr.end_date}:</span>
          <p className="font-medium text-purple-100">
            {format(new Date(endDate), 'dd/MM/yyyy', { locale: dateLocale })}
          </p>
        </div>
      </div>
    </div>
  );
};
