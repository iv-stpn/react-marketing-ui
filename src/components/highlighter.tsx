'use client';

import { useInView } from 'framer-motion';
import { type ReactNode, useLayoutEffect, useRef, useState } from 'react';
import { annotate } from 'rough-notation';
import type { RoughAnnotation } from 'rough-notation/lib/model';
import { useMediaQuery } from '../lib/use-media-query.js';
import { cn } from '../lib/utils.js';

type AnnotationAction = 'highlight' | 'underline' | 'box' | 'circle' | 'strike-through' | 'crossed-off' | 'bracket';

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

/**
 * The site's breakpoints, ascending, in the `rem` units Tailwind emits them in —
 * so they keep tracking the root font size the way the CSS does. Mirrored from
 * the library's `@theme` block (`xs` and `md` are custom, the rest are defaults).
 */
const BREAKPOINTS = [
  ['xs', 30],
  ['sm', 40],
  ['md', 50],
  ['lg', 64],
  ['xl', 80],
  ['2xl', 96],
] as const;

type Breakpoint = 'base' | (typeof BREAKPOINTS)[number][0];

/** `'base'` is the implicit below-`xs` band — the widths no `min-width` query claims. */
function getBreakpoint(): Breakpoint {
  let current: Breakpoint = 'base';
  for (const [name, rem] of BREAKPOINTS) {
    if (globalThis.matchMedia(`(min-width: ${rem}rem)`).matches) current = name;
  }
  return current;
}

/**
 * Call `listener` whenever the viewport crosses a breakpoint. Returns the
 * unsubscribe.
 *
 * The imperative counterpart to a `useBreakpoint` hook, for work that has to land
 * in the *same frame* as the layout change. Media-query change events fire during
 * the rendering steps, before `requestAnimationFrame` and before paint, so a
 * listener that writes to the DOM here is painted with the new layout rather than
 * one frame behind it.
 */
function onBreakpointChange(listener: () => void): () => void {
  const queries = BREAKPOINTS.map(([, rem]) => globalThis.matchMedia(`(min-width: ${rem}rem)`));
  for (const query of queries) query.addEventListener('change', listener);
  return () => {
    for (const query of queries) query.removeEventListener('change', listener);
  };
}

type HighlighterProps = {
  /** The words to annotate. Rendered inline, so they inherit the surrounding type. */
  children: ReactNode;
  className?: string;
  /**
   * Which marker stroke to draw.
   * @default 'highlight'
   */
  action?: AnnotationAction;
  /**
   * Stroke colour. Accepts a `var(--token)` string, which is resolved against
   * the live element and re-resolved whenever the theme flips.
   * @default 'var(--marker-highlight)'
   */
  color?: string;
  /** @default 1.5 */
  strokeWidth?: number;
  /** Milliseconds the stroke takes to draw itself on. @default 600 */
  animationDuration?: number;
  /**
   * Milliseconds to hold the stroke back before it starts drawing. Ignored under
   * reduced motion, where there is no draw-on to stagger.
   * @default 0
   */
  delay?: number;
  /** Passes over the same stroke, which is what makes it read as hand-drawn. @default 2 */
  iterations?: number;
  /** Pixels of slack between the text box and the stroke. @default 2 */
  padding?: number;
  /** Annotate every line the text wraps onto, rather than one box around all of them. @default true */
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
  color = 'var(--marker-highlight)',
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
  // Only a re-run trigger: the colour itself comes from the computed style, which
  // is already correct on first paint because the theme class is set before
  // hydration. The observer below bumps this whenever the class attribute flips.
  const [themeVersion, setThemeVersion] = useState(0);

  const shouldShow = !isView || isInView;

  // Theme flips land as a class swap on <html> (the `.dark` class toggled by the
  // theme provider), and rough-notation bakes the *resolved* token into the
  // SVG's stroke attribute — which does not track var(). Re-running the draw
  // effect with a freshly resolved colour is what repaints the stroke.
  useLayoutEffect(() => {
    const observer = new MutationObserver(() => setThemeVersion((v) => v + 1));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Imperatively injects and tears down a rough-notation SVG measured off live
  // DOM layout — a post-render side effect with no render-time equivalent.
  // biome-ignore lint/correctness/useExhaustiveDependencies: `themeVersion` is a redraw trigger, not a read value — the token resolves to a different colour per theme, so a flip has to repaint the stroke.
  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!(shouldShow && element)) return;

    let annotation: RoughAnnotation | undefined;
    let untrack: (() => void) | undefined;

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

      // The wrapper below already carries the stroke wherever the page moves the
      // text, so the only thing left that can stale it is a change in the text's
      // own shape — which on a breakpoint-driven layout means a breakpoint. This
      // is subscribed directly rather than through a `useBreakpoint` hook because
      // a React state round-trip commits a frame or more after the browser has
      // painted the new layout, which is exactly the lag being chased out.
      // `show()` on a still-showing annotation re-renders un-animated, so the
      // stroke resizes without replaying the draw-on.
      let drawnAt = getBreakpoint();
      untrack = onBreakpointChange(() => {
        const current = getBreakpoint();
        if (current === drawnAt) return;
        drawnAt = current;
        annotation?.show();
      });
    };

    const startDelay = reducedMotion ? 0 : delay;
    const timer = startDelay > 0 ? globalThis.setTimeout(draw, startDelay) : undefined;
    if (timer === undefined) draw();

    return () => {
      globalThis.clearTimeout(timer);
      untrack?.();
      annotation?.remove();
    };
  }, [
    shouldShow,
    action,
    color,
    strokeWidth,
    animationDuration,
    delay,
    iterations,
    padding,
    multiline,
    reducedMotion,
    themeVersion,
  ]);

  // Two spans, and both earn their place.
  //
  // rough-notation injects its SVG as a *sibling* of the annotated element, laid
  // out `position: absolute; top: 0; left: 0`, with the stroke's coordinates baked
  // as offsets from wherever that SVG lands. Left alone it resolves against
  // whatever positioned ancestor it happens to find — for a centred, shrink-wrapped
  // page section, effectively the viewport — so every reflow that slid the text
  // sideways slid it out from under its own stroke, and only a redraw put it back.
  // The `relative` wrapper makes the SVG resolve against a box the text sits
  // inside instead, so the two now move as one and no listener is involved.
  //
  // The inner span stays plain `inline`, which is what makes `multiline` work:
  // `getClientRects()` on an inline reports one box per line, so wrapped text gets
  // a stroke per line rather than one slab drawn around the whole paragraph.
  return (
    <span className={cn('relative inline-block bg-transparent', className)}>
      <span ref={elementRef}>{children}</span>
    </span>
  );
}

export type { AnnotationAction, HighlighterProps };
