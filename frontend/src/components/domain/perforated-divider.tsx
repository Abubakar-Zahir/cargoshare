import { cn } from "cn";

const notch =
  "before:absolute before:border before:border-line before:bg-bg before:content-[''] after:absolute after:border after:border-line after:bg-bg after:content-['']";

const orientationClasses = {
  horizontal: {
    line: "relative h-0 w-full border-t-2 border-dashed border-line",
    notches:
      "before:top-1/2 before:-left-px before:h-6 before:w-3 before:-translate-y-1/2 before:rounded-r-full before:border-l-0 after:top-1/2 after:-right-px after:h-6 after:w-3 after:-translate-y-1/2 after:rounded-l-full after:border-r-0",
  },
  vertical: {
    line: "relative w-0 self-stretch border-l-2 border-dashed border-line",
    notches:
      "before:-top-px before:left-1/2 before:h-3 before:w-6 before:-translate-x-1/2 before:rounded-b-full before:border-t-0 after:-bottom-px after:left-1/2 after:h-3 after:w-6 after:-translate-x-1/2 after:rounded-t-full after:border-b-0",
  },
} as const;

export function PerforatedDivider({
  orientation = "horizontal",
  notches = false,
  className,
}: {
  orientation?: keyof typeof orientationClasses;
  notches?: boolean;
  className?: string;
}) {
  const classes = orientationClasses[orientation];
  return (
    <div
      aria-hidden
      data-slot="perforated-divider"
      className={cn(
        classes.line,
        notches && [notch, classes.notches],
        className,
      )}
    />
  );
}
