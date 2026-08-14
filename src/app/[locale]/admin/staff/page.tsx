import { AdminShell } from "@/components/admin/AdminShell";
import { StaffRolesClient } from "@/components/admin/StaffRolesClient";

export default function Page() {
  return (
    <AdminShell>
      <StaffRolesClient />
    </AdminShell>
  );
}
