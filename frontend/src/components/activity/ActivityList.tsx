
import type { Activity } from "@/types/activity";
import { ActivityLogItem } from "./ActivityLogItem";

interface ActivityListProps {
  activities: Activity[];
  onViewDetails: (activity: Activity) => void;
}

export const ActivityList = ({ activities, onViewDetails }: ActivityListProps) => {
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
        <p className="text-center text-purple-400 py-4">No hay actividades que coincidan con los filtros seleccionados.</p>
      )}
    </div>
  );
};
