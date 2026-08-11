"use client";

import { motion } from "framer-motion";
import { type ReactNode, useEffect, useState } from "react";
import { useMediaQuery } from "../lib/use-media-query.js";
import { cn } from "../lib/utils.js";

/** Four-pointed star, drawn once and reused by every sparkle. */
const STAR_PATH =
  "M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72026C12.4006 4.19229 12.3916 6.39157 13.5 7.5C14.6084 8.60843 16.8077 8.59935 18.2797 9.13822L20.1561 9.82534C20.7858 10.0553 20.7858 10.9447 20.1561 11.1747L18.2797 11.8618C16.8077 12.4007 14.6084 12.3916 13.5 13.5C12.3916 14.6084 12.4006 16.8077 11.8618 18.2798L11.1746 20.1562C10.9446 20.7858 10.0553 20.7858 9.82531 20.1562L9.13819 18.2798C8.59932 16.8077 8.60843 14.6084 7.5 13.5C6.39157 12.3916 4.19225 12.4007 2.72023 11.8618L0.843814 11.1747C0.215148 10.9447 0.215148 10.0553 0.843814 9.82534L2.72023 9.13822C4.19225 8.59935 6.39157 8.60843 7.5 7.5C8.60843 6.39157 8.59932 4.19229 9.13819 2.72026L9.82531 0.843845Z";

const DEFAULT_COLORS = {
  first: "var(--color-accent-brand)",
  second: "var(--color-accent-brand-soft)",
};

type Sparkle = {
  /** Position within the text's box, as percentages. */
  x: string;
  y: string;
  color: string;
  /** Offsets the twinkle so the group never pulses in unison. */
  delay: number;
  scale: number;
  /** `performance.now()` timestamp after which this sparkle is replaced by a fresh one. */
  expiresAt: number;
};

function SparkleStar({
  x,
  y,
  color,
  delay,
  scale,
}: Omit<Sparkle, "expiresAt">) {
  return (
    <motion.svg
      className="pointer-events-none absolute z-20"
      initial={{ opacity: 0, left: x, top: y }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, scale, 0],
        rotate: [75, 120, 150],
      }}
      transition={{
        duration: 0.8,
        repeat: Number.POSITIVE_INFINITY,
        delay,
      }}
      width="21"
      height="21"
      viewBox="0 0 21 21"
      aria-hidden={true}
    >
      <path d={STAR_PATH} fill={color} />
    </motion.svg>
  );
}

export type SparklesTextProps = {
  /** The text to sparkle. Rendered inline, so it inherits the surrounding type. */
  children: ReactNode;
  className?: string;
  /** How many sparkles orbit the text at once. @default 10 */
  sparklesCount?: number;
  /** The two colors sparkles alternate between. */
  colors?: { first: string; second: string };
};

/**
 * Wraps a word or phrase in continuously respawning sparkles.
 *
 * Sparkles are generated on the client only — the exported HTML ships the bare
 * text, so nothing about the layout depends on JS having run. Readers who ask
 * for reduced motion get that same bare text.
 */
export function SparklesText({
  children,
  className,
  sparklesCount = 10,
  colors = DEFAULT_COLORS,
}: SparklesTextProps) {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const { first, second } = colors;

  // biome-ignore lint/plugin: spawns and retires sparkles on a timer — an imperative animation loop with no derived-state equivalent.
  useEffect(() => {
    if (reducedMotion) {
      setSparkles([]);
      return;
    }

    const spawn = (): Sparkle => ({
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      color: Math.random() > 0.5 ? first : second,
      delay: Math.random() * 2,
      scale: Math.random() + 0.3,
      expiresAt: performance.now() + (Math.random() * 10 + 5) * 1000,
    });

    setSparkles(Array.from({ length: sparklesCount }, spawn));

    const interval = setInterval(() => {
      setSparkles((current) => {
        const now = performance.now();
        if (!current.some((sparkle) => sparkle.expiresAt <= now))
          return current;
        return current.map((sparkle) =>
          sparkle.expiresAt <= now ? spawn() : sparkle,
        );
      });
    }, 500);

    return () => clearInterval(interval);
  }, [first, second, sparklesCount, reducedMotion]);

  return (
    <span className={cn("relative inline-block", className)}>
      {sparkles.map((sparkle) => (
        <SparkleStar
          key={`${sparkle.x}-${sparkle.y}-${sparkle.expiresAt}`}
          {...sparkle}
        />
      ))}
      {children}
    </span>
  );
}
