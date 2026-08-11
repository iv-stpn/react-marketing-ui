"use client";

import {
  type InputHTMLAttributes,
  type ReactNode,
  useId,
  useState,
} from "react";
import { cn } from "../lib/utils.js";

const FIELD_BORDER: Record<string, string> = {
  idle: "border-(--color-border)",
  focused: "border-(--color-foreground)/40",
  error: "border-(--color-destructive)",
};

const FIELD_HEIGHT: Record<string, string> = {
  sm: "h-8",
  md: "h-9",
  lg: "h-11",
};

const FIELD_SHAPE: Record<string, string> = {
  rounded: "rounded-lg",
  pill: "rounded-full",
};

const INPUT_SIZE: Record<string, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

const INPUT_PAD: Record<string, string> = {
  sm: "px-2.5",
  md: "px-3",
  lg: "px-3.5",
};

export type InputProps = {
  label?: string;
  error?: string | boolean;
  hint?: string;
  leftAdornment?: ReactNode;
  rightAdornment?: ReactNode;
  size?: "sm" | "md" | "lg";
  shape?: "rounded" | "pill";
  className?: string;
  inputClassName?: string;
  inputType?: InputHTMLAttributes<HTMLInputElement>["type"];
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "type"
>;

export function Input({
  label,
  error,
  hint,
  leftAdornment,
  rightAdornment,
  size = "md",
  shape = "rounded",
  className,
  inputClassName,
  inputType = "text",
  id: idProp,
  onFocus,
  onBlur,
  disabled,
  autoFocus,
  ...inputProps
}: InputProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const [focused, setFocused] = useState(false);
  const hasError = Boolean(error);
  const errorMessage =
    typeof error === "string" ? error : null;
  const state = hasError
    ? "error"
    : focused
      ? "focused"
      : "idle";
  const hasLeft = Boolean(leftAdornment);
  const hasRight = Boolean(rightAdornment);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <label
          htmlFor={id}
          className="px-1 font-medium text-(--color-foreground) text-sm"
        >
          {label}
        </label>
      ) : null}

      <div
        className={cn(
          "relative flex flex-row items-center overflow-hidden border",
          FIELD_BORDER[state],
          FIELD_HEIGHT[size],
          FIELD_SHAPE[shape],
          disabled && "opacity-60",
        )}
      >
        {hasLeft ? (
          <div className="pointer-events-none absolute top-0 bottom-0 left-3 z-10 flex items-center justify-center">
            {leftAdornment}
          </div>
        ) : null}

        <input
          id={id}
          type={inputType}
          disabled={disabled}
          autoFocus={autoFocus}
          onFocus={(event_) => {
            setFocused(true);
            onFocus?.(event_);
          }}
          onBlur={(event_) => {
            setFocused(false);
            onBlur?.(event_);
          }}
          className={cn(
            "h-full min-w-0 flex-1 bg-transparent text-(--color-foreground) outline-none",
            INPUT_SIZE[size],
            hasLeft
              ? "pl-10"
              : INPUT_PAD[size],
            hasRight
              ? "pr-10"
              : INPUT_PAD[size],
            inputClassName,
          )}
          {...inputProps}
        />

        {hasRight ? (
          <div className="pointer-events-none absolute top-0 right-3 bottom-0 z-10 flex items-center justify-center">
            {rightAdornment}
          </div>
        ) : null}
      </div>

      {errorMessage ? (
        <p
          role="alert"
          className="px-1 text-(--color-destructive) text-xs"
        >
          {errorMessage}
        </p>
      ) : hint ? (
        <p className="px-1 text-(--color-muted-foreground) text-xs">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
