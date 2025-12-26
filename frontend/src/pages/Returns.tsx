import { ReturnsProvider } from "@/components/returns/ReturnsProvider";
import { ReturnsContent } from "@/components/returns/ReturnsContent";
import { useI18n } from "@/hooks/use-i18n";

const Returns = () => {
  const t = useI18n();
  return (
    <ReturnsProvider>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-purple-100">{t("returns_title")}</h1>
        </div>

        <ReturnsContent />
      </div>
    </ReturnsProvider>
  );
};

export default Returns;
