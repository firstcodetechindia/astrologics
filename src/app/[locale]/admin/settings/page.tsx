import { AdminShell } from "@/components/admin/AdminShell";
import AdminSettingsInner from "./settings-inner";

export default function AdminSettingsPage() {
  return (
    <AdminShell>
      <AdminSettingsInner />
    </AdminShell>
  );
}
