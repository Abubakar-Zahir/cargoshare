"use client";

import { cn } from "cn";
import { Dialog as SheetPrimitive } from "radix-ui";
import type * as React from "react";

import { DialogCloseButton, DialogOverlay } from "@/components/ui/dialog";

const sideClasses = {
  left: "inset-y-0 left-0 w-[min(20rem,85vw)] border-r data-open:slide-in-from-left data-closed:slide-out-to-left",
  right:
    "inset-y-0 right-0 w-[min(24rem,85vw)] border-l data-open:slide-in-from-right data-closed:slide-out-to-right",
} as const;

function Sheet(props: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger(
  props: React.ComponentProps<typeof SheetPrimitive.Trigger>,
) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose(props: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: keyof typeof sideClasses;
}) {
  return (
    <SheetPrimitive.Portal>
      <DialogOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "fixed z-50 flex flex-col gap-4 overflow-y-auto border-line bg-surface p-5 pt-[max(1.25rem,env(safe-area-inset-top))] text-ink shadow-lift duration-250 ease-soft data-open:animate-in data-closed:animate-out",
          sideClasses[side],
          className,
        )}
        {...props}
      >
        {children}
        <DialogCloseButton />
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 pr-10", className)}
      {...props}
    />
  );
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("font-display text-title", className)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-base text-ink-muted", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
};
