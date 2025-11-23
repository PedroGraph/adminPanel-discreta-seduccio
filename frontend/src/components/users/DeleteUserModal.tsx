
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useUsers } from "./UsersProvider";
import { useI18n } from "@/hooks/use-i18n";

export const DeleteUserModal = () => {
  const t = useI18n();
  const {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedUser,
    deleteUser,
    setSelectedUser
  } = useUsers();

  const handleDelete = () => {
    if (selectedUser) {
      deleteUser(selectedUser.id);
      setSelectedUser(null);
      setIsDeleteModalOpen(false);
    }
  };

  const handleCancel = () => {
    setSelectedUser(null);
    setIsDeleteModalOpen(false);
  };

  return (
    <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
      <AlertDialogContent className="bg-gray-800 border-red-700 text-purple-100">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-400">
            {(t("user_delete") as any).title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-purple-300">
            {(t("user_delete") as any).subtitle}{" "}
            <span className="font-semibold text-purple-100">
              {selectedUser?.name}
            </span>{" "}

          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={handleCancel}
            className="border-purple-600 text-purple-300 hover:bg-purple-900"
          >
            {(t("user_delete") as any).cancel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-700 hover:bg-red-600 text-white"
          >
            {(t("user_delete") as any).delete}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
