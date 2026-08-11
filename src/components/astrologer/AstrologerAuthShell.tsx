"use client";

import type { ReactNode } from "react";
import { useLocale } from "next-intl";
import { Check, Sparkles, Users, Wallet, Globe2, Shield } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { AstrologicsLogoWhite } from "@/components/brand/AstrologicsLogo";
import { siteConfig } from "@/lib/site-config";

const REASONS = [
  {
    icon: Users,
    en: "Grow with a modern audience",
    hi: "आधुनिक दर्शकों के साथ बढ़ें",
    enBody: "Reach seekers looking for clear, trustworthy astrology guidance.",
    hiBody: "स्पष्ट व भरोसेमंद ज्योतिष मार्गदर्शन चाहने वाले उपयोगकर्ताओं तक पहुँचें।",
  },
  {
    icon: Wallet,
    en: "Flexible earning paths",
    hi: "लचीले आय के रास्ते",
    enBody: "Chat, call and future live sessions — built for partner growth.",
    hiBody: "चैट, कॉल और भविष्य के लाइव सत्र — पार्टनर विकास के लिए।",
  },
  {
    icon: Globe2,
    en: "Multi-language presence",
    hi: "बहु-भाषी उपस्थिति",
    enBody: "Serve users in Hindi, English and regional languages.",
    hiBody: "हिंदी, अंग्रेज़ी व क्षेत्रीय भाषाओं में सेवा दें।",
  },
  {
    icon: Shield,
    en: "Verified partner trust",
    hi: "सत्यापित पार्टनर विश्वास",
    enBody: "Clear onboarding, fair policies and brand-backed credibility.",
    hiBody: "स्पष्ट ऑनबोर्डिंग, निष्पक्ष नीतियाँ और ब्रांड समर्थन।",
  },
] as const;

export function AstrologerAuthShell({
  mode,
  children,
}: {
  mode: "signup" | "signin";
  children: ReactNode;
}) {
  const locale = useLocale();
  const hi = locale === "hi";

  return (
    <div className="relative flex h-full min-h-0 w-full max-w-[100vw] flex-col overflow-x-hidden overflow-y-hidden bg-[#fff8f1] lg:flex-row">
      <aside className="relative hidden h-full w-[46%] shrink-0 overflow-hidden bg-[#F06A00] text-white lg:flex xl:w-[48%]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.22), transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.12), transparent 45%)",
          }}
        />

        <div className="relative z-10 flex h-full w-full flex-col px-8 py-8 xl:px-12">
          <Link href="/" className="inline-flex items-center gap-3">
            <AstrologicsLogoWhite className="h-11 w-11" />
            <span className="font-display text-xl font-semibold tracking-tight">
              {siteConfig.brandName}
            </span>
          </Link>

          <div className="mt-10 flex-1 overflow-y-auto pr-1">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90 ring-1 ring-white/20">
              <Sparkles className="h-3.5 w-3.5" />
              {hi ? "पार्टनर प्रोग्राम" : "Partner program"}
            </p>
            <h1 className="mt-4 max-w-md font-display text-[2rem] font-semibold leading-tight tracking-tight xl:text-[2.35rem]">
              {mode === "signup"
                ? hi
                  ? "Astrologics के साथ सत्यापित ज्योतिषी बनें"
                  : "Become a verified Astrologics astrologer"
                : hi
                  ? "ज्योतिषी पार्टनर पोर्टल में साइन इन करें"
                  : "Sign in to the astrologer partner portal"}
            </h1>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/85">
              {hi
                ? "ऑनलाइन उपस्थिति बढ़ाएँ, कौशल दिखाएँ, और आधुनिक उपयोगकर्ताओं को स्पष्ट मार्गदर्शन दें — हमारे ब्रांड थीम के साथ।"
                : "Grow your online presence, showcase your skills, and guide modern seekers — with our brand-first partner experience."}
            </p>

            <ul className="mt-8 space-y-3.5">
              {REASONS.map((item) => {
                const Icon = item.icon;
                return (
                  <li
                    key={item.en}
                    className="flex gap-3 rounded-2xl bg-white/10 p-3.5 ring-1 ring-white/15 backdrop-blur-[2px]"
                  >
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">
                        {hi ? item.hi : item.en}
                      </span>
                      <span className="mt-0.5 block text-[12.5px] leading-relaxed text-white/80">
                        {hi ? item.hiBody : item.enBody}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { n: "EN/HI", l: hi ? "भाषाएँ" : "Languages" },
                { n: "24/7", l: hi ? "सहायता" : "Support" },
                { n: "OTP", l: hi ? "सुरक्षित लॉगिन" : "Secure login" },
              ].map((stat) => (
                <div
                  key={stat.l}
                  className="rounded-xl bg-white/10 px-2 py-3 text-center ring-1 ring-white/15"
                >
                  <p className="font-display text-lg font-semibold">{stat.n}</p>
                  <p className="mt-0.5 text-[11px] text-white/75">{stat.l}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-4 flex items-center gap-2 text-[12px] text-white/70">
            <Check className="h-3.5 w-3.5" />
            {hi
              ? "आवेदन के बाद हमारी टीम सत्यापन करेगी।"
              : "Our team reviews applications after signup."}
          </p>
        </div>
      </aside>

      <section className="relative flex min-h-0 w-full min-w-0 max-w-[100vw] flex-1 flex-col overflow-x-hidden overflow-y-hidden bg-[#fff8f1]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[#fff8f1]"
        />
        <div className="relative z-10 flex shrink-0 items-center border-b border-saffron/15 bg-[#F06A00] px-4 py-3 text-white lg:hidden">
          <Link href="/" className="inline-flex min-w-0 items-center gap-2.5">
            <AstrologicsLogoWhite className="h-9 w-9 shrink-0" />
            <span className="truncate font-display text-base font-semibold">
              {siteConfig.brandName}
            </span>
          </Link>
        </div>

        <div className="relative z-10 hidden shrink-0 items-center justify-between px-6 pt-5 lg:flex xl:px-10">
          <Link
            href="/"
            className="text-sm font-semibold text-saffron-deep hover:underline"
          >
            ← {hi ? "होम" : "Home"}
          </Link>
          <Link
            href={mode === "signup" ? "/astrologer/signin" : "/astrologer/signup"}
            className="text-sm font-semibold text-ink-muted hover:text-saffron-deep"
          >
            {mode === "signup"
              ? hi
                ? "पहले से खाता है? साइन इन"
                : "Already have an account? Sign in"
              : hi
                ? "नए हैं? साइन अप"
                : "New here? Sign up"}
          </Link>
        </div>

        <div className="relative z-10 flex min-h-0 w-full min-w-0 flex-1 items-start justify-center overflow-x-hidden overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 lg:items-center lg:px-10 lg:py-6">
          <div className="my-auto w-full min-w-0 max-w-[540px]">{children}</div>
        </div>
      </section>
    </div>
  );
}
