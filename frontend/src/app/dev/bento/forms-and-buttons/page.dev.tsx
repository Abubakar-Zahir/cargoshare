import type { Metadata } from "next";

import { BentoGrid } from "@/components/bento/bento-grid";
import { BentoTile } from "@/components/bento/bento-tile";
import { WeightTag } from "@/components/domain/weight-tag";
import { Button } from "@/components/ui/button";

import { ControlsDemo } from "../_components/bench-interactive";
import { BenchShell, Section } from "../_components/bench-shell";

export const metadata: Metadata = {
  title: "Bench: forms and buttons",
  robots: { index: false, follow: false },
};

export default function FormsBenchPage() {
  return (
    <BenchShell
      current="/dev/bento/forms-and-buttons"
      title="Forms and buttons"
    >
      <Section
        id="controls"
        title="Controls"
        description="One filled button per tile or screen; everything else is outlined or a text button."
      >
        <div className="max-w-4xl">
          <ControlsDemo />
        </div>
      </Section>

      <Section
        id="tiles"
        title="Tiles"
        description="Default and accent tiles at the widths the dashboard uses. Accent appears at most once per screen."
      >
        <BentoGrid>
          {([3, 4, 6, 8, 12] as const).map((lg) => (
            <BentoTile
              key={`default-${String(lg)}`}
              span={{ base: lg <= 4 ? 1 : 2, md: lg <= 4 ? 3 : 6, lg }}
              headingLevel={3}
              title={`${String(lg)} of 12`}
            >
              <p className="text-base text-ink-muted">
                <WeightTag kg="2.5" /> to Karachi
              </p>
            </BentoTile>
          ))}
          <BentoTile
            variant="accent"
            span={{ base: 2, md: 6, lg: 6 }}
            headingLevel={3}
            title="Send something"
            description="Find someone already going your way."
          >
            <Button variant="on-accent" size="sm" className="w-fit">
              Find a trip
            </Button>
          </BentoTile>
          <BentoTile
            href="#tiles"
            span={{ base: 2, md: 6, lg: 6 }}
            headingLevel={3}
            title="A whole tile can be one link"
          >
            <p className="text-base text-ink-muted">
              One tab stop, with the focus ring drawn inside the tile.
            </p>
          </BentoTile>
        </BentoGrid>
      </Section>
    </BenchShell>
  );
}
