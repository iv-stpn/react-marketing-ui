# react-marketing-ui

## 0.0.5

### Patch Changes

- [`260db62`](https://github.com/iv-stpn/react-marketing-ui/commit/260db62cea415fdf4fe4018a06bdc05b5aa53874) Thanks [@iv-stpn](https://github.com/iv-stpn)! - Add `FooterGlow` (`react-marketing-ui/footer-glow`) — the blurred brand-glow band
  behind footer/CTA closers (Lovable-style). Ported byte-identical from the
  offkeep marketing site's `components/FooterGlow.tsx`: a full-bleed
  bottom-anchored layer carrying a horizontal hue sweep (cyan → blue → violet →
  pink) masked to fade out towards the top (flat ramp below `md`, wide arched
  ellipse from `md` up), with a scroll-linked fade+rise reveal
  (`useScroll`/`useTransform`). Place it inside a `relative` wrapper taller than
  the visible wash: it clips itself, so the parent needs no `overflow-hidden`.
  Ships a default export (same as the site's local component), no props.

## 0.0.4

### Patch Changes

- Set `splitting: false` in tsup so every entry ships as one self-contained file with its `'use client'` directive at the top. Code-split shared chunks stripped the directive, so Next.js SSR treated hook-using components (ActionSwapRoll, ThemeToggle, …) as server modules and crashed on client hooks (`useReducedMotion` from the server).

## 0.0.3

### Patch Changes

- Fix the `exports` map shape for every subpath: `import` now points at the true ESM build (`dist/*.mjs`) and `require` at the CJS build (`dist/*.js`) — the previous map pointed `import` at CJS and `require` at non-existent `dist/*.cjs` files, breaking Next.js SSR consumers (`createContext is not a function`).

## 0.0.2

### Patch Changes

- Fix the `lib/surface`, `lib/breakpoints`, `lib/ease` exports map entries — the declarations live at `dist/lib/*` (tsup nests lib entries), not `dist/*`.

## 0.0.1

### Patch Changes

- [`56377b3`](https://github.com/iv-stpn/react-marketing-ui/commit/56377b30cab6fc5453d130988d095e3386b8bc57) Thanks [@iv-stpn](https://github.com/iv-stpn)! - Initial release 0.0.1: marketing page UI components ported from the offkeep marketing site — Button, GlossyButton, ActionSwapRoll (text/icon), SavingsBadge, ThemeToggle, Grainient (WebGL), FlowchartParts, NavigationMenu, Card, Accordion, Highlighter, FeatureCard, AnimatedBeam, FadeIn, SparklesText, DiaTextReveal, Input, PasswordInput, and more, plus the full surface/elevation/glossy token system.
