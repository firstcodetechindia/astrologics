import { AdminShell } from "@/components/admin/AdminShell";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export default function AdminHomePage() {
  return (
    <AdminShell>
      <AdminDashboardClient />
    </AdminShell>
  );
}
