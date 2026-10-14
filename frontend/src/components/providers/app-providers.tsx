"use client";

import "sonner/dist/styles.css";
import type * as React from "react";

import { MotionProvider } from "@/components/motion/motion-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <MotionProvider>
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster />
    </MotionProvider>
  );
}
