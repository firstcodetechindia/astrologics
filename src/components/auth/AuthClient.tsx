"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHero } from "@/components/ui/PageHero";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * Placeholder auth UI — full signup/login wiring comes next.
 * Chat redirects here after 3 free questions.
 */
export function AuthClient() {
  const locale = useLocale();
  const hi = locale === "hi";
  const search = useSearchParams();
  const next = search.get("next") || "/chat";
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [note, setNote] = useState<string | null>(null);

  const title = useMemo(
    () =>
      mode === "login"
        ? hi
          ? "लॉगिन"
          : "Login"
        : hi
          ? "साइन अप"
          : "Sign up",
    [mode, hi]
  );

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNote(
      hi
        ? "अकाउंट सिस्टम जल्द आ रहा है। अभी यह स्क्रीन प्लेसहोल्डर है।"
        : "Account system is coming next. This screen is a placeholder for now."
    );
  }

  return (
    <div className="bg-[#faf8f5]">
      <PageHero
        title={title}
        description={
          hi
            ? "मुफ़्त प्रश्न पूरे होने के बाद चैट जारी रखने के लिए अकाउंट बनाएँ।"
            : "Create an account to keep chatting after your free questions."
        }
        crumbs={[
          { label: hi ? "होम" : "Home", href: "/" },
          { label: hi ? "एआई चैट" : "AI Chat", href: "/chat" },
          { label: title },
        ]}
      />

      <div className="container-page max-w-md py-8">
        <GlassCard strong className="space-y-5">
          <div className="inline-flex rounded-xl border border-saffron/25 bg-white p-1">
            {(
              [
                { id: "signup" as const, label: hi ? "साइन अप" : "Sign up" },
                { id: "login" as const, label: hi ? "लॉगिन" : "Login" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setMode(t.id);
                  setNote(null);
                }}
                className={cn(
                  "rounded-lg px-4 py-1.5 text-[12px] font-semibold transition",
                  mode === t.id
                    ? "bg-gradient-to-r from-saffron to-maroon text-white"
                    : "text-ink-muted hover:bg-[#fff1e6]"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-saffron-deep">
            <Sparkles className="h-3.5 w-3.5" />
            {hi ? "जल्द आ रहा है" : "Coming next"}
          </p>

          <form className="space-y-3" onSubmit={onSubmit}>
            {mode === "signup" ? (
              <input
                className="w-full rounded-xl border border-saffron/25 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-saffron/20"
                placeholder={hi ? "नाम" : "Name"}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            ) : null}
            <input
              type="email"
              required
              className="w-full rounded-xl border border-saffron/25 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-saffron/20"
              placeholder={hi ? "ईमेल" : "Email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              required
              minLength={6}
              className="w-full rounded-xl border border-saffron/25 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-saffron/20"
              placeholder={hi ? "पासवर्ड" : "Password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {note ? (
              <p className="rounded-xl border border-saffron/20 bg-sand/50 px-3 py-2 text-sm text-saffron-deep">
                {note}
              </p>
            ) : null}

            <Button type="submit" className="w-full !py-3">
              {mode === "login"
                ? hi
                  ? "लॉगिन"
                  : "Login"
                : hi
                  ? "अकाउंट बनाएँ"
                  : "Create account"}
            </Button>
          </form>

          <p className="text-center text-[12px] text-ink-muted">
            <Link href={next} className="font-semibold text-saffron-deep hover:underline">
              {hi ? "← चैट पर वापस" : "← Back to chat"}
            </Link>
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
