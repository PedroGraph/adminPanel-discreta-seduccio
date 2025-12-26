import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Activity } from "@/types/activity";
import { useLanguage } from "@/contexts/LanguageContext";
import { useI18n } from "@/hooks/use-i18n";

interface ActivityLogItemProps {
  activity: Activity;
  onViewDetails: (activity: Activity) => void;
}

const getLevelBackgroundClasses = (level: Activity["level"]) => {
  switch (level) {
    case "ERROR":
      return "bg-red-900/40 hover:bg-red-900/60";
    case "WARN":
      return "bg-yellow-800/30 hover:bg-yellow-800/50";
    case "INFO":
    default:
      return "hover:bg-gray-800";
  }
};

export const ActivityLogItem = ({ activity, onViewDetails }: ActivityLogItemProps) => {
  const IconComponent = activity.icon;
  const { language } = useLanguage();
  const t = useI18n();
  const header = t("activity_log_header") as any;
  const dateLocale = language === 'es' ? es : enUS;

  const dateFormat = language === 'es'
    ? "d 'de' MMMM 'de' yyyy - HH:mm"
    : "MMMM d, yyyy - HH:mm";

  const formattedTimestamp = format(new Date(activity.timestamp), dateFormat, { locale: dateLocale });

  return (
    <div
      key={activity.id}
      className={`flex items-start space-x-4 p-4 rounded-lg border border-white/20 transition-colors cursor-pointer ${getLevelBackgroundClasses(activity.level)}`}
      onClick={() => onViewDetails(activity)}
    >
      <div className="mt-1 p-2 rounded-full bg-black/20">
        <IconComponent className={`h-4 w-4 ${activity.level === "ERROR" ? "text-red-400" :
          activity.level === "WARN" ? "text-yellow-400" :
            "text-purple-400"
          }`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <span className="font-medium text-purple-100">{activity.user}</span>
            <span className="text-muted-foreground mx-1">{activity.action}</span>
            <span className="font-medium text-purple-100 break-words">{activity.target}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(activity);
            }}
            className="text-purple-400 hover:text-purple-200 flex-shrink-0 hidden sm:flex"
            title={header.details}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2 mt-2 flex-wrap">
          <span className="text-sm text-purple-500">{formattedTimestamp}</span>
        </div>
      </div>
    </div>
  );
};
