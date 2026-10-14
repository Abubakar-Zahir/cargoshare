import { render, screen } from "@testing-library/react";
import { MotionConfig } from "motion/react";
import { describe, expect, it } from "vitest";

import { FlipNumber } from "@/components/domain/flip-number";

describe("FlipNumber", () => {
  it("exposes the formatted value once to assistive tech", () => {
    render(
      <MotionConfig reducedMotion="never">
        <FlipNumber value={4000} kind="money" />
      </MotionConfig>,
    );
    expect(screen.getByText("Rs 4,000")).toHaveClass("sr-only");
  });

  it("animates per character when motion is allowed", () => {
    const { container } = render(
      <MotionConfig reducedMotion="never">
        <FlipNumber value={2.5} kind="weight" />
      </MotionConfig>,
    );
    expect(container.querySelector("[aria-hidden]")?.children).toHaveLength(6);
  });

  it("renders plain text under reduced motion", () => {
    const { container } = render(
      <MotionConfig reducedMotion="always">
        <FlipNumber value={2.5} kind="weight" />
      </MotionConfig>,
    );
    const visual = container.querySelector("[aria-hidden]");
    expect(visual).toHaveTextContent("2.5 kg");
    expect(visual?.children).toHaveLength(0);
  });
});
