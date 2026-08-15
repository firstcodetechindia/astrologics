import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { CosmicBackground } from "./CosmicBackground";

export function FinalCta({ locale }: { locale: string }) {
  const hi = locale === "hi";
  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <CosmicBackground />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Image
          src="/images/home/home-hero-cosmic.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[center_45%] opacity-[0.35]"
        />
        <div className="absolute inset-0 bg-[#0B0F1F]/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(108,60,255,0.28),transparent_60%)]" />
      </div>
      <div className="container-page relative z-10 text-center">
        <h2 className="mx-auto max-w-3xl font-display text-3xl font-semibold tracking-tight text-white sm:text-5xl">
          {hi
            ? "क्या आप जानना चाहते हैं आपके सितारे क्या कहते हैं?"
            : "Ready to Discover What Your Stars Say?"}
        </h2>
        <p className="mx-auto mt-4 max-w-xl font-ui text-sm text-ink-muted sm:text-base">
          {hi
            ? "CosmicTalks के साथ अपनी व्यक्तिगत ज्योतिष यात्रा शुरू करें।"
            : "Start your personalized astrology journey with CosmicTalks."}
        </p>
        <Link
          href="/chat"
          className="btn-grad mt-8 inline-flex px-8 py-3.5 font-ui text-sm font-semibold text-white"
        >
          {hi ? "मुफ़्त शुरू करें" : "Start Free"}
        </Link>
      </div>
    </section>
  );
}
