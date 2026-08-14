"use client";

import { useEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import {
  Activity,
  BadgeCheck,
  IndianRupee,
  Mail,
  ShieldAlert,
  Users,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { rupees } from "@/lib/billing/gst";
import { cn } from "@/lib/utils";
import type { MessagePoint, RevenuePoint, SignupPoint } from "@/components/admin/admin-chart-types";

const CHART_H = { revenue: 148, signup: 88, messages: 96, ring: 108 } as const;

function ChartSkeleton({ className }: { className?: string }) {
  return <div className={cn("admin-chart-skeleton h-full w-full rounded-xl", className)} aria-hidden />;
}

function ChartSlot({
  height,
  width,
  ready,
  children,
}: {
  height: number;
  width?: number | string;
  ready: boolean;
  children: ReactNode;
}) {
  return (
    <div className="relative min-w-0 overflow-hidden" style={{ height, width: width ?? "100%" }}>
      <div className="absolute inset-0">{ready ? children : <ChartSkeleton />}</div>
    </div>
  );
}

const AdminRevenueChart = dynamic(
  () => import("@/components/admin/AdminCharts").then((m) => m.AdminRevenueChart),
  { ssr: false, loading: () => <ChartSkeleton /> }
);
const AdminSignupBars = dynamic(
  () => import("@/components/admin/AdminCharts").then((m) => m.AdminSignupBars),
  { ssr: false, loading: () => <ChartSkeleton /> }
);
const AdminMessageBars = dynamic(
  () => import("@/components/admin/AdminCharts").then((m) => m.AdminMessageBars),
  { ssr: false, loading: () => <ChartSkeleton /> }
);
const AdminProviderRing = dynamic(
  () => import("@/components/admin/AdminCharts").then((m) => m.AdminProviderRing),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

type Overview = {
  ok?: boolean;
  error?: string;
  canFinance?: boolean;
  customers?: number;
  customersToday?: number;
  astrologersActive?: number;
  astrologersInactive?: number;
  staff?: number;
  todayPayments?: number | null;
  todayRevenueMinor?: number | null;
  pendingRefunds?: number | null;
  pendingWhatsapp?: number;
  providersEnabled?: number;
  providersTotal?: number;
  todayMessages?: number;
  dbOk?: boolean;
  revenueSeries?: RevenuePoint[];
  signupSeries?: SignupPoint[];
  messageSeries?: MessagePoint[];
};

export function AdminDashboardClient() {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    void import("@/components/admin/AdminCharts");
    (async () => {
      try {
        const res = await fetch("/api/admin/overview", { cache: "no-store" });
        const json = (await res.json()) as Overview;
        if (!json.ok) {
          setError(json.error || "Failed to load dashboard");
          return;
        }
        setData(json);
      } catch {
        setError("Failed to load dashboard");
      }
    })();
  }, []);

  const pendingAstro = data?.astrologersInactive || 0;
  const canFinance = Boolean(data?.canFinance);
  const pendingRefunds = canFinance ? data?.pendingRefunds || 0 : 0;
  const pendingWa = data?.pendingWhatsapp || 0;
  const pending = pendingAstro + pendingRefunds + pendingWa;
  const series = data?.revenueSeries || [];
  const yesterdayPoint = series.length > 1 ? series[series.length - 2] : null;
  const todayRevenue = canFinance ? data?.todayRevenueMinor || 0 : 0;
  const showRevenueDelta =
    yesterdayPoint != null &&
    (todayRevenue > 0 || yesterdayPoint.revenueMinor > 0) &&
    todayRevenue !== yesterdayPoint.revenueMinor;
  const revenueDeltaFixed = showRevenueDelta ? todayRevenue - yesterdayPoint!.revenueMinor : 0;
  const customersToday = data?.customersToday || 0;
  const healthProblem = data != null && data.dbOk === false;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--admin-accent)]">
          Overview
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-white sm:text-[1.85rem]">
          Dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted">
          Live counts from billing customers, astrologers, captured payments, refunds, and the
          comms send log. Vault, billing, and template engines are unchanged.
        </p>
      </header>
      {error ? <p className="text-sm text-cosmic-pink">{error}</p> : null}

      <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-3">
        {!data || canFinance ? (
        <Link
          href="/admin/transactions"
          className="admin-card-elevated admin-dash-card min-w-0 rounded-2xl p-5 min-[480px]:col-span-2"
        >
          <div className="flex min-w-0 items-start gap-3">
            <span className="admin-metric-badge tone-success bg-emerald-500/15 text-emerald-400">
              <IndianRupee className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Today&apos;s revenue
              </p>
              <p className="mt-1 min-h-[2.25rem] break-words font-display text-3xl text-white">
                {data ? <span className="admin-num-in">{rupees(todayRevenue)}</span> : "…"}
              </p>
              <p className="mt-1 min-h-4 text-xs text-ink-muted">
                {data ? `${data.todayPayments || 0} captured payments today` : "Loading…"}
              </p>
              {showRevenueDelta ? (
                <p
                  className={cn(
                    "mt-1 text-xs font-medium",
                    revenueDeltaFixed > 0 ? "text-emerald-400" : "text-rose-400"
                  )}
                >
                  {revenueDeltaFixed > 0 ? "+" : "−"}
                  {rupees(Math.abs(revenueDeltaFixed))} vs yesterday
                </p>
              ) : null}
            </div>
          </div>
          <div className="mt-4 min-w-0">
            <p className="mb-1 text-[11px] uppercase tracking-wide text-ink-muted">
              Captured revenue · last 14 days
            </p>
            <ChartSlot height={CHART_H.revenue} ready={Boolean(data)}>
              <AdminRevenueChart series={series} />
            </ChartSlot>
          </div>
        </Link>
        ) : (
          <div className="admin-card-elevated admin-dash-card min-w-0 rounded-2xl p-5 min-[480px]:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Today&apos;s revenue
            </p>
            <p className="mt-2 font-display text-2xl text-white">Restricted</p>
            <p className="mt-1 text-sm text-ink-muted">
              Finance role required. Support cannot read payment totals.
            </p>
          </div>
        )}

        <Link href="/admin/users" className="surface-panel admin-dash-card min-w-0 p-5">
          <div className="flex items-start justify-between gap-3">
            <p className="min-w-0 text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Active users
            </p>
            <span className="admin-metric-badge tone-info bg-sky-500/15 text-sky-400">
              <Users className="h-5 w-5" aria-hidden />
            </span>
          </div>
          <p className="mt-3 min-h-[2rem] break-words font-display text-2xl text-white">
            {data ? <span className="admin-num-in">{String(data.customers || 0)}</span> : "…"}
          </p>
          <p className="mt-1 min-h-4 text-xs font-medium text-emerald-400">
            {customersToday > 0 ? `+${customersToday} today` : "\u00a0"}
          </p>
          <p className="mt-2 text-[11px] uppercase tracking-wide text-ink-muted">
            New customers · 14 days
          </p>
          <ChartSlot height={CHART_H.signup} ready={Boolean(data)}>
            <AdminSignupBars series={data?.signupSeries || []} />
          </ChartSlot>
        </Link>

        <Link href="/admin/astrologers" className="surface-panel admin-dash-card min-w-0 p-5">
          <div className="flex items-start justify-between gap-3">
            <p className="min-w-0 text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Active astrologers
            </p>
            <span className="admin-metric-badge tone-accent bg-[rgba(125,82,255,0.18)] text-[var(--admin-accent)]">
              <BadgeCheck className="h-5 w-5" aria-hidden />
            </span>
          </div>
          <p className="mt-3 min-h-[2rem] break-words font-display text-2xl text-white">
            {data ? (
              <span className="admin-num-in">{String(data.astrologersActive || 0)}</span>
            ) : (
              "…"
            )}
          </p>
          <div className="mt-4 space-y-2">
            <StatusDot tone="green" label="Active" value={data ? data.astrologersActive || 0 : null} />
            <StatusDot tone="amber" label="Pending" value={data ? pendingAstro : null} />
            <p className="text-[11px] text-ink-muted">
              Presence (online/offline) is not tracked yet — dots are active vs inactive partner
              rows.
            </p>
          </div>
        </Link>

        <Link
          href="/admin/astrologers"
          className="surface-panel admin-dash-card admin-status-card min-w-0 p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="min-w-0 text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Pending verifications
            </p>
            <span
              className={cn(
                "admin-metric-badge",
                pending > 0 ? "tone-warning bg-amber-500/15 text-amber-400" : "tone-muted bg-white/10 text-ink-muted"
              )}
            >
              <ShieldAlert className="h-5 w-5" aria-hidden />
            </span>
          </div>
          <p className="mt-3 min-h-[2rem] break-words font-display text-2xl text-white">
            {data ? <span className="admin-num-in">{String(pending)}</span> : "…"}
          </p>
          <div className="mt-4 space-y-2">
            <StatusRow label="Inactive astrologers" n={pendingAstro} max={Math.max(pending, 1)} tone="amber" />
            <StatusRow
              label="Open refunds"
              n={canFinance ? pendingRefunds : 0}
              max={Math.max(pending, 1)}
              tone="rose"
            />
            <StatusRow label="WA templates" n={pendingWa} max={Math.max(pending, 1)} tone="violet" />
          </div>
        </Link>

        <Link
          href="/admin/health"
          className="surface-panel admin-dash-card admin-status-card admin-status-card-health min-w-0 p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="min-w-0 text-xs font-semibold uppercase tracking-wide text-ink-muted">
              System health
            </p>
            <span
              className={cn(
                "admin-metric-badge",
                healthProblem ? "tone-danger bg-rose-500/15 text-rose-400" : "tone-success bg-emerald-500/15 text-emerald-400"
              )}
            >
              <Activity className="h-5 w-5" aria-hidden />
            </span>
          </div>
          <div className="mt-3 flex min-w-0 flex-wrap items-center gap-4">
            <ChartSlot
              height={CHART_H.ring}
              width={CHART_H.ring}
              ready={Boolean(data)}
            >
              <AdminProviderRing
                enabled={data?.providersEnabled || 0}
                total={data?.providersTotal || 0}
              />
            </ChartSlot>
            <div className="min-w-0">
              <p className="break-words text-sm text-white">
                {data?.dbOk ? "Database reachable" : data ? "Query failed" : "Loading…"}
              </p>
              <p className="mt-1 text-xs text-ink-muted">
                {data?.dbOk
                  ? `${data.providersEnabled}/${data.providersTotal} providers enabled`
                  : "Waiting on overview query"}
              </p>
            </div>
          </div>
        </Link>

        <Link href="/admin/comms/log" className="surface-panel admin-dash-card min-w-0 p-5">
          <div className="flex items-start justify-between gap-3">
            <p className="min-w-0 text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Messages today
            </p>
            <span className="admin-metric-badge tone-accent bg-[rgba(125,82,255,0.18)] text-[var(--admin-accent)]">
              <Mail className="h-5 w-5" aria-hidden />
            </span>
          </div>
          <p className="mt-3 min-h-[2rem] break-words font-display text-2xl text-white">
            {data ? <span className="admin-num-in">{String(data.todayMessages || 0)}</span> : "…"}
          </p>
          <p className="mt-2 text-[11px] uppercase tracking-wide text-ink-muted">
            By channel · last 7 days
          </p>
          <ChartSlot height={CHART_H.messages} ready={Boolean(data)}>
            <AdminMessageBars series={data?.messageSeries || []} />
          </ChartSlot>
          <p className="mt-2 flex flex-wrap gap-3 text-[11px] text-ink-muted">
            <span className="inline-flex items-center gap-1">
              <i className="h-2 w-2 rounded-full bg-[#7d52ff]" aria-hidden /> Email
            </span>
            <span className="inline-flex items-center gap-1">
              <i className="h-2 w-2 rounded-full bg-[#ff8a3d]" aria-hidden /> SMS
            </span>
            <span className="inline-flex items-center gap-1">
              <i className="h-2 w-2 rounded-full bg-[#22c55e]" aria-hidden /> WhatsApp
            </span>
          </p>
        </Link>
      </div>
    </div>
  );
}

function StatusDot({
  tone,
  label,
  value,
}: {
  tone: "green" | "amber";
  label: string;
  value: number | null;
}) {
  return (
    <p className="flex min-h-11 items-center gap-2 text-sm text-white">
      <span
        className={cn(
          "h-2.5 w-2.5 shrink-0 rounded-full",
          tone === "green"
            ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]"
            : "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)]"
        )}
        aria-hidden
      />
      <span className="min-w-0 truncate text-ink-muted">{label}</span>
      <span className="ml-auto tabular-nums">{value == null ? "…" : value}</span>
    </p>
  );
}

function StatusRow({
  label,
  n,
  max,
  tone,
}: {
  label: string;
  n: number;
  max: number;
  tone: "amber" | "rose" | "violet";
}) {
  const pct = Math.min(100, (n / max) * 100);
  const bar =
    tone === "amber" ? "bg-amber-400" : tone === "rose" ? "bg-rose-400" : "bg-[var(--admin-accent)]";
  return (
    <div className="min-w-0">
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="min-w-0 truncate text-ink-muted">{label}</span>
        <span className="shrink-0 tabular-nums text-white">{n}</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className={cn("h-full rounded-full", bar)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
