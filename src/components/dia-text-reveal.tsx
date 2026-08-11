"use client";

import {
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import type {
  AnimationEvent,
  ComponentPropsWithoutRef,
} from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "../lib/utils.js";

import {
  ExitingLine,
  HeightClipper,
  WidthReservation,
} from "./dia-text-reveal.lines.js";
import {
  buildSweepStyle,
  COVERAGE_SPAN,
  makeExitEase,
  type Sweep,
} from "./dia-text-reveal.sweep.js";
import { measureWidths } from "./dia-text-reveal.utils.js";
import "./dia-text-reveal.css";

const DEFAULT_COLORS = [
  "#c679c4",
  "#fa3d1d",
  "#ffb005",
  "#e1e1fe",
  "#0358f7",
];

const EXIT_LEAD_RATIO = 0.3;

export interface DiaTextRevealProps
  extends Omit<
    ComponentPropsWithoutRef<typeof motion.span>,
    | "ref"
    | "children"
    | "style"
    | "animate"
    | "transition"
    | "color"
  > {
  /** Text to reveal. Pass multiple strings to rotate when `repeat` is `true`. */
  text: string | string[];
  /** Colors sampled across the moving gradient band. */
  colors?: string[];
  /** CSS color for revealed text after the sweep. @defaultValue `"var(--color-foreground)"` */
  textColor?: string;
  /** Duration of one sweep pass, in seconds. @defaultValue `1` */
  duration?: number;
  /** Delay before the sweep starts, in seconds. @defaultValue `0` */
  delay?: number;
  /** When `text` is an array, replay the sweep and advance to the next string after each completion. */
  repeat?: boolean;
  /** Pause between cycles when `repeat` is `true`, in seconds. @defaultValue `0.5` */
  repeatDelay?: number;
  /** How long the outgoing line takes to fade/slide away, in seconds. @defaultValue the sweep's coverage window */
  exitDuration?: number;
  /** Head start given to the outgoing line, in seconds. @defaultValue `0.15 * duration` */
  exitLead?: number;
  /** If `true`, the animation starts only after the element enters the viewport. @defaultValue `true` */
  startOnView?: boolean;
  /** External gate: while `false`, the sweep is held at its start. @defaultValue `true` */
  start?: boolean;
  /** Passed to `useInView`: if `true`, in-view detection fires at most once. @defaultValue `true` */
  once?: boolean;
  /** Additional class names for the animated `span`. */
  className?: string;
  /** When `text` has multiple entries, use the widest string's width for layout. @defaultValue `false` */
  fixedWidth?: boolean;
  /** Allow the text to wrap onto multiple lines. @defaultValue `false` */
  wrap?: boolean;
}

export function DiaTextReveal({
  text,
  colors = DEFAULT_COLORS,
  textColor = "var(--color-foreground)",
  duration = 1,
  delay = 0,
  repeat = false,
  repeatDelay = 0.5,
  exitDuration,
  exitLead,
  startOnView = true,
  start = true,
  once = true,
  className,
  fixedWidth = false,
  wrap = false,
  ...props
}: DiaTextRevealProps) {
  const texts = Array.isArray(text) ? text : [text];
  const isMulti = texts.length > 1;
  const prefersReducedMotion = useReducedMotion();
  const exitSpan = exitDuration ?? duration * COVERAGE_SPAN;
  const lead = Math.max(0, exitLead ?? duration * EXIT_LEAD_RATIO);
  const exitTotal = lead + exitSpan;
  const leadFraction = exitTotal > 0 ? lead / exitTotal : 0;
  const exitOpacityEase = useMemo(
    () => makeExitEase(leadFraction),
    [leadFraction],
  );

  const spanRef = useRef<HTMLSpanElement>(null);
  const optsRef = useRef({ repeat, repeatDelay, texts });
  optsRef.current = { repeat, repeatDelay, texts };

  const indexRef = useRef(0);
  const hasPlayedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const pendingRepeatRef = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [sweep, setSweep] = useState<Sweep>(null);
  const [exiting, setExiting] = useState<{
    index: number;
    token: number;
  } | null>(null);
  const clearExiting = useCallback(() => setExiting(null), []);
  const [measuredWidths, setMeasuredWidths] = useState<number[]>([]);
  const [wrapHeight, setWrapHeight] = useState<{
    h: number;
    shrink: boolean;
  } | null>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  const isInView = useInView(spanRef, { once, amount: 0.1 });
  const isLiveInView = useInView(spanRef, {
    once: false,
    amount: 0.1,
  });

  // biome-ignore lint/plugin: measures live DOM layout (getBoundingClientRect on a ghost clone) — post-render measurement.
  useEffect(() => {
    const el = spanRef.current;
    if (!(el && isMulti) || wrap) return;
    const measure = () =>
      setMeasuredWidths(measureWidths(el, texts));
    measure();
    if (document.fonts.status !== "loaded")
      document.fonts.ready.then(measure);
  }, [Array.isArray(text) ? text.join("\0") : text, isMulti, wrap, texts]);

  // biome-ignore lint/plugin: subscribes a ResizeObserver to live DOM layout.
  useEffect(() => {
    const el = innerRef.current;
    if (!(el && wrap && isMulti)) return;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const h = entry.contentRect.height;
      setWrapHeight((prev) =>
        prev !== null && prev.h === h
          ? prev
          : {
              h,
              shrink: prev !== null && h < prev.h,
            },
      );
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [wrap, isMulti]);

  const advance = useCallback(() => {
    const opts = optsRef.current;
    const current = indexRef.current;
    const next = (current + 1) % opts.texts.length;
    indexRef.current = next;
    setExiting({ index: current, token: Date.now() });
    setActiveIndex(next);
    setSweep((prev) => ({
      cycle: (prev?.cycle ?? 0) + 1,
      lead: true,
    }));
  }, []);

  const scheduleRepeat = useCallback(() => {
    timerRef.current = setTimeout(() => {
      timerRef.current = undefined;
      advance();
    }, optsRef.current.repeatDelay * 1000);
  }, [advance]);

  const onSweepEnd = useCallback(
    (event: AnimationEvent<HTMLSpanElement>) => {
      if (!event.animationName.startsWith("dia-sweep")) return;
      if (!optsRef.current.repeat) return;
      scheduleRepeat();
    },
    [scheduleRepeat],
  );

  // biome-ignore lint/plugin: flips imperative animation state on a viewport/gate edge.
  useEffect(() => {
    if (prefersReducedMotion) return;
    if (startOnView && !isInView) return;
    if (!start) return;
    if (once && hasPlayedRef.current) return;
    hasPlayedRef.current = true;
    setSweep((prev) =>
      prev === null
        ? { cycle: 0, lead: false }
        : { cycle: prev.cycle + 1, lead: false },
    );
  }, [isInView, start, startOnView, once, prefersReducedMotion]);

  // biome-ignore lint/plugin: pauses/re-arms a pending timer on live viewport presence.
  useEffect(() => {
    if (!repeat || prefersReducedMotion) return;
    if (!isLiveInView) {
      if (timerRef.current === undefined) return;
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
      pendingRepeatRef.current = true;
    } else if (pendingRepeatRef.current) {
      pendingRepeatRef.current = false;
      scheduleRepeat();
    }
  }, [isLiveInView, repeat, prefersReducedMotion, scheduleRepeat]);

  // biome-ignore lint/plugin: releases a pending timer on unmount.
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const paused = repeat && sweep !== null && !isLiveInView;

  const revealStyle = buildSweepStyle({
    colors,
    textColor,
    duration,
    delay: delay + (sweep?.lead ? lead : 0),
    sweep,
    paused,
    reduced: prefersReducedMotion === true,
  });

  if (!isMulti)
    return (
      <motion.span
        ref={spanRef}
        className={cn(
          "align-baseline text-inherit leading-[100%]",
          className,
        )}
        style={revealStyle}
        {...props}
        onAnimationEnd={onSweepEnd}
      >
        {texts[activeIndex]}
      </motion.span>
    );

  const fixedW =
    !wrap && fixedWidth && measuredWidths.length > 0
      ? Math.max(...measuredWidths)
      : undefined;
  const animatedW =
    wrap || fixedWidth ? undefined : measuredWidths[activeIndex];
  const animatedH = wrap ? wrapHeight?.h : undefined;
  const heightDelay =
    exiting !== null && wrapHeight?.shrink ? exitTotal : 0;

  const incoming = (
    <span
      ref={innerRef}
      className={cn(
        "inline-block",
        wrap && "w-full",
        !wrap && "whitespace-nowrap",
      )}
      style={revealStyle}
      onAnimationEnd={onSweepEnd}
    >
      {texts[activeIndex]}
    </span>
  );

  return (
    <motion.span
      ref={spanRef}
      className={cn(
        wrap
          ? "relative inline-block w-full text-center align-baseline text-inherit"
          : "relative inline-block whitespace-nowrap text-center align-baseline text-inherit leading-[100%]",
        className,
      )}
      style={{
        ...(fixedW !== undefined && { width: fixedW }),
      }}
      animate={{
        ...(animatedW !== undefined && { width: animatedW }),
      }}
      transition={{
        width: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
      }}
      {...props}
    >
      {wrap ? (
        <HeightClipper height={animatedH} delay={heightDelay}>
          <WidthReservation texts={texts} />
          {incoming}
        </HeightClipper>
      ) : (
        incoming
      )}

      {exiting && !prefersReducedMotion && (
        <ExitingLine
          key={exiting.token}
          text={texts[exiting.index]!}
          textColor={textColor}
          duration={0.4}
          fallDuration={0.25}
          opacityEase={exitOpacityEase}
          wrap={wrap}
          onDone={clearExiting}
        />
      )}
    </motion.span>
  );
}
