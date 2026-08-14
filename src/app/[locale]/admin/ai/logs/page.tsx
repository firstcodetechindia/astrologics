import { AdminShell } from "@/components/admin/AdminShell";
import { ConversationLogsClient } from "@/components/admin/ConversationLogsClient";

export default function Page() {
  return (
    <AdminShell>
      <ConversationLogsClient />
    </AdminShell>
  );
}
