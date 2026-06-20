import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("joins truthy class names", () => {
    expect(cn("px-4", true && "text-white", false && "hidden")).toBe(
      "px-4 text-white",
    );
  });

  it("merges conflicting Tailwind classes", () => {
    expect(cn("px-4", "px-8")).toBe("px-8");
  });
});
