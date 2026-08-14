import { AdminShell } from "@/components/admin/AdminShell";
import { AiPersonasClient } from "@/components/admin/AiPersonasClient";

export default function Page() {
  return (
    <AdminShell>
      <AiPersonasClient />
    </AdminShell>
  );
}
