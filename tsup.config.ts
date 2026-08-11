import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "sparkles-text": "src/components/sparkles-text.tsx",
    "rainbow-button": "src/components/rainbow-button.tsx",
    "shine-border": "src/components/shine-border.tsx",
    "liquid-metal": "src/components/liquid-metal.tsx",
    tabs: "src/components/tabs.tsx",
    highlighter: "src/components/highlighter.tsx",
    "fade-in": "src/components/fade-in.tsx",
    "dia-text-reveal": "src/components/dia-text-reveal.tsx",
    "lib/cn": "src/lib/utils.ts",
    "lib/use-media-query": "src/lib/use-media-query.ts",
  },
  format: ["cjs", "esm"],
  dts: false,
  treeshake: true,
  clean: true,
  sourcemap: true,
  external: [
    "react",
    "react-dom",
    "framer-motion",
    "@radix-ui/react-slot",
    "@paper-design/shaders-react",
    "rough-notation",
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
  ],
});
