
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useUsers } from "./UsersProvider";
import { useI18n } from "@/hooks/use-i18n";

export const UsersHeader = () => {
  const { setIsCreateModalOpen } = useUsers();
  const t = useI18n();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-purple-200">{(t("users_title") as any)}</h1>
        <p className="text-purple-400">{(t("users_subtitle") as any)}</p>
      </div>
      <Button
        onClick={() => setIsCreateModalOpen(true)}
        className="bg-purple-700 hover:bg-purple-600 text-purple-100 border border-purple-500 transition-colors"
      >
        <Plus className="h-4 w-4 mr-2" />
        {(t("new_user_button") as any)}
      </Button>
    </div>
  );
};
