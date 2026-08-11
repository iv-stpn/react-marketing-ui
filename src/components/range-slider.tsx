"use client";

import type { ChangeEvent } from "react";
import { useCallback } from "react";

export type Tick = { value: number; label: string };

export type RangeSliderProps = {
  label: string;
  value: number;
  /** Allowed values, ascending. The first and last double as the bounds. */
  steps: number[];
  ticks: Tick[];
  valueLabel: string;
  onChange: (v: number) => void;
};

/** Index of the grid step nearest `value`, so an off-grid value still resolves. */
function nearestIndex(steps: number[], value: number) {
  return steps.reduce(
    (best, s, i) =>
      Math.abs(s - value) <
      Math.abs(steps[best]! - value)
        ? i
        : best,
    0,
  );
}

/**
 * Slider over an explicit list of allowed values rather than a uniform `step`,
 * so a grid whose span isn't a whole multiple of its increment can still reach
 * its stated ceiling.
 */
export function RangeSlider({
  label,
  value,
  steps,
  ticks,
  valueLabel,
  onChange,
}: RangeSliderProps) {
  const min = steps[0]!;
  const max = steps.at(-1) ?? min;
  const pct = ((value - min) / (max - min)) * 100;
  const index = nearestIndex(steps, value);

  const handleChange = useCallback(
    (event_: ChangeEvent<HTMLInputElement>) =>
      onChange(steps[Number(event_.target.value)]!),
    [onChange, steps],
  );

  return (
    <div className="w-full">
      <div className="mb-5 flex items-baseline justify-between gap-2">
        <p className="font-semibold text-[15px] text-(--color-foreground)">
          {label}
        </p>
        <p className="font-bold font-numeric text-[20px] text-(--color-foreground) tabular-nums">
          {valueLabel}
        </p>
      </div>

      <div className="relative" style={{ height: 20 }}>
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-(--color-border)" />
        <div
          className="pointer-events-none absolute top-1/2 left-0 h-1.5 -translate-y-1/2 rounded-full bg-(--color-foreground)"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={0}
          max={steps.length - 1}
          step={1}
          value={index}
          onChange={handleChange}
          className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
          aria-label={label}
          aria-valuetext={valueLabel}
        />
        <div
          className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--color-foreground) peer-focus-visible:outline-2 peer-focus-visible:outline-(--color-foreground) peer-focus-visible:outline-offset-2"
          style={{
            left: `${pct}%`,
            width: 16,
            height: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        />
      </div>

      <div className="relative mt-2" style={{ height: 16 }}>
        {ticks.map((tick, i) => {
          const tp =
            ((tick.value - min) / (max - min)) * 100;
          const isFirst = i === 0;
          const isLast = i === ticks.length - 1;
          let left: number | string | undefined =
            `${tp}%`;
          if (isFirst) left = 0;
          else if (isLast) left = undefined;
          return (
            <span
              key={tick.value}
              className="absolute font-numeric text-(--color-muted-foreground) text-[11px] tabular-nums"
              style={{
                left,
                right: isLast ? 0 : undefined,
                transform:
                  isFirst || isLast
                    ? undefined
                    : "translateX(-50%)",
              }}
            >
              {tick.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
