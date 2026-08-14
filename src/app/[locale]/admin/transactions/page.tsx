import { AdminShell } from "@/components/admin/AdminShell";
import { BillingAdminClient } from "@/components/admin/BillingAdminClient";

export default function Page() {
  return (
    <AdminShell>
      <BillingAdminClient section="payments" />
    </AdminShell>
  );
}
