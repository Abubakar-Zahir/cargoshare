import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { applyTheme } from "@/lib/theme";

afterEach(() => {
  applyTheme("system");
});

describe("ThemeSwitcher", () => {
  it("is a labelled group of buttons that applies the choice", async () => {
    render(<ThemeSwitcher initialTheme="system" />);
    const group = screen.getByRole("group", { name: "Theme" });
    expect(group).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "System" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await userEvent.click(screen.getByRole("button", { name: "Dark" }));
    expect(screen.getByRole("button", { name: "Dark" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "System" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("posts the choice when JavaScript has not loaded yet", () => {
    render(<ThemeSwitcher initialTheme="light" />);
    for (const name of ["Light", "Dark", "System"]) {
      const button = screen.getByRole("button", { name });
      expect(button).toHaveAttribute("type", "submit");
      expect(button).toHaveAttribute("name", "theme");
    }
  });
});

describe("ThemeToggle", () => {
  it("offers both directions so CSS can show the one that fits", async () => {
    render(<ThemeToggle />);
    await userEvent.click(
      screen.getByRole("button", { name: "Switch to dark theme" }),
    );
    expect(document.documentElement.dataset.theme).toBe("dark");

    await userEvent.click(
      screen.getByRole("button", { name: "Switch to light theme" }),
    );
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(
      screen.getByRole("button", { name: "Switch to dark theme" }),
    ).toHaveAttribute("value", "dark");
  });

  it("keeps every theme control on the page in step", async () => {
    render(
      <>
        <ThemeToggle />
        <ThemeSwitcher initialTheme="system" />
      </>,
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Switch to dark theme" }),
    );
    expect(screen.getByRole("button", { name: "Dark" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
