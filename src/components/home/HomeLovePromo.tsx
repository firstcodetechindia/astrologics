"use client";

import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

export function HomeLovePromo({ locale }: { locale: string }) {
  const hi = locale === "hi";
  const steps = hi
    ? [
        {
          n: "01",
          title: "दो नाम लिखें",
          text: "आपका और उनका — जन्म समय की ज़रूरत नहीं।",
        },
        {
          n: "02",
          title: "हम जन्म नक्षत्र भाव पढ़ते हैं",
          text: "नाम की ध्वनि पारंपरिक नक्षत्र–राशि भाव से जुड़ती है।",
        },
        {
          n: "03",
          title: "मेल प्रतिशत देखें",
          text: "विवाह गुण-मिलान की भावना वाला स्पष्ट प्रेम स्कोर।",
        },
      ]
    : [
        {
          n: "01",
          title: "Enter two names",
          text: "Yours and theirs — nothing else. No birth time needed.",
        },
        {
          n: "02",
          title: "We read each birth-star idea",
          text: "Every name maps to a traditional nakshatra–rashi flavour.",
        },
        {
          n: "03",
          title: "See your match",
          text: "A clear love score inspired by traditional name–star harmony.",
        },
      ];

  return (
    <section className="container-page py-14 sm:py-20">
      <div className="rounded-[2rem] border border-white/10 surface-wash overflow-hidden shadow-sm">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-0">
          <div className="p-6 sm:p-10 lg:p-12">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-saffron-deep">
              {hi ? "नाम अनुकूलता" : "Name compatibility"}
            </p>
            <h2 className="heading-1 mt-3 font-display tracking-tight text-ink">
              {hi ? "लव कैलकुलेटर" : "Love Calculator"}
            </h2>
            <p className="text-muted mt-3 max-w-lg">
              {hi
                ? "केवल दो नाम पर्याप्त। हम प्रत्येक नाम में छिपी जन्म-नक्षत्र भावना पढ़कर देखते हैं कि मेल कितना गहरा है — बिना जन्म समय के।"
                : "Two names are all it takes. We read the birth-star idea hidden in each name and show how closely they harmonise — no birth time required."}
            </p>
            <Link
              href="/calculators/love-calculator"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-saffron to-maroon px-6 py-3.5 text-base font-semibold text-white shadow-md shadow-saffron/25 hover:brightness-105"
            >
              {hi ? "अभी प्रेम प्रतिशत जाँचें" : "Test love percentage now"}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-4 text-xs text-ink-muted">
              {hi
                ? "मुफ्त · खाता ज़रूरी नहीं · जन्म समय नहीं चाहिए"
                : "Free · No account needed · No birth time needed"}
            </p>
            <p className="mt-3 text-sm text-ink-muted">
              {hi ? "जन्म विवरण हैं?" : "Have birth details?"}{" "}
              <Link
                href="/calculators/kundli-matching"
                className="font-semibold text-saffron-deep hover:underline"
              >
                {hi ? "36 गुण कुंडली मिलान खोलें →" : "Open 36-guna Kundli Matching →"}
              </Link>
            </p>
          </div>

          <div className="bg-surface/75 border-t lg:border-t-0 lg:border-l border-white/10 p-6 sm:p-10 lg:p-12 space-y-6">
            {steps.map((s) => (
              <div key={s.n} className="flex gap-4">
                <span className="font-numeric text-2xl font-bold text-saffron/50 tabular-nums shrink-0 w-10">
                  {s.n}
                </span>
                <div>
                  <h3 className="font-semibold text-ink text-[15px]">{s.title}</h3>
                  <p className="mt-1 text-sm text-ink-muted leading-relaxed">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
