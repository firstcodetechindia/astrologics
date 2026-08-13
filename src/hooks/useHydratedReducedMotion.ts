"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * `useReducedMotion()` is `null` on the server and `true`/`false` on the
 * client. Using it to pick classNames or swap trees during render hydrates
 * incorrectly. This hook is always `false` until after mount, then the real
 * preference — so the first client paint matches SSR.
 */
export function useHydratedReducedMotion(): boolean {
  const [ready, setReady] = useState(false);
  const prefer = useReducedMotion();
  useEffect(() => {
    setReady(true);
  }, []);
  return ready && prefer === true;
}
