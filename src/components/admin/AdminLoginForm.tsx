"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site-config";

export function AdminLoginForm({ mode }: { mode: "login" | "setup" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("Super Admin");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: mode === "setup" ? "setup" : "login",
        email,
        password,
        displayName,
      }),
    });
    const data = (await res.json()) as { ok: boolean; error?: string };
    setBusy(false);
    if (!data.ok) {
      setError(data.error || "Failed");
      return;
    }
    router.replace("/admin/integrations");
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-saffron-deep">
        Super Admin
      </p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-white">
        {mode === "setup" ? "Create the first Super Admin" : `Sign in to ${siteConfig.brandName}`}
      </h1>
      <p className="mt-2 text-sm text-ink-muted">
        {mode === "setup"
          ? "This account is stored in the database with a scrypt password hash — not in .env. Auth0 stays off until you paste credentials and flip the flag."
          : "Staff login for the control plane. User-facing login is still dummy OTP until Auth0 is enabled."}
      </p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {mode === "setup" ? (
          <label className="block text-sm text-ink-muted">
            Display name
            <input
              className="field mt-1"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              autoComplete="name"
            />
          </label>
        ) : null}
        <label className="block text-sm text-ink-muted">
          Email
          <input
            className="field mt-1"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label className="block text-sm text-ink-muted">
          Password
          <input
            className="field mt-1"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "setup" ? "new-password" : "current-password"}
            minLength={mode === "setup" ? 10 : 1}
            required
          />
        </label>
        {error ? <p className="text-sm text-cosmic-pink">{error}</p> : null}
        <button type="submit" className="btn-grad min-h-11 w-full px-4 text-sm font-medium" disabled={busy}>
          {busy ? "Please wait…" : mode === "setup" ? "Create Super Admin" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
