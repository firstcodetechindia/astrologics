"use client";

import { useEffect, useState } from "react";

export default function AdminSettingsInner() {
  const [data, setData] = useState<{
    flags?: { key: string; enabled: boolean; updated_at: string }[];
    auth0?: { flag: boolean; credentialsConfigured: boolean; activePath: string };
  } | null>(null);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/admin/flags", { cache: "no-store" });
    const json = await res.json();
    if (!json.ok) {
      setError(json.error || "Failed");
      return;
    }
    setData(json);
  }

  useEffect(() => {
    void load();
  }, []);

  async function toggle(key: string, enabled: boolean) {
    const res = await fetch("/api/admin/flags", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, enabled }),
    });
    const json = await res.json();
    if (!json.ok) {
      setError(json.error || "Failed");
      return;
    }
    await load();
  }

  return (
    <div className="max-w-2xl space-y-4">
      <header>
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-saffron-deep">
          Feature flags
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-white">Runtime switches</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Auth0 stays off until credentials are in the vault and you explicitly enable it.
        </p>
      </header>
      {error ? <p className="text-sm text-cosmic-pink">{error}</p> : null}
      <VaultBackupCard />
      {data?.auth0 ? (
        <p className="text-sm text-ink-muted">
          Current user login path: <span className="text-white">{data.auth0.activePath}</span>
        </p>
      ) : null}
      <ul className="space-y-3">
        {(data?.flags || []).map((f) => (
          <li key={f.key} className="surface-panel flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="font-mono text-sm text-white">{f.key}</p>
              <p className="text-xs text-ink-muted">
                {f.enabled ? "ON" : "OFF"} · updated {new Date(f.updated_at).toLocaleString()}
              </p>
            </div>
            <button
              type="button"
              className="btn-secondary-cosmic min-h-11 px-3 text-sm"
              onClick={() => void toggle(f.key, !f.enabled)}
            >
              {f.enabled ? "Disable" : "Enable"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function VaultBackupCard() {
  const [passphrase, setPassphrase] = useState("");
  const [status, setStatus] = useState<Record<string, unknown> | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/vault/backup", { cache: "no-store" });
      const json = await res.json();
      if (json.ok) setStatus(json.status);
    })();
  }, []);

  async function downloadBackup() {
    setMsg("");
    const res = await fetch("/api/admin/vault/backup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passphrase }),
    });
    const json = await res.json();
    if (!json.ok) {
      setMsg(json.error || "Backup failed");
      return;
    }
    const blob = new Blob([JSON.stringify(json.backup, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cosmicgyan-kek-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setPassphrase("");
    setMsg("Backup file downloaded. Store it offline (1Password / printed / USB). The passphrase is not saved on the server.");
    const refresh = await fetch("/api/admin/vault/backup", { cache: "no-store" });
    const next = await refresh.json();
    if (next.ok) setStatus(next.status);
  }

  return (
    <section className="surface-panel space-y-3 p-4">
      <h2 className="text-base font-semibold text-white">Vault wrapping key (KEK) backup</h2>
      <p className="text-sm text-ink-muted">
        If <code className="text-white">SECRETS_WRAP_KEY</code> is lost, every vendor secret is
        unrecoverable. Download a passphrase-wrapped copy and keep it offline before any
        production keys go in the vault.
      </p>
      {status ? (
        <p className="text-xs text-ink-muted">
          Source: {String(status.source)} · fingerprint {String(status.fingerprint).slice(0, 12)}…
          {status.backupRecorded ? " · backup recorded" : " · no backup recorded yet"}
        </p>
      ) : null}
      <label className="block text-sm text-ink-muted">
        Backup passphrase (min 16 characters — not stored)
        <input
          className="field mt-1"
          type="password"
          minLength={16}
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
        />
      </label>
      <button type="button" className="btn-grad min-h-11 px-4 text-sm" onClick={() => void downloadBackup()}>
        Download encrypted KEK backup
      </button>
      {msg ? <p className="text-sm text-ink-muted">{msg}</p> : null}
    </section>
  );
}
