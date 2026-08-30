# react-marketing-ui

Reusable landing-page UI components for React — animated text reveals, shader effects, magnetic tabs, and scroll-triggered entrances.

Ported from the [offkeep](https://offkeep.com) marketing site into a standalone library.

## Install

```bash
bun add react-marketing-ui
```

## Components

- **SparklesText** — text wrapped in continuously respawning sparkle stars
- **RainbowButton** — animated gradient-border CTA button
- **ShineBorder** — animated shine-border overlay effect
- **LiquidMetal** — full-bleed animated liquid-metal WebGL shader
- **Tabs** — magnetic pill tabs with hover-stretch and inverted labels
- **Highlighter** — hand-drawn rough-notation marker strokes
- **DiaTextReveal** — gradient text reveal with rotating lines
- **FadeIn / Stagger / StaggerItem** — scroll-triggered entrance animations

## Utilities

- `cn` — clsx + tailwind-merge helper
- `validCssVars` — CSS custom properties in style objects
- `useMediaQuery` — reactive media-query hook

## Storybook

```bash
bun dev
```
