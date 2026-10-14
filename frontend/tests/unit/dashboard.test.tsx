import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AtAGlance } from "@/components/domain/at-a-glance";
import {
  MAX_TURN_ITEMS,
  RequestsLink,
  YourTurn,
  type TurnItem,
} from "@/components/domain/your-turn";

const item = (id: string): TurnItem => ({
  id,
  title: `Do ${id}`,
  detail: `Because of ${id}`,
  href: `/shipments/${id}`,
});

describe("YourTurn", () => {
  it(`shows at most ${String(MAX_TURN_ITEMS)} items, each one link`, () => {
    render(
      <YourTurn
        items={["a", "b", "c", "d"].map(item)}
        emptyAction={<button type="button">Find a trip</button>}
      />,
    );
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(MAX_TURN_ITEMS);
    expect(links[0]).toHaveAttribute("href", "/shipments/a");
    expect(links[0]).toHaveTextContent("Do a");
    expect(screen.queryByText("Do d")).toBeNull();
  });

  it("says nothing needs you, with one next step, when empty", () => {
    render(
      <YourTurn
        items={[]}
        emptyAction={<button type="button">Find a trip</button>}
      />,
    );
    expect(screen.getByText("Nothing needs you right now")).toBeVisible();
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });
});

describe("RequestsLink", () => {
  it("shows the waiting count and announces it", () => {
    render(<RequestsLink count={3} href="/requests" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/requests");
    expect(link).toHaveTextContent("See all requests3 waiting");
  });
});

describe("AtAGlance", () => {
  it("lists each stat as a label and value, linking where given", () => {
    render(
      <AtAGlance
        stats={[
          { id: "a", label: "Rating", value: "4.8" },
          {
            id: "b",
            label: "Received this month",
            value: "Rs 18,400",
            href: "/wallet",
          },
          { id: "c", label: "Delivered", value: "12" },
        ]}
      />,
    );
    expect(
      screen.getByRole("heading", { name: "At a glance" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("term")).toHaveLength(3);
    expect(screen.getByRole("link", { name: /Rs 18,400/ })).toHaveAttribute(
      "href",
      "/wallet",
    );
  });
});
