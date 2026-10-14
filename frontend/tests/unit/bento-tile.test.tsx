import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { BentoColumn } from "@/components/bento/bento-grid";
import { BentoTile } from "@/components/bento/bento-tile";

describe("BentoTile", () => {
  it("renders a linked tile as one link and one tab stop", async () => {
    render(
      <>
        <BentoTile href="/trips/1" title="Lahore to Karachi">
          <p>Mon, 19 Oct</p>
        </BentoTile>
        <button type="button">after</button>
      </>,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/trips/1");
    expect(link).toHaveTextContent("Lahore to Karachi");

    await userEvent.tab();
    expect(link).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "after" })).toHaveFocus();
  });

  it("applies the requested spans", () => {
    render(<BentoTile span={{ base: 2, md: 6, lg: 8 }} title="Wide" />);
    const tile = screen
      .getByRole("heading", { name: "Wide" })
      .closest("[data-slot=bento-tile]");
    expect(tile).toHaveClass("col-span-2", "md:col-span-6", "lg:col-span-8");
  });

  it("uses the requested heading level and a normal-case eyebrow", () => {
    render(
      <BentoTile title="Section tile" eyebrow="This week" headingLevel={3} />,
    );
    expect(
      screen.getByRole("heading", { level: 3, name: "Section tile" }),
    ).toBeInTheDocument();
    expect(screen.getByText("This week")).not.toHaveClass("uppercase");
  });
});

describe("BentoColumn", () => {
  it("stacks its children in one grid column", () => {
    render(
      <BentoColumn span={{ base: 2, md: 6, lg: 4 }} data-testid="column">
        <BentoTile title="First" />
        <BentoTile title="Second" />
      </BentoColumn>,
    );
    const column = screen.getByTestId("column");
    expect(column).toHaveClass("flex-col", "lg:col-span-4");
    expect(column.children).toHaveLength(2);
  });
});
