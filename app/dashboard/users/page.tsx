import { getUsers } from "@/app/actions/user-actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import UserTable from "./UserTable";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import UserFormDialog from "./UserFormDialog";

export default async function UsersPage() {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  const users = await getUsers();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-heading font-bold">User Management</h1>
          </div>
          <p className="text-sm text-muted-foreground">{users.length} user terdaftar dalam sistem</p>
        </div>
        <UserFormDialog>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> Tambah User Baru
          </Button>
        </UserFormDialog>
      </div>

      <UserTable users={users} />
    </div>
  );
}
