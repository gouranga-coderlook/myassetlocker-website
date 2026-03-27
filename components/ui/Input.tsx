"use client";

import * as React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
  rightAdornment?: React.ReactNode;
  labelRightAdornment?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      id,
      className = "",
      containerClassName = "",
      rightAdornment,
      labelRightAdornment,
      required,
      ...props
    },
    ref,
  ) => {
    const resolvedId = id ?? props.name;
    const shouldShowRequiredAsterisk =
      Boolean(required) &&
      typeof label === "string" &&
      !label.trimEnd().endsWith("*");

    return (
      <div className={containerClassName}>
        {label && resolvedId && (
          <div className="mb-2 flex items-center justify-between gap-3">
            <label
              htmlFor={resolvedId}
              className="block text-sm font-semibold text-gray-700"
            >
              {label}
              {shouldShowRequiredAsterisk && <span className="ml-1 text-red-500">*</span>}
            </label>
            {labelRightAdornment}
          </div>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={resolvedId}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              rightAdornment ? "pr-12" : ""
            } ${
              error
                ? "border-red-500 bg-red-50 focus:border-red-500"
                : "border-gray-300 focus:border-[#f8992f]"
            } ${className}`}
            aria-invalid={!!error}
            aria-describedby={error && resolvedId ? `${resolvedId}-error` : undefined}
            required={required}
            {...props}
          />

          {rightAdornment && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightAdornment}
            </div>
          )}
        </div>

        {error && resolvedId && (
          <p id={`${resolvedId}-error`} className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;

