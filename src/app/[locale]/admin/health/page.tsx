import { AdminShell } from "@/components/admin/AdminShell";
import { AdminHealthClient } from "@/components/admin/AdminPeopleHealth";

export default function Page() {
  return (
    <AdminShell>
      <AdminHealthClient />
    </AdminShell>
  );
}
