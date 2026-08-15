"use client";

import { useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { GalaxyHeroBackground } from "@/components/ui/GalaxyHeroBackground";
import { AiAstrologerLabel } from "@/components/talk/AiAstrologerLabel";
import { cn } from "@/lib/utils";

export type GuruClosingFilter = {
  factFilterRan: true;
  scopeFlagged: boolean;
  flagged: boolean;
};

export function GuruReveal({
  locale,
  sentences,
  cueMs,
  filter,
  loading,
  onCue,
}: {
  locale: string;
  sentences: string[];
  cueMs: number[];
  filter: GuruClosingFilter | null;
  loading: boolean;
  onCue?: (index: number) => void;
}) {
  const hi = locale === "hi";
  const t = useTranslations("chatGuru");
  const lines =
    sentences.length > 0 ? sentences : loading ? [] : [t("fallback")];

  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    if (!onCue || lines.length === 0) return;
    const timers = lines.map((_, i) =>
      window.setTimeout(() => onCue(i), cueMs[i] ?? 700 + i * 2200)
    );
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [lines, cueMs, onCue]);

  return (
    <div
      className="guru-reveal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guru-reveal-title"
      data-fact-filter-ran={filter?.factFilterRan ? "true" : "false"}
      data-scope-filter-ran={filter ? "true" : "false"}
      data-scope-flagged={filter?.scopeFlagged ? "true" : "false"}
    >
      <div className="absolute inset-0 bg-[#0B0F1F]">
        <GalaxyHeroBackground
          variant="home"
          intensity={1}
          starDensity={1.15}
          opacity={0.45}
          chrome={false}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(11,15,31,0.15),rgba(11,15,31,0.82))]" />
      </div>

      <div className="relative flex h-full min-h-0 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 sm:px-6 sm:py-6">
          <div className="guru-reveal-presence mx-auto flex w-full max-w-md flex-col items-center text-center">
            <div className="guru-orb mb-3 sm:mb-4">
              <span className="guru-orb-blob guru-orb-blob-a" aria-hidden />
              <span className="guru-orb-blob guru-orb-blob-b" aria-hidden />
              <span className="guru-orb-blob guru-orb-blob-c" aria-hidden />
              <span className="guru-orb-blob guru-orb-blob-d" aria-hidden />
              <div className="absolute inset-[18%] overflow-hidden rounded-full shadow-[0_0_40px_rgba(108,60,255,0.45)] ring-2 ring-white/25">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/icons/ai-guru-avatar.png"
                  alt=""
                  width={256}
                  height={256}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <p
              id="guru-reveal-title"
              className="font-display text-lg font-bold text-white sm:text-xl"
            >
              {hi ? "एआई गुरु" : "AI Guru"}
            </p>
            <div className="mt-2">
              <AiAstrologerLabel locale={locale} size="md" />
            </div>

            <div className="mt-4 w-full min-w-0 space-y-3 text-left sm:mt-5">
              {loading && lines.length === 0 ? (
                <p className="text-center font-ui text-[15px] leading-relaxed text-ink-muted">
                  {t("thinking")}
                </p>
              ) : (
                lines.map((line, i) => (
                  <p
                    key={`${i}-${line.slice(0, 24)}`}
                    className="guru-reveal-line font-ui text-[15px] leading-relaxed break-words text-white sm:text-base"
                    style={{ animationDelay: `${cueMs[i] ?? i * 2200}ms` }}
                  >
                    {line}
                  </p>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="guru-reveal-dock shrink-0 border-t border-white/10 bg-[#0B0F1F]/95 px-4 pt-3 backdrop-blur-sm sm:px-6">
          <ul className="mx-auto w-full max-w-md space-y-1 font-ui text-[13px] leading-snug text-ink-muted">
            <li>{t("perkSaved")}</li>
            <li>{t("perkHuman")}</li>
          </ul>
          <Link
            href="/login?next=/chat"
            data-guru-reveal-cta
            className={cn(
              "btn-grad mx-auto mt-3 flex min-h-11 w-full max-w-md items-center justify-center rounded-xl px-5 py-3 font-ui text-sm font-semibold text-white"
            )}
          >
            {t("cta")}
          </Link>
          <p className="mx-auto mt-2 max-w-md text-center font-ui text-[11px] text-ink-muted">
            {t("ctaNote")}
          </p>
        </div>
      </div>
    </div>
  );
}
