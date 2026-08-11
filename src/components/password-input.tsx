"use client";

import { useCallback, useState } from "react";
import { Input, type InputProps } from "./input.js";

export type PasswordInputProps = Omit<
  InputProps,
  "rightAdornment" | "inputType"
> & {
  inputType?: "password" | "new-password";
};

export function PasswordInput({
  inputType = "password",
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  const toggle = useCallback(
    () => setVisible((v) => !v),
    [],
  );

  const eye = (
    <button
      type="button"
      onClick={toggle}
      className="pointer-events-auto cursor-pointer text-(--color-muted-foreground) hover:text-(--color-foreground)"
      aria-label={visible ? "Hide password" : "Show password"}
      tabIndex={-1}
    >
      {visible ? (
        <EyeOffIcon className="size-5" />
      ) : (
        <EyeIcon className="size-5" />
      )}
    </button>
  );

  return (
    <Input
      {...props}
      inputType={visible ? "text" : "password"}
      rightAdornment={eye}
      autoComplete={
        inputType === "new-password"
          ? "new-password"
          : "current-password"
      }
    />
  );
}

function EyeIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
      <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
      <path d="m2 2 20 20" />
    </svg>
  );
}
