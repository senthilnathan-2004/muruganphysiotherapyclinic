import { describe, it, expect } from "vitest";
import { addDaysToDateString } from "@/lib/slots";

describe("addDaysToDateString", () => {
  it("adds days within the same month", () => {
    expect(addDaysToDateString("2026-08-01", 10)).toBe("2026-08-11");
  });

  it("rolls over a month boundary", () => {
    expect(addDaysToDateString("2026-08-25", 10)).toBe("2026-09-04");
  });

  it("rolls over a year boundary", () => {
    expect(addDaysToDateString("2026-12-28", 10)).toBe("2027-01-07");
  });

  it("handles leap-day rollover", () => {
    expect(addDaysToDateString("2028-02-27", 2)).toBe("2028-02-29");
  });

  it("supports zero and negative offsets", () => {
    expect(addDaysToDateString("2026-08-13", 0)).toBe("2026-08-13");
    expect(addDaysToDateString("2026-08-13", -2)).toBe("2026-08-11");
  });
});
