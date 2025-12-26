
import { useState } from "react";
import { useI18n } from "@/hooks/use-i18n";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ActivityDetailModal } from "@/components/ActivityDetailModal";
import type { Activity } from "@/types/activity";
import { ActivityFilters } from "@/components/activity/ActivityFilters";
import { ActivityList } from "@/components/activity/ActivityList";
import { ActivityProvider, useActivities } from "@/components/activity/ActivityProvider";
import { Skeleton } from "@/components/ui/skeleton";

const ActivityLogContent = () => {
  const { activities, isLoading } = useActivities();
  const t = useI18n();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredActivities = (activities || []).filter(activity => {
    const matchesSearch = activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || activity.category === categoryFilter;
    const matchesUser = userFilter === "all" || activity.user === userFilter;

    return matchesSearch && matchesCategory && matchesUser;
  });

  const uniqueUsers = [...new Set((activities || []).map(a => a.user))];
  const uniqueCategories = [...new Set((activities || []).map(a => a.category))];

  const handleViewDetails = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-200">{t("activity_log_title")}</h1>
          <p className="text-purple-400">{t("activity_log_subtitle")}</p>
        </div>
      </div>

      <Card className="bg-gray-700 border-purple-700">
        <CardHeader>
          <ActivityFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            userFilter={userFilter}
            setUserFilter={setUserFilter}
            uniqueCategories={uniqueCategories}
            uniqueUsers={uniqueUsers}
          />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : (
            <ActivityList
              activities={filteredActivities}
              onViewDetails={handleViewDetails}
            />
          )}
        </CardContent>
      </Card>

      {selectedActivity && (
        <ActivityDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          activity={selectedActivity}
        />
      )}
    </div>
  );
};

export const ActivityLog = () => {
  return (
    <ActivityProvider>
      <ActivityLogContent />
    </ActivityProvider>
  )
}
