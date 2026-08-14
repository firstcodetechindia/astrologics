"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export default function AdminLoginPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/session", { cache: "no-store" });
      const data = await res.json();
      if (data.needsSetup) {
        router.replace("/admin/setup");
        return;
      }
      if (data.staff) {
        router.replace("/admin");
        return;
      }
      setReady(true);
    })();
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-ink-muted">
        Loading…
      </div>
    );
  }

  return <AdminLoginForm mode="login" />;
}
