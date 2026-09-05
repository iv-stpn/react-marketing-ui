'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useId, useRef } from 'react';

/**
 * Blurred brand glow behind the footer card — inspired by the Lovable footer.
 * A single full-bleed band carries a horizontal hue sweep (cyan → blue → brand
 * violet → pink) and is masked so it fades out towards the top: on wide screens
 * a very wide ellipse anchored to the bottom edge gives a shallow arch (solid to
 * the corners at the base, cresting in the middle); below `md` the same ramp runs
 * straight up, because at narrow widths the arch has no room to read as a curve
 * and just looks like a lopsided top edge. The wash reads as one even sheet of
 * colour with no bar seams and no hard cut against `overflow-hidden`. It fades +
 * rises into place as the footer scrolls into view (scroll-linked, not a
 * one-shot), and stays static when the user prefers reduced motion.
 *
 * Both masks are always in the markup and CSS picks between them, so the static
 * export is correct at every width without a JS width branch.
 */

const VB_W = 1270;
const VB_H = 600;
// The band's top: the vertical fade reaches full transparency at the very top of
// the layer, which itself overhangs the footer (see OVERHANG) — so the glow dies
// out in open air above the footer rather than against a clipped edge.
const BAND_TOP = 0;
// How far the glow layer reaches above the footer's top edge, into the CTA
// section. Only the faint tail of the fade lands up there.
const OVERHANG = '0.5rem';
// Overshoot — the band runs past the viewBox on the sides and below so the
// colour stays full-bleed to the footer's edges even while the scroll transform
// nudges it downwards.
const OVERSHOOT = 60;
const BAND_X = -OVERSHOOT;
const BAND_W = VB_W + OVERSHOOT * 2;
const BAND_H = VB_H + OVERSHOOT;

// Hue sweep across the width. Saturation + lightness are constant so no column
// reads brighter than its neighbours; only the hue moves.
const HUES = [188, 210, 232, 250, 262 /* centre — brand violet */, 285, 308, 330, 350];

// Arch curvature, as a multiple of the band width: the horizontal radius of the
// fade's ellipse. Larger = flatter. At 1.35 the outer edges give out ~7% of the
// footer's height below the centre — a shallow crown, not a dome. The bottom
// corners stay well inside the solid core, so the base is still edge-to-edge.
const ARCH_RX = VB_W * 1.35;

// Alpha ramp from the solid base outwards (bottom → top, or centre-bottom → rim
// of the ellipse for the arched variant). Solid through the lower two thirds,
// then a tight falloff — holding full opacity that long is what keeps the band
// reading as a defined sheet of colour instead of a diffuse haze. The ellipse's
// rim lands exactly on BAND_TOP along the centre line, so both variants agree
// down the middle; the arch only differs by the sides reaching zero sooner.
const FADE_STOPS = [
  { offset: 0, opacity: 1 },
  { offset: 0.62, opacity: 1 },
  { offset: 0.81, opacity: 0.8 },
  { offset: 0.93, opacity: 0.35 },
  { offset: 1, opacity: 0 },
];

// Peak wash opacity. The glow sits *behind* the opaque card (footer on top), so
// only the part above the card shows — it can carry rich, saturated colour.
const MAX_OPACITY = 0.85;

function FadeStops() {
  return FADE_STOPS.map(({ offset, opacity }) => (
    <stop key={offset} offset={offset} style={{ stopColor: '#fff', stopOpacity: opacity }} />
  ));
}

export default function FooterGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const uid = useId();
  const hueId = `footer-glow-hue-${uid}`;
  const flatFadeId = `footer-glow-fade-flat-${uid}`;
  const archFadeId = `footer-glow-fade-arch-${uid}`;
  const flatMaskId = `footer-glow-mask-flat-${uid}`;
  const archMaskId = `footer-glow-mask-arch-${uid}`;

  // Progress runs 0 → 1 as the layer's top edge travels from the bottom of the
  // viewport to its middle. Deliberately viewport-relative rather than tied to
  // the footer's own height: the footer is several screens tall once the link
  // columns stack, and anchoring the end to it ('end end') meant the glow only
  // finished rising at the very bottom of the page on a phone. Half a viewport
  // of travel puts it in place early and behaves the same at every width.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start center'] });

  const y = useTransform(scrollYProgress, [0, 0.7, 1], ['55%', '5%', '2%']);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [0, MAX_OPACITY]);

  // Full-bleed background layer, anchored to the footer's bottom and one overhang
  // taller than it, so the band scales with the footer while spilling above its
  // top edge. It clips itself rather than relying on the footer: that keeps the
  // sides and the scroll-transformed bottom contained (no stray page overflow)
  // while leaving the top free. `pointer-events-none` keeps the CTA above it
  // clickable through the spill.
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden"
      style={{ height: `calc(100% + ${OVERHANG})` }}
    >
      <motion.svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="none"
        className="h-full w-full"
        overflow="visible"
        style={reduce ? { opacity: MAX_OPACITY } : { y, opacity }}
      >
        <defs>
          <linearGradient id={hueId} x1="0" y1="0" x2="1" y2="0">
            {HUES.map((hue, i) => (
              <stop key={hue} offset={i / (HUES.length - 1)} style={{ stopColor: `hsl(${hue} 95% 55%)` }} />
            ))}
          </linearGradient>

          {/* Flat variant — a straight bottom-to-top ramp. */}
          <linearGradient id={flatFadeId} gradientUnits="userSpaceOnUse" x1="0" y1={VB_H} x2="0" y2={BAND_TOP}>
            <FadeStops />
          </linearGradient>

          {/* Arched variant — a circle of radius (VB_H - BAND_TOP) centred on the
              bottom edge, stretched horizontally into a very wide ellipse; that
              stretch is the arch. Both use userSpaceOnUse so the geometry is
              absolute, independent of the rect's bounding box (which overshoots
              the viewBox on three sides). */}
          <radialGradient
            id={archFadeId}
            gradientUnits="userSpaceOnUse"
            cx={VB_W / 2}
            cy={VB_H}
            r={VB_H - BAND_TOP}
            gradientTransform={`translate(${VB_W / 2} 0) scale(${ARCH_RX / (VB_H - BAND_TOP)} 1) translate(${-VB_W / 2} 0)`}
          >
            <FadeStops />
          </radialGradient>

          {[
            { id: flatMaskId, fill: flatFadeId },
            { id: archMaskId, fill: archFadeId },
          ].map(({ id, fill }) => (
            <mask key={id} id={id} maskUnits="userSpaceOnUse" x={BAND_X} y="0" width={BAND_W} height={BAND_H}>
              <rect x={BAND_X} y="0" width={BAND_W} height={BAND_H} fill={`url(#${fill})`} />
            </mask>
          ))}
        </defs>
        <rect
          x={BAND_X}
          y="0"
          width={BAND_W}
          height={BAND_H}
          fill={`url(#${hueId})`}
          mask={`url(#${flatMaskId})`}
          className="md:hidden"
        />
        <rect
          x={BAND_X}
          y="0"
          width={BAND_W}
          height={BAND_H}
          fill={`url(#${hueId})`}
          mask={`url(#${archMaskId})`}
          className="hidden md:block"
        />
      </motion.svg>
    </div>
  );
}
