import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  strokeWidth?: number;
};

/**
 * Sun + concentric orbits — सौर मंडल.
 * Distinct from Lucide Orbit, which Kundli uses.
 */
export function SaurmandalIcon({ className, strokeWidth = 2 }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <circle cx="12" cy="12" r="2.1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="5.4" />
      <circle cx="12" cy="12" r="9" />
      <circle cx="19.55" cy="8.15" r="1.35" fill="currentColor" stroke="none" />
    </svg>
  );
}
