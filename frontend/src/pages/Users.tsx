
import { UsersProvider } from "@/components/users/UsersProvider";
import { UsersHeader } from "@/components/users/UsersHeader";
import { UsersContent } from "@/components/users/UsersContent";

export const Users = () => {
  return (
    <UsersProvider>
      <div className="space-y-6 p-6">
        <UsersHeader />
        <UsersContent />
      </div>
    </UsersProvider>
  );
};
