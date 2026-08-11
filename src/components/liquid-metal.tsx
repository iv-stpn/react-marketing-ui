'use client';

import { LiquidMetal as LiquidMetalShader } from '@paper-design/shaders-react';
import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../lib/utils.js';

/* ── Shader wrapper ────────────────────────────────────── */

export type LiquidMetalProps = {
  /** Base background color of the liquid metal. */
  colorBack?: string;
  /** Tint / highlight color for the chrome effect. */
  colorTint?: string;
  /** Animation speed (0.1–2.0 recommended). */
  speed?: number;
  /** Pattern stripe density (1–10). */
  repetition?: number;
  /** Wave distortion amount (0–1). */
  distortion?: number;
  /** Texture zoom (0.01–4). */
  scale?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Full-bleed animated liquid-metal shader. Absolutely positioned to fill its
 * nearest positioned ancestor; the WebGL canvas is decorative, so it is hidden
 * from assistive tech and never intercepts pointer events.
 */
export function LiquidMetal({
  colorBack = '#aaaaac',
  colorTint = '#ffffff',
  speed = 0.5,
  repetition = 4,
  distortion = 0.1,
  scale = 1,
  className,
  style,
}: LiquidMetalProps) {
  return (
    <div aria-hidden={true} className={cn('pointer-events-none absolute inset-0 z-0 overflow-hidden', className)} style={style}>
      <LiquidMetalShader
        colorBack={colorBack}
        colorTint={colorTint}
        speed={speed}
        repetition={repetition}
        distortion={distortion}
        softness={0}
        shiftRed={0.3}
        shiftBlue={-0.3}
        angle={45}
        shape="none"
        scale={scale}
        fit="cover"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
