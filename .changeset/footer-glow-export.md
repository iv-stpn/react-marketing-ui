---
"react-marketing-ui": patch
---

Add `FooterGlow` (`react-marketing-ui/footer-glow`) — the blurred brand-glow band
behind footer/CTA closers (Lovable-style). Ported byte-identical from the
offkeep marketing site's `components/FooterGlow.tsx`: a full-bleed
bottom-anchored layer carrying a horizontal hue sweep (cyan → blue → violet →
pink) masked to fade out towards the top (flat ramp below `md`, wide arched
ellipse from `md` up), with a scroll-linked fade+rise reveal
(`useScroll`/`useTransform`). Place it inside a `relative` wrapper taller than
the visible wash: it clips itself, so the parent needs no `overflow-hidden`.
Ships a default export (same as the site's local component), no props.
