import { describe, expect, it } from "vitest";

import {
  bottomNavItems,
  createItem,
  isActive,
  sidebarItems,
} from "@/components/shell/nav-items";
import { navCookie, parseNavMode } from "@/components/shell/nav-state";
import { initials } from "@/components/shell/user-menu";

const labels = (items: { label: string }[]) => items.map((item) => item.label);

describe("sidebar", () => {
  it("lists the seven destinations for someone who carries things", () => {
    expect(labels(sidebarItems({ canCarry: true }))).toEqual([
      "Home",
      "Search",
      "Requests",
      "My trips",
      "Shipments",
      "Wallet",
      "Profile",
    ]);
  });

  it("hides Requests and My trips for someone who only sends", () => {
    expect(labels(sidebarItems({ canCarry: false }))).toEqual([
      "Home",
      "Search",
      "Shipments",
      "Wallet",
      "Profile",
    ]);
  });

  it("puts the requests badge on Requests", () => {
    const requests = sidebarItems({ canCarry: true }).find(
      (item) => item.id === "requests",
    );
    expect(requests?.badge).toBe("requests");
  });
});

describe("bottom nav", () => {
  it("has five items with Post for someone who carries things", () => {
    const items = bottomNavItems({ canCarry: true });
    expect(labels(items)).toEqual([
      "Home",
      "Search",
      "Post",
      "Shipments",
      "Profile",
    ]);
    expect(items[2]?.href).toBe("/trips/new");
    expect(items[0]?.badge).toBe("requests");
  });

  it("turns Post into Send, opening search, for someone who only sends", () => {
    const items = bottomNavItems({ canCarry: false });
    expect(labels(items)).toEqual([
      "Home",
      "Search",
      "Send",
      "Shipments",
      "Profile",
    ]);
    expect(createItem({ canCarry: false }).href).toBe("/search");
    expect(items[0]?.badge).toBeUndefined();
  });
});

describe("isActive", () => {
  const items = sidebarItems({ canCarry: true });
  const byId = (id: string) => {
    const item = items.find((candidate) => candidate.id === id);
    if (item === undefined) {
      throw new Error(id);
    }
    return item;
  };

  it("marks the matching section, including nested pages", () => {
    expect(isActive(byId("trips"), "/trips", items)).toBe(true);
    expect(isActive(byId("trips"), "/trips/abc/edit", items)).toBe(true);
    expect(isActive(byId("home"), "/trips", items)).toBe(false);
  });

  it("does not match on a shared prefix that is not a path segment", () => {
    expect(isActive(byId("search"), "/searching", items)).toBe(false);
  });

  it("marks only Search, never Send, on the search page", () => {
    const bottom = bottomNavItems({ canCarry: false });
    const [, search, send] = bottom;
    if (search === undefined || send === undefined) {
      throw new Error("missing items");
    }
    expect(isActive(search, "/search", bottom)).toBe(true);
    expect(isActive(send, "/search", bottom)).toBe(false);
  });
});

describe("nav state", () => {
  it("defaults to the full sidebar and accepts only rail as the other value", () => {
    expect(parseNavMode(undefined)).toBe("full");
    expect(parseNavMode("rail")).toBe("rail");
    expect(parseNavMode("tiny")).toBe("full");
  });

  it("persists for a year and is secure on https", () => {
    expect(navCookie("rail", true)).toBe(
      "nav=rail; path=/; max-age=31536000; samesite=lax; secure",
    );
  });
});

describe("initials", () => {
  it.each([
    ["Sana Malik", "SM"],
    ["sana", "S"],
    ["  Muhammad Bilal  Ahmed ", "MB"],
  ])("takes up to two initials from %s", (name, expected) => {
    expect(initials(name)).toBe(expected);
  });
});
