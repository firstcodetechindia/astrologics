"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BadgeCheck,
  BookOpen,
  Bot,
  Calculator,
  ClipboardList,
  CreditCard,
  FileText,
  Flag,
  IndianRupee,
  LayoutDashboard,
  Mail,
  Menu,
  MessagesSquare,
  Plug,
  Share2,
  Shield,
  Receipt,
  ScrollText,
  Sparkles,
  Undo2,
  Users,
  Wallet,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { canAccessAdminPath, NAV_PERMISSION } from "@/lib/platform/rbac";

type Staff = {
  id: string;
  email: string;
  displayName: string;
  role: string;
  mustChangePassword?: boolean;
  permissions?: string[];
};

type NavItem = { href: string; label: string; icon: LucideIcon; soon?: boolean };

type NavGroup = { id: string; label: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    id: "overview",
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    id: "people",
    label: "People",
    items: [
      { href: "/admin/users", label: "Users", icon: Users },
      { href: "/admin/astrologers", label: "Astrologers", icon: BadgeCheck },
      { href: "/admin/staff", label: "Staff / Roles", icon: Shield },
    ],
  },
  {
    id: "product",
    label: "Product & content",
    items: [
      { href: "/admin/settings", label: "Calculators / Flags", icon: Calculator },
      { href: "/admin/content", label: "Blog / Learn / FAQ", icon: BookOpen, soon: true },
      { href: "/admin/content/horoscope", label: "Horoscope / Banners", icon: Sparkles, soon: true },
    ],
  },
  {
    id: "money",
    label: "Money",
    items: [
      { href: "/admin/billing", label: "Billing & Plans", icon: CreditCard },
      { href: "/admin/transactions", label: "Transactions", icon: Receipt },
      { href: "/admin/wallets", label: "Wallets", icon: Wallet },
      { href: "/admin/payouts", label: "Commission & Payouts", icon: IndianRupee },
      { href: "/admin/refunds", label: "Refunds / Credit notes", icon: Undo2 },
      { href: "/admin/invoices", label: "GST Invoices", icon: FileText },
    ],
  },
  {
    id: "comms",
    label: "Communications",
    items: [
      { href: "/admin/comms", label: "Templates", icon: Mail },
      { href: "/admin/comms/automations", label: "Automations", icon: Zap },
      { href: "/admin/comms/log", label: "Send log", icon: ScrollText },
      { href: "/admin/social", label: "Social queue", icon: Share2 },
    ],
  },
  {
    id: "ai",
    label: "AI & Chat",
    items: [
      { href: "/admin/ai", label: "AI Agents / Personas", icon: Bot },
      { href: "/admin/ai/flows", label: "Chat Flow Builder", icon: Workflow },
      { href: "/admin/ai/logs", label: "Conversation Logs", icon: MessagesSquare },
    ],
  },
  {
    id: "system",
    label: "System",
    items: [
      { href: "/admin/integrations", label: "Integrations", icon: Plug },
      { href: "/admin/audit", label: "Audit log", icon: ClipboardList },
      { href: "/admin/settings", label: "Feature flags", icon: Flag },
      { href: "/admin/health", label: "System health", icon: Activity },
    ],
  },
];

function pathActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  if (href === "/admin/settings") {
    return pathname === "/admin/settings";
  }
  if (href === "/admin/content") {
    return pathname === "/admin/content";
  }
  if (href === "/admin/comms") {
    return pathname === "/admin/comms";
  }
  if (href === "/admin/ai") {
    return pathname === "/admin/ai";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [staff, setStaff] = useState<Staff | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/admin/session", { cache: "no-store" });
      const data = (await res.json()) as {
        ok: boolean;
        needsSetup?: boolean;
        staff?: Staff | null;
      };
      if (cancelled) return;
      if (data.needsSetup) {
        router.replace("/admin/setup");
        return;
      }
      if (!data.staff) {
        router.replace("/admin/login");
        return;
      }
      if (data.staff.mustChangePassword && pathname !== "/admin/change-password") {
        router.replace("/admin/change-password");
        return;
      }
      setStaff(data.staff);
    })();
    return () => {
      cancelled = true;
    };
  }, [router, pathname]);

  async function logout() {
    await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.replace("/admin/login");
  }

  return (
    <div className="admin-app flex min-h-dvh">
      {drawerOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/55 lg:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      ) : null}

      <aside
        className={cn(
          "admin-sidebar fixed inset-y-0 left-0 z-50 flex w-[min(18rem,85vw)] min-w-0 flex-col transition-transform lg:static lg:z-0 lg:translate-x-0",
          drawerOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
          <span className="admin-brand-mark flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white">
            <Sparkles className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="admin-nav-group">{staff?.role?.replaceAll("_", " ") || "Staff"}</p>
            <p className="mt-0.5 truncate text-sm font-semibold text-white">{siteConfig.brandName}</p>
          </div>
          <button
            type="button"
            className="ml-auto inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl text-white lg:hidden"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="min-h-0 flex-1 overflow-y-auto px-2 py-4">
          {NAV_GROUPS.map((group, index) => {
            const items = group.items.filter((item) => {
              const need = NAV_PERMISSION[item.href];
              if (!need) return true;
              return Boolean(staff?.permissions?.includes(need));
            });
            if (!staff || items.length === 0) return null;
            return (
            <details key={group.id} open className={cn("px-0", index > 0 && "mt-3 pt-3")}>
              <summary className="admin-nav-group flex min-h-11 cursor-pointer list-none items-center rounded-xl px-3 [&::-webkit-details-marker]:hidden">
                {group.label}
              </summary>
              <div className="mt-1 space-y-1 pb-2">
                {items.map((item) => {
                  const active = pathActive(pathname, item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={`${group.id}:${item.href}:${item.label}`}
                      href={item.href}
                      className={cn(
                        "admin-nav-item flex min-h-11 min-w-0 items-center justify-between gap-2 rounded-r-xl px-3 text-sm",
                        active && "is-active"
                      )}
                    >
                      <span className="flex min-w-0 items-center gap-2.5">
                        <Icon className="admin-nav-icon h-4 w-4 shrink-0" aria-hidden />
                        <span className="min-w-0 truncate">{item.label}</span>
                      </span>
                      {item.soon ? <span className="admin-soon-pill shrink-0">Soon</span> : null}
                    </Link>
                  );
                })}
              </div>
            </details>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="admin-topbar sticky top-0 z-30 flex items-center gap-2 px-3 py-3 sm:px-4">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <button
              type="button"
              className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white lg:hidden"
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <p className="min-w-0 truncate text-sm font-medium text-white">
              {siteConfig.brandName}
              <span className="hidden sm:inline"> control plane</span>
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <p className="max-w-[5.75rem] truncate text-xs text-ink-muted min-[400px]:max-w-[9rem] sm:max-w-[14rem]">
              {staff?.email || "\u00a0"}
            </p>
            <button
              type="button"
              onClick={() => void logout()}
              disabled={!staff}
              className="btn-secondary-cosmic min-h-11 shrink-0 px-3 text-sm disabled:opacity-50"
            >
              Sign out
            </button>
          </div>
        </header>
        <div className="min-w-0 flex-1 overflow-x-hidden px-4 py-6 sm:px-6 sm:py-8">
          {staff && !canAccessAdminPath(pathname, staff.permissions || []) ? (
            <div className="admin-card-elevated max-w-lg space-y-2 rounded-2xl p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-rose-200">
                Forbidden
              </p>
              <h1 className="font-display text-2xl font-semibold text-white">No permission</h1>
              <p className="text-sm text-ink-muted">
                Role <span className="text-white">{staff.role}</span> cannot open this screen.
                The matching API also returns 403.
              </p>
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}

export function AdminComingSoon({
  title,
  phase,
  detail,
}: {
  title: string;
  phase: string;
  detail: string;
}) {
  return (
    <div className="admin-card-elevated max-w-xl space-y-3 rounded-2xl p-5 sm:p-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--admin-accent)]">{phase}</p>
      <h1 className="font-display text-2xl font-semibold text-white">{title}</h1>
      <p className="text-sm text-ink-muted">{detail}</p>
      <span className="admin-soon-pill inline-flex">Soon</span>
    </div>
  );
}
