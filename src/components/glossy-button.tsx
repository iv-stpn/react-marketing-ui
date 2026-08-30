import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { cn } from '../lib/utils.js';

/**
 * Physically-lit button: a domed, back-lit key built from one effect layer.
 *
 * The geometry lives in a single `box-shadow` list that gets swapped wholesale on
 * press, so the bevel and cast can drop out while the rim survives without any
 * of them being separate elements:
 *
 *   • the gloss span  — face fill + the shadow list (bevel, rim, cast).
 *   • its `before:`   — the dome gradient, painted over the face.
 *   • its `after:`    — the hover/press tint, the only thing that cross-fades.
 *
 * The recipe lives in `global.css`. Every colour is a `--btn-*` primitive, and
 * the two shadow composites are declared on `.glossy` — on the key itself, not
 * on `:root` — because a var() inside a custom property is substituted where the
 * property is *declared*. That's what lets one `.glossy-<variant>` class restyle
 * the whole recipe by setting primitives, and it's why there are no `dark:`
 * variants here: `.dark` overrides the same primitives.
 *
 * The span is a sibling of the label rather than its parent so the label never
 * inherits the effect layers' stacking or transitions; `isolate` on the root
 * contains the span's negative z-index.
 *
 * Server-renderable: every state is pure CSS. Passing a function as
 * `actionOrLink` requires a client-component parent, as with any onClick prop.
 */

/**
 * The whole visual treatment. Absolutely positioned behind the label, with the
 * dome (`before:`) and the interaction tint (`after:`) stacked over the face.
 * Only the tint animates opacity; the shadow list animates by being replaced.
 */
const glossLayer = cn(
  'pointer-events-none absolute inset-0 z-[-1] rounded-[inherit]',
  '[background-color:var(--btn-face)] [box-shadow:var(--shadow-button)]',
  'transition-shadow duration-150',
  // Pressed (and disabled): bevel + cast go transparent, the rim stays.
  'group-active/glossy:[box-shadow:var(--shadow-button-pressed)]',
  'group-disabled/glossy:[box-shadow:var(--shadow-button-pressed)]',
  // Dome — fixed direction, per-variant stops. Above the face, below the tint.
  "before:absolute before:inset-0 before:rounded-[inherit] before:content-[''] before:[background-image:var(--gradient-button)]",
  // Interaction tint. Hidden outright when disabled, and on touch (no hover
  // state to speak of) so the root's active:opacity can carry the press instead.
  "after:absolute after:inset-0 after:rounded-[inherit] after:content-[''] after:opacity-0",
  'after:[background-color:var(--btn-tint-hover)] after:transition-opacity after:duration-150 after:[will-change:opacity]',
  'group-hover/glossy:after:opacity-100',
  'group-active/glossy:after:[background-color:var(--btn-tint-active)]',
  'group-disabled/glossy:after:hidden [@media(hover:none)]:after:hidden',
);

const glossyButtonVariants = cva(
  cn(
    'glossy group/glossy relative isolate inline-flex cursor-pointer select-none items-center justify-center gap-1 whitespace-nowrap rounded-full font-normal',
    // Label colour rides the variant. Kept as a utility rather than a plain
    // declaration on `.glossy` so a caller's own text-* class still wins.
    '[color:var(--btn-fg)]',
    'disabled:cursor-default disabled:opacity-50',
    // Touch devices get no hover layer, so the whole key dims on press instead.
    '[@media(hover:none)]:active:opacity-80',
  ),
  {
    variants: {
      size: {
        sm: 'h-8 px-2.5 text-sm',
        md: 'h-9 px-5 text-[17px]',
        lg: 'h-11 px-6 text-[17px]',
      },
      /**
       * Written out as literal class names — Tailwind's scanner is static, so a
       * `glossy-${variant}` template would never make it into the stylesheet.
       * `neutral` is the bare recipe, so it needs no class of its own.
       */
      variant: {
        neutral: '',
        accent: 'glossy-accent',
        destructive: 'glossy-destructive',
        special: 'glossy-special',
        positive: 'glossy-positive',
        attention: 'glossy-attention',
        highlight: 'glossy-highlight',
        inverse: 'glossy-inverse',
      },
    },
    defaultVariants: { size: 'md', variant: 'neutral' },
  },
);

export type GlossyButtonProps = VariantProps<typeof glossyButtonVariants> & {
  /**
   * String  → renders as a plain <a href={...}>.
   * Function → renders as a <button type="button" onClick={...}>.
   */
  actionOrLink: string | (() => void);
  children: ReactNode;
  /** Button-only — an anchor can't be disabled. */
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
};

export function GlossyButton({
  size,
  variant,
  actionOrLink,
  children,
  disabled,
  className,
  'aria-label': ariaLabel,
}: GlossyButtonProps) {
  const content = (
    <>
      <span data-fx-layer="gloss" aria-hidden={true} className={glossLayer} />
      <span className="px-0.5">{children}</span>
    </>
  );

  const buttonClassName = cn(glossyButtonVariants({ size, variant }), className);

  if (typeof actionOrLink === 'string')
    return (
      <a href={actionOrLink} className={cn(buttonClassName, 'no-underline')} aria-label={ariaLabel}>
        {content}
      </a>
    );

  return (
    <button type="button" className={buttonClassName} onClick={actionOrLink} disabled={disabled} aria-label={ariaLabel}>
      {content}
    </button>
  );
}

export { glossyButtonVariants };
