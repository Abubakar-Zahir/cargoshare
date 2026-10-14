import type { Metadata } from "next";

import { BentoGrid } from "@/components/bento/bento-grid";
import { StatusLine } from "@/components/domain/status-line";
import { StepTracker } from "@/components/domain/step-tracker";
import { TileSkeleton } from "@/components/feedback/tile-skeleton";
import { Ledger, LedgerRow } from "@/components/ui/ledger";

import { StatesDemo } from "../_components/bench-interactive";
import { BenchShell, Section } from "../_components/bench-shell";

export const metadata: Metadata = {
  title: "Bench: states",
  robots: { index: false, follow: false },
};

const progressExamples = [
  {
    completed: 1,
    turn: "them",
    line: "Waiting for Sana to accept your request",
  },
  { completed: 2, turn: "you", line: "pay Rs 4,000 to confirm your space" },
  {
    completed: 4,
    turn: "them",
    line: "Waiting for Imran to confirm delivery in Peshawar",
  },
  { completed: 5, turn: "done", line: "Delivered on Sat, 10 Oct" },
] as const;

export default function StatesBenchPage() {
  return (
    <BenchShell current="/dev/bento/states" title="States">
      <Section
        id="progress"
        title="Step tracker and status line"
        description="Every shipment says what happens next and who has to act."
      >
        <Ledger className="max-w-4xl">
          {progressExamples.map((example) => (
            <LedgerRow key={example.line} className="flex flex-col gap-4">
              <StepTracker completed={example.completed} />
              <StatusLine turn={example.turn}>{example.line}</StatusLine>
            </LedgerRow>
          ))}
          <LedgerRow className="flex flex-col gap-4">
            <StepTracker
              completed={4}
              issue={{ label: "Disputed", tone: "danger" }}
            />
            <StatusLine turn="problem">
              Hira says the box arrived damaged. An admin will contact you both.
            </StatusLine>
          </LedgerRow>
        </Ledger>
      </Section>

      <Section
        id="empty-error"
        title="Empty and error"
        description="Empty states offer one next step. Errors say what went wrong and how to fix it."
      >
        <div className="@container max-w-4xl">
          <StatesDemo />
        </div>
      </Section>

      <Section id="loading" title="Loading">
        <BentoGrid>
          <TileSkeleton
            span={{ base: 2, md: 3, lg: 4 }}
            label="Loading trips"
          />
          <TileSkeleton
            span={{ base: 2, md: 3, lg: 4 }}
            lines={5}
            label="Loading requests"
          />
          <TileSkeleton
            span={{ base: 2, md: 6, lg: 4 }}
            lines={2}
            label="Loading ratings"
          />
        </BentoGrid>
      </Section>
    </BenchShell>
  );
}
