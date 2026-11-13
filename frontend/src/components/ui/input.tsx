import type { ComponentProps } from "react";

const Input = ({ className = "", ...props }: ComponentProps<"input">) => (
  <input
    className={`min-h-11 w-full min-w-0 rounded-control border border-line-strong bg-surface px-3 text-base text-ink pointer-coarse:min-h-12 ${className}`}
    {...props}
  />
);

export default Input;
