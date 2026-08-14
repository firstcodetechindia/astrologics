import { AdminShell } from "@/components/admin/AdminShell";
import { AdminAstrologersClient } from "@/components/admin/AdminPeopleHealth";

export default function Page() {
  return (
    <AdminShell>
      <AdminAstrologersClient />
    </AdminShell>
  );
}
