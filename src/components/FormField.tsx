"use client";
import React, { ComponentPropsWithoutRef, useId, useState } from "react";
import { Input } from "./Input";
import { cx } from "class-variance-authority";
import { MinusCircle } from "~/icons/MinusCircle";
import { Button } from "./Button";

export const FormField = React.forwardRef<
  HTMLInputElement,
  {
    label: string;
    onLabelChange?: (label: string) => void;
    onDeletion?: () => void;
  } & ComponentPropsWithoutRef<typeof Input>
>(function FormField(
  { label, className, onDeletion, onLabelChange, ...rest },
  ref,
) {
  const errId = useId();
  const labelId = useId();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  return (
    <div className="relative flex flex-col">
      <div className="flex gap-2">
        <div className="absolute left-4 top-2 text-xs text-gray-500 dark:text-gray-400">
          {!onLabelChange ? (
            <span id={labelId}>{label}</span>
          ) : (
            <input
              aria-label={`Rename the custom form element of ${label}`}
              id={labelId}
              className="bg-transparent focus-visible:text-black dark:text-gray-400 dark:focus-visible:text-white"
              value={label}
              onChange={(e) => onLabelChange(e.currentTarget.value)}
            />
          )}
        </div>
        <Input
          ref={ref}
          className={cx(className, errorMessage && "form-input")}
          aria-labelledby={labelId}
          aria-invalid={!!errorMessage}
          aria-errormessage={errorMessage ? errId : undefined}
          name={label}
          {...rest}
          onBlur={(e) => {
            setErrorMessage(e.currentTarget.validationMessage);
          }}
          onChange={(e) => {
            if (errorMessage) {
              setErrorMessage(e.currentTarget.validationMessage);
            }
          }}
          placeholder={rest.placeholder ?? " "}
        />
        {onDeletion && (
          <Button shape="none" variant="ghost" onClick={() => onDeletion()}>
            <MinusCircle className="text-red-400" />
          </Button>
        )}
      </div>

      {errorMessage && (
        <p
          id={errId}
          className="mb-2 mt-1 whitespace-normal break-all text-sm leading-tight tracking-tight text-red-400"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
});
