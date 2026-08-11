import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Portrait panel with readable caption bar (not faint white-on-face text). */
export function HomeMediaPanel({
  src,
  alt,
  side = "left",
  className,
  imageClassName,
  children,
  minHeightClass = "min-h-[260px] sm:min-h-[320px] lg:min-h-full",
}: {
  src: string;
  alt: string;
  side?: "left" | "right";
  className?: string;
  imageClassName?: string;
  children: ReactNode;
  minHeightClass?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl",
        minHeightClass,
        side === "right" ? "lg:order-2" : "lg:order-1",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 100vw, 40vw"
        className={cn("object-cover object-[center_18%]", imageClassName)}
      />
      {/* Full dim + strong bottom scrim so caption stays readable */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[#2a1510]/25"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-[#1a0c08] via-[#1a0c08]/85 to-transparent"
      />
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <div className="rounded-xl border border-white/15 bg-[#1a0c08]/70 px-3.5 py-3 shadow-lg backdrop-blur-md sm:px-4 sm:py-3.5">
          {children}
        </div>
      </div>
    </div>
  );
}

export function HomeSplitGrid({
  imageSide,
  image,
  content,
  className,
}: {
  imageSide: "left" | "right";
  image: ReactNode;
  content: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid items-stretch gap-5 lg:grid-cols-2 lg:gap-0",
        className
      )}
    >
      {image}
      <div
        className={cn(
          imageSide === "right" ? "lg:order-1" : "lg:order-2",
          "min-w-0"
        )}
      >
        {content}
      </div>
    </div>
  );
}
