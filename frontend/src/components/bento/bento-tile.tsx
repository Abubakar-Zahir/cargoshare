import { cn } from "cn";
import Link from "next/link";
import type * as React from "react";

import { spanClasses, type Span } from "./spans";

export type TileVariant = "default" | "accent";

const variantClasses: Record<TileVariant, { shell: string; muted: string }> = {
  default: {
    shell: "border border-line bg-surface text-ink shadow-paper",
    muted: "text-ink-muted",
  },
  accent: {
    shell: "border border-transparent bg-accent text-accent-ink",
    muted: "text-accent-ink",
  },
};

interface CommonProps {
  span?: Span;
  variant?: TileVariant;
  title?: React.ReactNode;
  eyebrow?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  headingLevel?: 2 | 3;
  children?: React.ReactNode;
  className?: string;
  as?: "section" | "article" | "div" | "li";
}

export type BentoTileProps =
  | (CommonProps & { href: string; action?: never })
  | (CommonProps & { href?: undefined; action?: React.ReactNode });

export function BentoTile(props: BentoTileProps) {
  const {
    span,
    variant = "default",
    title,
    eyebrow,
    description,
    footer,
    headingLevel = 2,
    children,
    className,
    as: Element = "section",
  } = props;
  const styles = variantClasses[variant];
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const action = props.href === undefined ? props.action : undefined;
  const hasHeader =
    eyebrow !== undefined || title !== undefined || action !== undefined;

  const body = (
    <div className="@container flex min-w-0 flex-col gap-4 p-5 sm:p-6">
      {hasHeader && (
        <div className="flex min-w-0 flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <div className="flex min-w-0 flex-col gap-1">
            {eyebrow !== undefined && (
              <p className={cn("text-sm", styles.muted)}>{eyebrow}</p>
            )}
            {title !== undefined && (
              <Heading className="font-display text-title text-balance">
                {title}
              </Heading>
            )}
            {description !== undefined && (
              <p className={cn("text-base", styles.muted)}>{description}</p>
            )}
          </div>
          {action !== undefined && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
      {footer !== undefined && (
        <div className={cn("text-base", styles.muted)}>{footer}</div>
      )}
    </div>
  );

  const shell = cn(
    "relative flex min-w-0 flex-col overflow-hidden rounded-tile-sm sm:rounded-tile",
    styles.shell,
    span !== undefined && spanClasses(span),
    props.href !== undefined &&
      "transition-[translate,box-shadow] duration-250 ease-soft hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-offset-[-4px]",
    className,
  );

  if (props.href !== undefined) {
    return (
      <Link
        prefetch={false}
        href={props.href}
        data-slot="bento-tile"
        data-variant={variant}
        className={shell}
      >
        {body}
      </Link>
    );
  }

  return (
    <Element data-slot="bento-tile" data-variant={variant} className={shell}>
      {body}
    </Element>
  );
}
