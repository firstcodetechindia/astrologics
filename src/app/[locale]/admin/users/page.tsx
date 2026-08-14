import { AdminShell } from "@/components/admin/AdminShell";
import { AdminUsersClient } from "@/components/admin/AdminPeopleHealth";

export default function Page() {
  return (
    <AdminShell>
      <AdminUsersClient />
    </AdminShell>
  );
}
