'use client';

import { Mesh, Renderer, Triangle } from 'ogl';
import { useEffect, useRef } from 'react';
import { cn } from '../lib/utils.js';
import { createGrainientProgram, ctxMap } from './grainient.shader.js';
import type { GrainientProps } from './grainient.types.js';
import './grainient.css';

const HEX_COLOR_RE = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

const hexToRgb = (hex: string): [number, number, number] => {
  const result = HEX_COLOR_RE.exec(hex);
  if (!result) return [1, 1, 1];
  // The regex guarantees all three capture groups when it matches; the defaults
  // only silence noUncheckedIndexedAccess.
  const [, r = 'ff', g = 'ff', b = 'ff'] = result;
  return [Number.parseInt(r, 16) / 255, Number.parseInt(g, 16) / 255, Number.parseInt(b, 16) / 255];
};

// framer-motion's MotionConfig only governs declarative motion.* components, so
// this raw-WebGL canvas carries its own prefers-reduced-motion check.
const prefersReducedMotion = () =>
  typeof globalThis !== 'undefined' && globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

// The home page mounts four Grainient canvases at once; browsers cap live WebGL
// contexts (~8-16) and each costs GPU/CPU. On low-power clients — narrow viewports
// or few CPU cores — skip WebGL and let the static background stand in.
const isLowPowerClient = () => {
  if (typeof globalThis === 'undefined') return false;
  const narrow = globalThis.matchMedia?.('(max-width: 1023px)').matches === true;
  const fewCores =
    typeof navigator !== 'undefined' && typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4;
  return narrow || fewCores;
};

// A tiling SVG feTurbulence tile that stands in for the shader's film grain,
// inlined so it needs no network request.
const GRAIN_LAYER = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.12'/%3E%3C/svg%3E")`;

// CSS gradient fallback when no pre-rendered image is available.
const fallbackGradient = (c1: string, c2: string, c3: string) =>
  `${GRAIN_LAYER}, linear-gradient(135deg, ${c1} 0%, ${c2} 55%, ${c3} 100%)`;

// Apply a pre-rendered static image as a cover background.
const applyStaticBg = (el: HTMLDivElement, src: string) => {
  el.style.backgroundImage = `url(${src})`;
  el.style.backgroundSize = 'cover';
  el.style.backgroundPosition = 'center';
};

// Build the WebGL context, wire up resize/visibility observers, and run the
// render loop. Returns a cleanup that tears everything back down.
function initGrainient(container: HTMLDivElement): () => void {
  const renderer = new Renderer({
    webgl: 2,
    alpha: true,
    antialias: false,
    dpr: Math.min(globalThis.devicePixelRatio || 1, 2),
  });

  const gl = renderer.gl;
  const canvas = gl.canvas;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  container.appendChild(canvas);

  const geometry = new Triangle(gl);
  const program = createGrainientProgram(gl);
  const mesh = new Mesh(gl, { geometry, program });
  ctxMap.set(container, { renderer, program, mesh });

  const setSize = () => {
    const rect = container.getBoundingClientRect();
    renderer.setSize(Math.max(1, Math.floor(rect.width)), Math.max(1, Math.floor(rect.height)));
    const res: Float32Array = program.uniforms.iResolution.value;
    res[0] = gl.drawingBufferWidth;
    res[1] = gl.drawingBufferHeight;
    renderer.render({ scene: mesh });
  };

  const ro = new ResizeObserver(setSize);
  ro.observe(container);
  setSize();

  let raf = 0;
  let isVisible = true;
  let isPageVisible = !document.hidden;
  const t0 = performance.now();

  const loop = (t: number) => {
    program.uniforms.iTime.value = (t - t0) * 0.001;
    renderer.render({ scene: mesh });
    raf = requestAnimationFrame(loop);
  };

  const tryStart = () => {
    if (isVisible && isPageVisible && raf === 0) raf = requestAnimationFrame(loop);
  };
  const tryStop = () => {
    if (raf !== 0) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  // Reduced motion: render a single static frame and never start the RAF loop.
  const reduce = prefersReducedMotion();

  const io = new IntersectionObserver(
    ([entry]) => {
      if (!entry) return;
      isVisible = entry.isIntersecting;
      if (isVisible) tryStart();
      else tryStop();
    },
    { threshold: 0 },
  );
  if (!reduce) io.observe(container);

  const onVisibility = () => {
    isPageVisible = !document.hidden;
    if (isPageVisible) tryStart();
    else tryStop();
  };
  if (!reduce) document.addEventListener('visibilitychange', onVisibility);
  if (!reduce) tryStart();

  return () => {
    tryStop();
    ro.disconnect();
    io.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    ctxMap.delete(container);
    try {
      container.removeChild(canvas);
    } catch {
      /* ignore */
    }
  };
}

const Grainient = (props: GrainientProps) => {
  const {
    timeSpeed = 0.25,
    colorBalance = 0.0,
    warpStrength = 1.0,
    warpFrequency = 5.0,
    warpSpeed = 2.0,
    warpAmplitude = 50.0,
    blendAngle = 0.0,
    blendSoftness = 0.05,
    rotationAmount = 500.0,
    noiseScale = 2.0,
    grainAmount = 0.1,
    grainScale = 2.0,
    grainAnimated = false,
    contrast = 1.5,
    gamma = 1.0,
    saturation = 1.0,
    centerX = 0.0,
    centerY = 0.0,
    zoom = 0.9,
    color1 = '#FF9FFC',
    color2 = '#5227FF',
    color3 = '#B497CF',
    staticSrc = '',
    className = '',
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  // Set once on mount: when true, WebGL is skipped and a static background stands in.
  const fallbackRef = useRef(false);

  // Effect 1: build WebGL context once, pause when offscreen / tab hidden.
  // When a pre-rendered image is available, low-power clients and
  // prefers-reduced-motion users get it as a zero-GPU-cost background.
  // The renderer is created once on mount; color changes are handled in Effect 2.
  // biome-ignore lint/plugin: creates the WebGL renderer once on mount and tears it down on unmount — imperative GPU setup with no derived-state form.
  // biome-ignore lint/correctness/useExhaustiveDependencies: mount-only WebGL setup; color/staticSrc changes are handled in Effect 2.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (isLowPowerClient() || prefersReducedMotion()) {
      fallbackRef.current = true;
      container.dataset.fallback = 'true';
      if (staticSrc) applyStaticBg(container, staticSrc);
      else container.style.background = fallbackGradient(color1, color2, color3);
      return;
    }
    return initGrainient(container);
  }, []); // renderer created once

  // Effect 2: sync props to uniforms — zero GPU cost, no teardown.
  // biome-ignore lint/plugin: imperatively writes props into mutable WebGL uniform objects (an external system); there is no render-time equivalent.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Fallback clients have no WebGL context; re-apply the background so a
    // later color/src change still reaches the static background.
    if (fallbackRef.current) {
      if (staticSrc) applyStaticBg(container, staticSrc);
      else container.style.background = fallbackGradient(color1, color2, color3);
      return;
    }

    const ctx = ctxMap.get(container);
    if (!ctx) return;

    const { program, renderer, mesh } = ctx;
    const u = program.uniforms;

    u.uTimeSpeed.value = timeSpeed;
    u.uColorBalance.value = colorBalance;
    u.uWarpStrength.value = warpStrength;
    u.uWarpFrequency.value = warpFrequency;
    u.uWarpSpeed.value = warpSpeed;
    u.uWarpAmplitude.value = warpAmplitude;
    u.uBlendAngle.value = blendAngle;
    u.uBlendSoftness.value = blendSoftness;
    u.uRotationAmount.value = rotationAmount;
    u.uNoiseScale.value = noiseScale;
    u.uGrainAmount.value = grainAmount;
    u.uGrainScale.value = grainScale;
    u.uGrainAnimated.value = grainAnimated ? 1.0 : 0.0;
    u.uContrast.value = contrast;
    u.uGamma.value = gamma;
    u.uSaturation.value = saturation;
    u.uCenterOffset.value = new Float32Array([centerX, centerY]);
    u.uZoom.value = zoom;
    u.uColor1.value = new Float32Array(hexToRgb(color1));
    u.uColor2.value = new Float32Array(hexToRgb(color2));
    u.uColor3.value = new Float32Array(hexToRgb(color3));

    // Under reduced motion the RAF loop never starts; draw one frame here so
    // the real colors appear (the first frame from setSize() is all-white).
    if (prefersReducedMotion()) renderer.render({ scene: mesh });
  }, [
    timeSpeed,
    colorBalance,
    warpStrength,
    warpFrequency,
    warpSpeed,
    warpAmplitude,
    blendAngle,
    blendSoftness,
    rotationAmount,
    noiseScale,
    grainAmount,
    grainScale,
    grainAnimated,
    contrast,
    gamma,
    saturation,
    centerX,
    centerY,
    zoom,
    color1,
    color2,
    color3,
    staticSrc,
  ]);

  return <div ref={containerRef} className={cn('grainient-container', className)} />;
};

export default Grainient;
