import { AdminShell } from "@/components/admin/AdminShell";
import { SocialQueueClient } from "@/components/admin/SocialQueueClient";

export default function Page() {
  return (
    <AdminShell>
      <SocialQueueClient />
    </AdminShell>
  );
}
