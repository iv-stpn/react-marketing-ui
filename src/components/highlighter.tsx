'use client';

import { useInView } from 'framer-motion';
import { type ReactNode, useLayoutEffect, useRef } from 'react';
import { annotate } from 'rough-notation';
import type { RoughAnnotation } from 'rough-notation/lib/model';
import { useMediaQuery } from '../lib/use-media-query.js';
import { cn } from '../lib/utils.js';

export type AnnotationAction = 'highlight' | 'underline' | 'box' | 'circle' | 'strike-through' | 'crossed-off' | 'bracket';

/**
 * rough-notation writes the colour straight into the SVG's `stroke` presentation
 * attribute, where `var()` is never substituted — so a design token has to be
 * resolved against the live element before it is handed over.
 */
function resolveColor(element: Element, color: string): string {
  if (!color.startsWith('var(')) return color;
  const token = color.slice(4, -1).trim();
  return globalThis.getComputedStyle(element).getPropertyValue(token).trim() || color;
}

export type HighlighterProps = {
  /** The words to annotate. Rendered inline, so they inherit the surrounding type. */
  children: ReactNode;
  className?: string;
  /** Which marker stroke to draw. @default 'highlight' */
  action?: AnnotationAction;
  /** Stroke colour. Accepts `var(--token)` strings, resolved against the live element. @default 'var(--color-accent-brand-soft)' */
  color?: string;
  /** @default 1.5 */
  strokeWidth?: number;
  /** Milliseconds the stroke takes to draw itself on. @default 600 */
  animationDuration?: number;
  /** Milliseconds to hold the stroke back before it starts drawing. @default 0 */
  delay?: number;
  /** Passes over the same stroke, which is what makes it read as hand-drawn. @default 2 */
  iterations?: number;
  /** Pixels of slack between the text box and the stroke. @default 2 */
  padding?: number;
  /** Annotate every line the text wraps onto, rather than one box around all. @default true */
  multiline?: boolean;
  /** Hold the stroke back until the text scrolls into view. @default false */
  isView?: boolean;
};

/**
 * Draws a hand-drawn marker stroke over a word or phrase.
 *
 * The stroke is an SVG that rough-notation injects on the client, so the
 * exported HTML ships the bare text and nothing about the layout depends on JS
 * having run. Readers who ask for reduced motion get the stroke without the
 * draw-on animation.
 */
export function Highlighter({
  children,
  className,
  action = 'highlight',
  color = 'var(--color-accent-brand-soft)',
  strokeWidth = 1.5,
  animationDuration = 600,
  delay = 0,
  iterations = 2,
  padding = 2,
  multiline = true,
  isView = false,
}: HighlighterProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(elementRef, { once: true, margin: '-10%' });
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const shouldShow = !isView || isInView;

  // biome-ignore lint/plugin: imperatively injects and tears down a rough-notation SVG measured off live DOM layout.
  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!(shouldShow && element)) return;

    let annotation: RoughAnnotation | undefined;

    const draw = () => {
      annotation = annotate(element, {
        type: action,
        color: resolveColor(element, color),
        strokeWidth,
        animationDuration,
        animate: !reducedMotion,
        iterations,
        padding,
        multiline,
      });
      annotation.show();
    };

    const startDelay = reducedMotion ? 0 : delay;
    const timer = startDelay > 0 ? globalThis.setTimeout(draw, startDelay) : undefined;
    if (timer === undefined) draw();

    return () => {
      globalThis.clearTimeout(timer);
      annotation?.remove();
    };
  }, [shouldShow, action, color, strokeWidth, animationDuration, delay, iterations, padding, multiline, reducedMotion]);

  return (
    <span className={cn('relative inline-block bg-transparent', className)}>
      <span ref={elementRef}>{children}</span>
    </span>
  );
}
