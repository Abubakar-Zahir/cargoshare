import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CapacityBar } from "@/components/domain/capacity-bar";
import { GetStarted } from "@/components/domain/get-started";
import { PriceBreakdown } from "@/components/domain/price-breakdown";
import { RatingStars } from "@/components/domain/rating-stars";
import { RouteCode } from "@/components/domain/route-code";
import { StatusLine } from "@/components/domain/status-line";
import { StatusStamp } from "@/components/domain/status-stamp";
import { StepTracker } from "@/components/domain/step-tracker";
import { TicketPass } from "@/components/domain/ticket-pass";
import { shipmentStatus, tripStatus } from "@/lib/status";

describe("StatusStamp", () => {
  it("shows the status as words", () => {
    render(<StatusStamp status={shipmentStatus.in_transit} />);
    expect(screen.getByText("On its way")).toBeVisible();
  });
});

describe("RatingStars", () => {
  it("announces the score and count", () => {
    render(<RatingStars value={4.56} count={12} />);
    expect(
      screen.getByText("Rated 4.6 out of 5 (12 ratings)"),
    ).toBeInTheDocument();
  });

  it("says when there are no ratings", () => {
    render(<RatingStars value={null} />);
    expect(screen.getByText("No ratings yet")).toBeVisible();
  });
});

describe("CapacityBar", () => {
  it("states remaining and total capacity in text", () => {
    const { container } = render(
      <CapacityBar remainingKg="12.5" totalKg={20} />,
    );
    expect(container.querySelector("p")).toHaveTextContent(
      "12.5 of 20 kg left",
    );
  });
});

describe("RouteCode", () => {
  it("reads as a sentence for screen readers", () => {
    render(<RouteCode origin="Lahore" destination="Karachi" labelled />);
    expect(screen.getByText("Lahore to Karachi")).toHaveClass("sr-only");
    expect(screen.getByText("LHE")).toBeInTheDocument();
    expect(screen.getByText("From")).toBeInTheDocument();
  });
});

describe("PriceBreakdown", () => {
  it("shows weight times rate equals total", () => {
    const { container } = render(
      <PriceBreakdown weightKg={5} ratePerKg={800} total={4000} />,
    );
    expect(container.querySelector("[aria-hidden]")).toHaveTextContent(
      "5 kg × Rs 800 = Rs 4,000",
    );
    expect(
      screen.getByText("5 kg at Rs 800 per kg, total Rs 4,000"),
    ).toHaveClass("sr-only");
  });
});

describe("StatusLine", () => {
  it("prefixes the user's own turn", () => {
    render(<StatusLine turn="you">confirm handoff</StatusLine>);
    expect(screen.getByText("Your turn:")).toBeVisible();
  });

  it("states plainly who else must act", () => {
    render(
      <StatusLine turn="them">Waiting for Bilal to pay Rs 4,000</StatusLine>,
    );
    expect(screen.queryByText("Your turn:")).toBeNull();
    expect(screen.getByText("Waiting for Bilal to pay Rs 4,000")).toBeVisible();
  });
});

describe("StepTracker", () => {
  it("marks done steps and the next step", () => {
    render(<StepTracker completed={2} />);
    const steps = screen.getAllByRole("listitem");
    expect(steps).toHaveLength(5);
    expect(
      within(steps[0] ?? document.body).getByText(/done/),
    ).toBeInTheDocument();
    expect(steps[2]).toHaveAttribute("aria-current", "step");
    expect(steps[2]).toHaveTextContent("Paid");
  });

  it("shows an issue instead of a next step", () => {
    render(
      <StepTracker
        completed={4}
        issue={{ label: "Disputed", tone: "danger" }}
      />,
    );
    expect(screen.getByText("Disputed")).toBeVisible();
    expect(
      screen
        .getAllByRole("listitem")
        .some((step) => step.hasAttribute("aria-current")),
    ).toBe(false);
  });
});

describe("TicketPass", () => {
  const pass = {
    origin: "Lahore",
    destination: "Karachi",
    departureDate: "2026-10-19",
    carrierName: "Sana",
    carrierVerified: true,
    remainingKg: "12.5",
    totalKg: 20,
    ratePerKg: 800,
    status: tripStatus.active,
  };

  it("prints each fact once: route and date on the pass, rate and space on the stub", () => {
    render(<TicketPass {...pass} />);
    expect(screen.getAllByText("LHE")).toHaveLength(1);
    expect(screen.getAllByText("Mon, 19 Oct")).toHaveLength(1);
    expect(screen.getAllByText("800")).toHaveLength(1);
    expect(screen.getByText("Open")).toBeVisible();
    expect(screen.getByText(", ID verified")).toHaveClass("sr-only");
  });

  it("becomes a single link when it has an href", () => {
    render(<TicketPass {...pass} href="/trips/1" />);
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });
});

describe("GetStarted", () => {
  const step = (id: string, done: boolean) => ({
    id,
    title: `Step ${id}`,
    description: `Do ${id}`,
    done,
    action: <button type="button">Go {id}</button>,
  });

  it("counts progress and offers actions only for open steps", () => {
    render(<GetStarted steps={[step("a", true), step("b", false)]} />);
    expect(screen.getByText("1 of 2 done")).toBeVisible();
    expect(screen.queryByRole("button", { name: "Go a" })).toBeNull();
    expect(screen.getByRole("button", { name: "Go b" })).toBeVisible();
  });

  it("disappears when every step is done", () => {
    const { container } = render(
      <GetStarted steps={[step("a", true), step("b", true)]} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
