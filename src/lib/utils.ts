import { type ClassValue, clsx } from "clsx";
import type { CSSProperties } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * A style object that may carry CSS custom properties (CSS variables)
 * such as `--duration`. React's `CSSProperties` intentionally drops
 * its index signature, so custom properties are not accepted without help.
 */
export type CSSPropertiesWithVars = CSSProperties &
  Record<`--${string}`, string | number>;

/**
 * Builds a {@link CSSProperties} value that also allows CSS custom properties,
 * so `style` props can be written without an `as React.CSSProperties` cast while
 * still type-checking both the known style keys and the custom-property values.
 *
 * @example
 * <div style={validCssVars({ '--duration': '0.35s', color: 'red' })} />
 */
export function validCssVars(style: CSSPropertiesWithVars): CSSProperties {
  return style;
}

/**
 * Narrows a union to the member(s) that declare `key` — a type-guard
 * replacement for the `in` operator's discriminated-union narrowing.
 */
export function hasKey<K extends PropertyKey>(
  key: K,
  obj: unknown,
): obj is Record<K, unknown> {
  return obj !== null && typeof obj === "object" && Object.hasOwn(obj, key);
}

export function noop(): void {
  // intentional no-op
}
