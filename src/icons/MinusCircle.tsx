import { cx } from "class-variance-authority";
import React from "react";

// hero-icon minus-circle
export const MinusCircle = React.forwardRef<
  SVGSVGElement,
  React.SVGAttributes<SVGElement>
>(function MinusCircle(props, forwardedRef) {
  return (
    <svg
      {...props}
      ref={forwardedRef}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={cx(props.className, "size-6")}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
});
