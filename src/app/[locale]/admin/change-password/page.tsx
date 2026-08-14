"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminChangePasswordPage() {
  return (
    <AdminShell>
      <ChangePasswordForm />
    </AdminShell>
  );
}

function ChangePasswordForm() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("New passwords do not match.");
      return;
    }
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "change-password",
        currentPassword,
        password,
      }),
    });
    const data = await res.json();
    setBusy(false);
    if (!data.ok) {
      setError(data.error || "Could not change password");
      return;
    }
    router.replace("/admin");
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <header>
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-saffron-deep">
          Required
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-white">
          Change your password
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          The bootstrap Super Admin password must be rotated before the vault
          can be used. This is enforced by the API, not just a note.
        </p>
      </header>
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block text-sm text-ink-muted">
          Current password
          <input
            className="field mt-1"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </label>
        <label className="block text-sm text-ink-muted">
          New password (min 12 characters)
          <input
            className="field mt-1"
            type="password"
            autoComplete="new-password"
            minLength={12}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label className="block text-sm text-ink-muted">
          Confirm new password
          <input
            className="field mt-1"
            type="password"
            autoComplete="new-password"
            minLength={12}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </label>
        {error ? <p className="text-sm text-cosmic-pink">{error}</p> : null}
        <button type="submit" className="btn-grad min-h-11 w-full px-4 text-sm" disabled={busy}>
          {busy ? "Saving…" : "Update password"}
        </button>
      </form>
    </div>
  );
}
