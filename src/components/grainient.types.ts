export type GrainientProps = {
  timeSpeed?: number;
  colorBalance?: number;
  warpStrength?: number;
  warpFrequency?: number;
  warpSpeed?: number;
  warpAmplitude?: number;
  blendAngle?: number;
  blendSoftness?: number;
  rotationAmount?: number;
  noiseScale?: number;
  grainAmount?: number;
  grainScale?: number;
  grainAnimated?: boolean;
  contrast?: number;
  gamma?: number;
  saturation?: number;
  centerX?: number;
  centerY?: number;
  zoom?: number;
  color1?: string;
  color2?: string;
  color3?: string;
  /** Path to a pre-rendered WebP of this gradient (e.g. "/grainients/ocean.webp").
   *  When provided, low-power clients and prefers-reduced-motion users get the
   *  static image instead of the CSS gradient fallback — zero WebGL cost. */
  staticSrc?: string;
  className?: string;
};
