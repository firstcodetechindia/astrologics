import { AdminComingSoon, AdminShell } from "@/components/admin/AdminShell";

export default function Page() {
  return (
    <AdminShell>
      <AdminComingSoon
        title="Blog / Learn / FAQ"
        phase="Product"
        detail="Public Learn/Blog pages already exist on the site. CMS editing in Super Admin is not in Phases 1–3."
      />
    </AdminShell>
  );
}
