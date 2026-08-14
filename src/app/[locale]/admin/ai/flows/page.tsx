import { AdminShell } from "@/components/admin/AdminShell";
import { FlowBuilderClient } from "@/components/admin/FlowBuilderClient";

export default function Page() {
  return (
    <AdminShell>
      <FlowBuilderClient />
    </AdminShell>
  );
}
