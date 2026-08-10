"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Orbit,
  Timer,
  HeartHandshake,
  Clock3,
  BookOpen,
  MessageCircleHeart,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { GlassCard } from "@/components/ui/GlassCard";

const featureIcons = [Sparkles, Orbit, Timer, HeartHandshake];
const whyIcons = [Clock3, BookOpen, MessageCircleHeart];

export function FeatureGrid({
  title,
  subtitle,
  features,
}: {
  title: string;
  subtitle: string;
  features: { title: string; text: string }[];
}) {
  return (
    <section className="container-page py-12 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="section-title">{title}</h2>
        <p className="mt-3 text-ink-muted text-[0.98rem] sm:text-base leading-relaxed">
          {subtitle}
        </p>
      </div>

      <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {features.map((f, i) => {
          const Icon = featureIcons[i % featureIcons.length];
          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.07, duration: 0.45 }}
            >
              <GlassCard hover className="h-full relative overflow-hidden">
                <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-[2rem] bg-gradient-to-bl from-saffron/10 to-transparent" />
                <div className="relative flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-saffron/20 to-gold/35 text-saffron-deep shadow-inner">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="heading-3 font-display text-saffron-deep">
                      {f.title}
                    </h3>
                    <p className="text-muted mt-2">{f.text}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export function WhySection({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: { title: string; text: string }[];
}) {
  return (
    <section className="relative overflow-hidden py-12 sm:py-16">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-saffron/[0.06] to-transparent" />
      <div className="container-page relative">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="section-title">{title}</h2>
          <p className="mt-3 text-ink-muted text-[0.98rem] sm:text-base leading-relaxed">
            {subtitle}
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {items.map((item, i) => {
            const Icon = whyIcons[i % whyIcons.length];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
              >
                <GlassCard hover strong className="h-full text-center">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-saffron to-saffron-deep text-ivory shadow-lg shadow-saffron/25">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="heading-3 mt-4 font-display text-saffron-deep">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[0.95rem] text-ink-muted leading-relaxed">
                    {item.text}
                  </p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks({
  title,
  steps,
  ctaLabel,
}: {
  title: string;
  steps: string[];
  ctaLabel: string;
}) {
  return (
    <section className="container-page py-12 sm:py-16">
      <h2 className="section-title text-center">{title}</h2>
      <ol className="relative mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        <div className="pointer-events-none absolute left-[16%] right-[16%] top-10 hidden h-0.5 bg-gradient-to-r from-gold via-saffron to-saffron-deep md:block" />
        {steps.map((s, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
            <GlassCard hover className="h-full text-center relative overflow-hidden pt-8">
              <span className="relative z-10 mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-saffron to-saffron-deep text-ivory font-numeric text-lg font-bold shadow-lg shadow-saffron/30 ring-4 ring-white/80">
                {i + 1}
              </span>
              <p className="mt-5 text-[0.98rem] font-medium text-ink leading-relaxed px-1">
                {s}
              </p>
            </GlassCard>
          </motion.li>
        ))}
      </ol>
      <div className="mt-10 text-center px-1">
        <Link
          href="/kundli"
          className="btn-grad inline-flex w-full sm:w-auto items-center justify-center rounded-2xl px-8 py-3.5 text-base font-semibold text-ivory"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
