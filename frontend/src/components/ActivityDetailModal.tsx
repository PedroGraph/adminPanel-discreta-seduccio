import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Activity } from "@/types/activity";
import { useI18n } from "@/hooks/use-i18n";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";

interface ActivityDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Activity | null;
}

export const ActivityDetailModal = ({ isOpen, onClose, activity }: ActivityDetailModalProps) => {
  const t = useI18n();
  const { language } = useLanguage();
  const tr = t("activity_log_detail") as any;

  if (!activity) return null;

  const dateLocale = language === 'es' ? es : enUS;
  const dateFormat = language === 'es'
    ? "d 'de' MMMM 'de' yyyy - HH:mm:ss"
    : "MMMM d, yyyy - HH:mm:ss";

  const getLevelBadgeClasses = (level: Activity["level"]) => {
    switch (level) {
      case "ERROR":
        return "bg-red-600 text-white border-red-700";
      case "WARN":
        return "bg-yellow-500 text-black border-yellow-600";
      case "INFO":
      default:
        return "bg-blue-600 text-white border-blue-700";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-purple-700 text-purple-100 sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="text-purple-200">{tr.title}</DialogTitle>
          <DialogDescription className="text-purple-400">
            {t("activity_log_subtitle")}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4 text-sm">
          <div className="grid grid-cols-[120px_1fr] items-center gap-2">
            <span className="text-purple-400 font-medium">{tr.date}:</span>
            <span className="text-purple-100">{format(new Date(activity.timestamp), dateFormat, { locale: dateLocale })}</span>
          </div>
          <div className="grid grid-cols-[120px_1fr] items-center gap-2">
            <span className="text-purple-400 font-medium">{tr.user}:</span>
            <span className="text-purple-100">{activity.user}</span>
          </div>
          <div className="grid grid-cols-[120px_1fr] items-center gap-2">
            <span className="text-purple-400 font-medium">{tr.level}:</span>
            <Badge className={`text-xs ${getLevelBadgeClasses(activity.level)}`}>{activity.level}</Badge>
          </div>
          <div className="grid grid-cols-[120px_1fr] items-center gap-2">
            <span className="text-purple-400 font-medium">{tr.category}:</span>
            <Badge variant="outline" className="text-xs border-purple-700 text-purple-400 capitalize">{activity.category}</Badge>
          </div>
          <div className="grid grid-cols-[120px_1fr] items-start gap-2">
            <span className="text-purple-400 font-medium">{tr.action}:</span>
            <span className="text-purple-100">{activity.action} - <span className="font-semibold">{activity.target}</span></span>
          </div>

          <div className="mt-4">
            <h4 className="text-purple-300 font-semibold mb-2">{tr.metadata}:</h4>
            <div className="bg-gray-900 p-3 rounded-md border border-purple-600 max-h-40 overflow-y-auto">
              <pre className="text-purple-100 whitespace-pre-wrap text-xs">{activity.details}</pre>
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" className="border-purple-600 text-purple-300 hover:bg-purple-700 hover:text-purple-100">
              {t("close") || "Cerrar"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

