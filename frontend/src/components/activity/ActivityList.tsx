import { useI18n } from "@/hooks/use-i18n";
import type { Activity } from "@/types/activity";
import { ActivityLogItem } from "./ActivityLogItem";

interface ActivityListProps {
  activities: Activity[];
  onViewDetails: (activity: Activity) => void;
}

export const ActivityList = ({ activities, onViewDetails }: ActivityListProps) => {
  const t = useI18n();

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <ActivityLogItem
          key={activity.id}
          activity={activity}
          onViewDetails={onViewDetails}
        />
      ))}
      {activities.length === 0 && (
        <p className="text-center text-purple-400 py-4">{t("no_activity")}</p>
      )}
    </div>
  );
};
