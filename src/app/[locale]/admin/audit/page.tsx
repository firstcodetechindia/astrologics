import { AdminShell } from "@/components/admin/AdminShell";
import { AuditLogClient } from "@/components/admin/AuditLogClient";

export default function AdminAuditPage() {
  return (
    <AdminShell>
      <AuditLogClient />
    </AdminShell>
  );
}
