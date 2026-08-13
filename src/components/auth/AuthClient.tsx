"use client";

import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { CosmicGPTWordmark } from "@/components/brand/CosmicGPTWordmark";
import { AuthOtpForm } from "@/components/auth/AuthOtpForm";
import { ZodiacIcon } from "@/components/ui/ZodiacIcon";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

/** Animated CosmicGPT lockup for the auth brand panel. */
function AuthBrandOrbit() {
  return (
    <div className="relative flex items-center justify-center px-2">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-8 rounded-full bg-[radial-gradient(circle,rgba(108,60,255,0.35),transparent_65%)] blur-2xl"
      />
      <CosmicGPTWordmark size="lg" showTagline className="relative z-10" />
    </div>
  );
}

function BrandPanelMotion() {
  const reduce = useHydratedReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#F06A00]" />
      {(
        [
          { slug: "leo" as const, className: "left-[10%] top-[18%] h-9 w-9" },
          { slug: "pisces" as const, className: "right-[12%] top-[26%] h-8 w-8" },
          { slug: "aquarius" as const, className: "left-[14%] bottom-[20%] h-9 w-9" },
          { slug: "scorpio" as const, className: "right-[14%] bottom-[24%] h-8 w-8" },
        ] as const
      ).map((item, i) => (
        <motion.div
          key={item.slug}
          className={cn("absolute opacity-40", item.className)}
          animate={
            reduce
              ? undefined
              : { y: [0, i % 2 === 0 ? -8 : 8, 0] }
          }
          transition={
            reduce
              ? undefined
              : { duration: 7 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.35 }
          }
        >
          <ZodiacIcon
            slug={item.slug}
            className="h-full w-full"
            colorClassName="bg-surface"
          />
        </motion.div>
      ))}
    </div>
  );
}

function WhySignUpCard({ hi }: { hi: boolean }) {
  const title = hi ? "साइन अप क्यों करें?" : "Why Sign Up?";
  const items = hi
    ? [
        "व्यक्तिगत जानकारी पाएँ",
        "कुंडली चार्ट क्लाउड पर सेव करें",
        "अपने नोट्स व टिप्पणियाँ लिखें",
        "कहीं भी पहुँच: मोबाइल व वेब",
        "विश्लेषण के लिए वर्कशीट का उपयोग",
      ]
    : [
        "Get personalized information",
        "Save charts (kundli) on cloud",
        "Write your notes & comments",
        "Anywhere access: mobile & web",
        "Access worksheet for analysis",
      ];

  return (
    <div className="w-full max-w-[26rem] overflow-hidden rounded-[1.35rem] border border-white/35 bg-surface/70 text-left shadow-[0_16px_36px_-16px_rgba(42,33,24,0.3)] backdrop-blur-[2px]">
      <div className="pt-5">
        <h2
          className="inline-flex max-w-[92%] items-center bg-[#F06A00] py-2.5 pl-5 pr-9 text-[1.25rem] font-bold leading-none text-white"
          style={{
            clipPath: "polygon(0 0, calc(100% - 1.15rem) 0, 100% 100%, 0 100%)",
          }}
        >
          {title}
        </h2>
      </div>
      <ul className="space-y-3.5 px-5 py-5">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 text-[15px] font-medium leading-snug text-white/90"
          >
            <span
              aria-hidden
              className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#F06A00]"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AuthClient() {
  const locale = useLocale();
  const hi = locale === "hi";

  return (
    <div className="relative flex h-full min-h-0 w-full max-w-[100vw] flex-col overflow-x-hidden overflow-y-auto bg-cosmic-navy lg:flex-row">
      {/* Desktop brand column only — never on mobile */}
      <aside className="relative hidden h-full w-[46%] shrink-0 overflow-hidden bg-[#F06A00] text-white lg:flex xl:w-[48%]">
        <BrandPanelMotion />

        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-5 px-8 py-10 xl:gap-6 xl:px-12">
          <Link href="/" className="flex flex-col items-center gap-3.5 outline-none">
            <AuthBrandOrbit />
            <span className="font-display text-4xl font-semibold tracking-tight xl:text-[2.75rem]">
              {siteConfig.brandName}
            </span>
          </Link>

          <h1 className="max-w-lg text-center font-display text-[1.7rem] font-semibold leading-tight tracking-tight xl:text-[1.95rem]">
            {hi
              ? "आधुनिक जीवन के लिए स्पष्ट ज्योतिष"
              : "Clear astrology for modern life"}
          </h1>

          {/* Card sits a bit left of the centered brand stack */}
          <div className="mt-1 flex w-full justify-center">
            <div className="w-full max-w-[26rem] -translate-x-16 xl:-translate-x-28">
              <WhySignUpCard hi={hi} />
            </div>
          </div>

          <p className="absolute inset-x-0 bottom-5 text-center text-[12px] text-white/70">
            © {new Date().getFullYear()} {siteConfig.brandName}
          </p>
        </div>
      </aside>

      {/* Login form — full width on mobile, right column on desktop */}
      <section className="relative flex min-h-0 w-full min-w-0 max-w-[100vw] flex-1 flex-col overflow-x-hidden overflow-y-auto bg-cosmic-navy">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-cosmic-navy"
        />
        <div className="relative z-10 flex shrink-0 items-center justify-between border-b border-white/10 bg-cosmic-navy px-4 py-3 text-white lg:hidden">
          <Link href="/" className="inline-flex min-w-0 items-center">
            <CosmicGPTWordmark size="sm" showTagline={false} />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-lg bg-white/15 px-2.5 py-1.5 text-[11px] font-semibold ring-1 ring-white/25"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {hi ? "वापस" : "Back"}
          </Link>
        </div>

        <div className="relative z-10 hidden shrink-0 px-6 pt-5 lg:block xl:px-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-saffron-deep hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            {hi ? "होम" : "Home"}
          </Link>
        </div>

        <div className="relative z-10 flex min-h-0 w-full min-w-0 flex-1 items-center justify-center overflow-x-hidden overflow-y-auto overscroll-y-auto px-4 py-6 sm:px-6 lg:px-10">
          <div className="my-auto w-full min-w-0 max-w-[440px]">
            <AuthOtpForm />
          </div>
        </div>
      </section>
    </div>
  );
}
