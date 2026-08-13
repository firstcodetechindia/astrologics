"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

/** Subtle scroll reveal — same tree on server and client. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useHydratedReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ duration: reduce ? 0 : 0.45, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
