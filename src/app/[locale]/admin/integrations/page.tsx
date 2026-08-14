import { AdminShell } from "@/components/admin/AdminShell";
import { IntegrationsClient } from "@/components/admin/IntegrationsClient";

export default function AdminIntegrationsPage() {
  return (
    <AdminShell>
      <IntegrationsClient />
    </AdminShell>
  );
}
