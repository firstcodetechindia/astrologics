import { AdminShell } from "@/components/admin/AdminShell";
import { CommsAdminClient } from "@/components/admin/CommsAdminClient";

export default function Page() {
  return (
    <AdminShell>
      <CommsAdminClient section="templates" />
    </AdminShell>
  );
}
