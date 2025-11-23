
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UsersFilters } from "./UsersFilters";
import { UsersTable } from "./UsersTable";
import { CreateUserModal } from "./CreateUserModal";
import { UserDetailModal } from "./UserDetailModal";
import { DeleteUserModal } from "./DeleteUserModal";
import { EditUserModal } from "./EditUserModal";

export const UsersContent = () => {
  return (
    <>
      <Card className="bg-gray-700 border-purple-700">
        <CardHeader>
          <UsersFilters />
        </CardHeader>
        <CardContent>
          <UsersTable />
        </CardContent>
      </Card>
      
      <CreateUserModal />
      <UserDetailModal />
      <EditUserModal />
      <DeleteUserModal />
    </>
  );
};
