# react-marketing-ui

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
