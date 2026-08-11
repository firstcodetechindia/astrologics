import { Link } from "@/i18n/navigation";

export function AnnouncementBar({ locale }: { locale: string }) {
  const hi = locale === "hi";
  return (
    <div className="relative z-20 border-b border-maroon/15 bg-gradient-to-r from-[#6B1C1C] via-[#8a2a12] to-[#F06A00] text-ivory">
      <div className="container-page flex items-center justify-center gap-2 py-2 text-center text-[12px] sm:text-[13px]">
        <p className="leading-snug">
          {hi
            ? "कुंडली, पश्चिमी, केपी व अंक ज्योतिष — एआई के साथ स्पष्ट समझ"
            : "Your birth chart. Your questions. Astrology across traditions — explained clearly."}
        </p>
        <Link
          href="/kundli"
          className="hidden shrink-0 font-semibold underline decoration-white/40 underline-offset-2 hover:decoration-white sm:inline"
        >
          {hi ? "कुंडली बनाएँ →" : "Free Kundli →"}
        </Link>
      </div>
    </div>
  );
}
