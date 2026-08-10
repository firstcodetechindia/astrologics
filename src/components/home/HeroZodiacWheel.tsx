"use client";

import { motion } from "framer-motion";
import Image from "next/image";

/** Dual-layer spinning chart */
export function HeroZodiacWheel() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[36rem] select-none">
      <div
        className="pointer-events-none absolute inset-[6%] rounded-full bg-[radial-gradient(circle,_rgba(240,106,0,0.16)_0%,_transparent_68%)]"
        aria-hidden
      />

      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      >
        <Image
          src="/images/astrological-chart-1.avif"
          alt=""
          width={800}
          height={782}
          className="h-full w-full object-contain"
          priority
        />
      </motion.div>

      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: -360 }}
        transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
      >
        <Image
          src="/images/astrological-chart-2.avif"
          alt=""
          width={800}
          height={782}
          className="h-full w-full object-contain"
          priority
        />
      </motion.div>
    </div>
  );
}
