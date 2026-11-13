import type { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button"> &
  Readonly<{
    variant?: "primary" | "secondary";
  }>;

const VARIANT_CLASSES = {
  primary: "bg-accent text-accent-ink",
  secondary: "border border-line-strong text-ink",
};

const Button = ({ variant = "primary", className = "", ...props }: ButtonProps) => (
  <button
    className={`inline-flex min-h-11 cursor-pointer items-center justify-center rounded-control px-4 font-medium transition-opacity duration-150 hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60 pointer-coarse:min-h-12 ${VARIANT_CLASSES[variant]} ${className}`}
    {...props}
  />
);

export default Button;
