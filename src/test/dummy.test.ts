import { describe, it, expect } from "vitest";
import { formatRupiah } from "@/shared/data/dummy";

describe("formatRupiah", () => {
  it("should format number as Rupiah", () => {
    // Note: Intl.NumberFormat uses non-breaking space (u00A0)
    expect(formatRupiah(1000).replace(/\u00a0/g, ' ')).toBe("Rp 1.000");
    expect(formatRupiah(1000000).replace(/\u00a0/g, ' ')).toBe("Rp 1.000.000");
  });

  it("should handle zero", () => {
    expect(formatRupiah(0).replace(/\u00a0/g, ' ')).toBe("Rp 0");
  });
});
