"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { HOME_FAQ } from "@/lib/home/faq";
import { Reveal } from "./Reveal";
import { HomeMediaPanel, HomeSplitGrid } from "./HomeMediaPanel";

/** Compact homepage set — full list remains on /faq + FAQPage schema. */
const HOME_FAQ_PREVIEW = 6;

/** Image LEFT — alternates from Today’s Astrology (right) */
export function HomeFaq({ locale }: { locale: string }) {
  const hi = locale === "hi";
  const [open, setOpen] = useState<number | null>(0);
  const items = HOME_FAQ.slice(0, HOME_FAQ_PREVIEW);

  return (
    <section className="bg-[#faf7f4] py-10 sm:py-12" id="faq">
      <div className="container-page">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-[#f7f4f0]">
            <HomeSplitGrid
              imageSide="left"
              image={
                <HomeMediaPanel
                  side="left"
                  src="/images/home/home-faq-astrology-books.jpg"
                  alt={
                    hi
                      ? "ज्योतिष ग्रंथ और नक्षत्र मानचित्र — प्रश्न व उत्तर"
                      : "Astrology books and star map — questions answered"
                  }
                  minHeightClass="min-h-[220px] sm:min-h-[260px] lg:min-h-full"
                  className="rounded-none"
                  imageClassName="object-cover object-center"
                >
                  <h2 className="font-display text-lg font-bold leading-snug text-white sm:text-xl">
                    {hi
                      ? "अक्सर पूछे जाने वाले प्रश्न"
                      : "Frequently Asked Questions"}
                  </h2>
                  <p className="mt-1.5 text-[13px] leading-snug text-white/95">
                    {hi
                      ? "कुंडली, गणना और एआई—संक्षिप्त उत्तर।"
                      : "Kundli, calculation and AI—brief answers."}
                  </p>
                </HomeMediaPanel>
              }
              content={
                <div className="p-4 sm:p-5 lg:p-6">
                  <div className="divide-y divide-black/[0.06] rounded-xl border border-black/[0.06] bg-white">
                    {items.map((item, i) => {
                      const isOpen = open === i;
                      const q = hi ? item.q.hi : item.q.en;
                      const a = hi ? item.a.hi : item.a.en;
                      return (
                        <div key={item.q.en}>
                          <button
                            type="button"
                            aria-expanded={isOpen}
                            className="flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-[13px] font-semibold text-ink sm:px-4 sm:text-sm"
                            onClick={() => setOpen(isOpen ? null : i)}
                          >
                            <span className="leading-snug">{q}</span>
                            <ChevronDown
                              className={`h-3.5 w-3.5 shrink-0 text-saffron-deep transition ${
                                isOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          {isOpen ? (
                            <div className="px-3.5 pb-3 text-[12.5px] leading-relaxed text-ink-muted sm:px-4 sm:text-[13px]">
                              {a}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>

                  <Link
                    href="/faq"
                    className="mt-3 inline-block text-[13px] font-semibold text-saffron-deep hover:underline"
                  >
                    {hi ? "सभी प्रश्न देखें →" : "See all questions →"}
                  </Link>
                </div>
              }
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
